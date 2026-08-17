import pandas as pd
import tempfile
import subprocess
import os
import sys
import json
from pathlib import Path

class SandboxService:
    @staticmethod
    def execute(code: str, df: pd.DataFrame):
        # We enforce strict security by restricting the execution environment 
        # and running it in an isolated subprocess with a timeout.
        
        with tempfile.TemporaryDirectory() as tmpdir:
            tmpdir_path = Path(tmpdir)
            
            df_path = tmpdir_path / "df.pkl"
            code_path = tmpdir_path / "code.py"
            out_path = tmpdir_path / "output.json"
            
            # Serialize DataFrame
            df.to_pickle(str(df_path))
            
            # Write code to file
            with open(code_path, "w", encoding="utf-8") as f:
                f.write(code)
            
            worker_script = Path(__file__).parent / "sandbox_worker.py"
            
            try:
                # Strip all environment variables except those strictly required by Python/Windows
                # This prevents exposing DATABASE_URL, Supabase keys, or Gemini API keys to the generated code.
                # NOTE: For true OS/container isolation in production, a containerized solution like Docker or gVisor is required.
                safe_env = {
                    "PATH": os.environ.get("PATH", ""),
                    "SYSTEMROOT": os.environ.get("SYSTEMROOT", ""),
                    "USERPROFILE": os.environ.get("USERPROFILE", ""),
                }

                # Run the subprocess with a 15-second timeout
                subprocess.run(
                    [sys.executable, str(worker_script), str(df_path), str(code_path), str(out_path)],
                    timeout=15,
                    check=True,
                    capture_output=True,
                    text=True,
                    env=safe_env
                )
            except subprocess.TimeoutExpired:
                return {
                    "success": False,
                    "error_type": "TimeoutExpired",
                    "error": "Execution Error: The analysis took too long and was terminated.",
                }
            except subprocess.CalledProcessError as e:
                # The script exited with a non-zero status
                return {
                    "success": False,
                    "error_type": "UnknownExecutionError",
                    "error": f"Execution Error: Sandbox process failed unexpectedly.\nStderr: {e.stderr}",
                }
            
            if not out_path.exists():
                return {
                    "success": False,
                    "error_type": "UnknownExecutionError",
                    "error": "Execution Error: Sandbox process did not return a result.",
                }
                
            try:
                with open(out_path, "r", encoding="utf-8") as f:
                    result = json.load(f)
                return result
            except Exception as e:
                return {
                    "success": False,
                    "error_type": "UnknownExecutionError",
                    "error": f"Execution Error: Failed to parse sandbox result. {str(e)}",
                }
