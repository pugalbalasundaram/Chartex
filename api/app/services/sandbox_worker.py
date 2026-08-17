import sys
import json
import pandas as pd
import numpy as np

def restricted_import(name, globals=None, locals=None, fromlist=(), level=0):
    allowed_modules = ["pandas", "numpy", "matplotlib", "plotly", "scipy", "sklearn"]
    base_module = name.split('.')[0]
    if base_module in allowed_modules:
        return __import__(name, globals, locals, fromlist, level)
    raise ImportError(f"Security: Import of module '{name}' is strictly prohibited in the sandbox.")

def execute_worker(input_df_path, code_path, output_result_path):
    try:
        # Load the dataframe
        df = pd.read_pickle(input_df_path)

        # Load the code
        with open(code_path, "r", encoding="utf-8") as f:
            code = f.read()

        safe_builtins = {
            'print': print,
            'len': len,
            'range': range,
            'int': int,
            'float': float,
            'str': str,
            'bool': bool,
            'list': list,
            'dict': dict,
            'set': set,
            'tuple': tuple,
            'sum': sum,
            'min': min,
            'max': max,
            'abs': abs,
            'round': round,
            '__import__': restricted_import,
            'Exception': Exception,
            'ValueError': ValueError,
            'TypeError': TypeError,
            'KeyError': KeyError,
            'IndexError': IndexError,
            'ZeroDivisionError': ZeroDivisionError,
            'True': True,
            'False': False,
            'None': None,
            'zip': zip,
            'enumerate': enumerate,
            'map': map,
            'filter': filter,
            'all': all,
            'any': any,
            'sorted': sorted,
            'isinstance': isinstance,
            'issubclass': issubclass,
            'hasattr': hasattr,
            'getattr': getattr,
        }

        local_vars = {
            'df': df,
            'result_text': "",
            'chart_type': None,
            'chart_data': None,
            'table_data': None,
        }

        global_vars = {
            '__builtins__': safe_builtins,
            'pd': pd,
            'np': np
        }

        exec(code, global_vars, local_vars)

        # Truncate large payloads
        table_data = local_vars.get("table_data")
        if isinstance(table_data, list):
            if len(table_data) > 100:
                table_data = table_data[:100]
                # Optionally append a warning to result_text, though we will just silently truncate for safety.

        chart_data = local_vars.get("chart_data")
        if isinstance(chart_data, dict):
            labels = chart_data.get("labels", [])
            values = chart_data.get("values", [])
            if isinstance(labels, list) and len(labels) > 1000:
                chart_data["labels"] = labels[:1000]
            if isinstance(values, list) and len(values) > 1000:
                chart_data["values"] = values[:1000]

        result = {
            "success": True,
            "result_text": str(local_vars.get("result_text", "")),
            "chart_type": local_vars.get("chart_type", None),
            "chart_data": chart_data,
            "table_data": table_data,
        }

    except Exception as e:
        error_type = type(e).__name__
        if isinstance(e, ImportError) and "Security:" in str(e):
            error_type = "SecurityViolation"
            
        result = {
            "success": False,
            "error_type": error_type,
            "error": f"Execution Error: {str(e)}"
        }

    with open(output_result_path, "w", encoding="utf-8") as f:
        json.dump(result, f)

if __name__ == "__main__":
    if len(sys.argv) < 4:
        sys.exit(1)
    
    input_df_path = sys.argv[1]
    code_path = sys.argv[2]
    output_result_path = sys.argv[3]

    execute_worker(input_df_path, code_path, output_result_path)
