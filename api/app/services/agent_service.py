import pandas as pd
import json
from typing import Any, Dict, List
from enum import Enum
from app.services.llm_service import LLMService
from app.services.sandbox_service import SandboxService
from app.services.visualization_service import VisualizationIntelligence

class AnalysisErrorType(Enum):
    SYNTAX_ERROR = "SYNTAX_ERROR"
    MISSING_COLUMN = "MISSING_COLUMN"
    DATA_TYPE_ERROR = "DATA_TYPE_ERROR"
    PANDAS_ERROR = "PANDAS_ERROR"
    EMPTY_RESULT = "EMPTY_RESULT"
    TIMEOUT = "TIMEOUT"
    SECURITY_VIOLATION = "SECURITY_VIOLATION"
    UNKNOWN = "UNKNOWN"

class AgentService:
    def __init__(self):
        self.llm = LLMService()

    def _classify_error(self, sandbox_result: Dict[str, Any]) -> AnalysisErrorType:
        if sandbox_result.get("success"):
            return AnalysisErrorType.UNKNOWN

        error_type = sandbox_result.get("error_type", "")
        error_msg = sandbox_result.get("error", "")

        if error_type == "SecurityViolation":
            return AnalysisErrorType.SECURITY_VIOLATION
        if error_type == "TimeoutExpired":
            return AnalysisErrorType.TIMEOUT
        if error_type in ["SyntaxError", "IndentationError"]:
            return AnalysisErrorType.SYNTAX_ERROR
        if error_type == "KeyError" or "KeyError" in error_msg:
            return AnalysisErrorType.MISSING_COLUMN
        if error_type in ["TypeError", "ValueError"]:
            return AnalysisErrorType.DATA_TYPE_ERROR
        if "pandas" in error_msg.lower() or error_type in ["AttributeError"]:
            return AnalysisErrorType.PANDAS_ERROR
            
        return AnalysisErrorType.UNKNOWN

    def _is_empty_result(self, sandbox_result: Dict[str, Any]) -> bool:
        if not sandbox_result.get("success"):
            return False
            
        rt = sandbox_result.get("result_text", "")
        if isinstance(rt, str):
            rt = rt.strip()
        cd = sandbox_result.get("chart_data")
        td = sandbox_result.get("table_data")
        
        has_text = bool(rt) and rt != "None" and rt != "NaN"
        has_chart = bool(cd and (cd.get("labels") or cd.get("values")))
        has_table = bool(td and len(td) > 0)
        
        return not (has_text or has_chart or has_table)

    def _resolve_context(self, question: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
        if not history:
            return {"is_follow_up": False, "resolved_question": question}
            
        system_prompt = """
You are an expert Data Analysis Context Resolver.
Given a new user question and the recent conversation history, determine if the new question is a "follow-up" to previous analyses or a completely "standalone" question.
A follow-up modifies, clarifies, or requests a different presentation of the previous analysis (e.g., "What about 2025?", "Show it as a bar chart", "Compare it with South", "Average instead").
A standalone question introduces a completely new, unrelated analytical topic.
If it is a follow-up, resolve all pronouns ("it", "that") and missing context to create a fully explicit, standalone "resolved_question".
If the user explicitly says to ignore previous context or start over, treat it as standalone.

Output EXACTLY a JSON object with this schema:
{
  "is_follow_up": boolean,
  "resolved_question": "The fully explicit question, or null if not a follow-up"
}
"""
        # Limit context to last 10 messages (5 user-assistant pairs)
        recent_history = history[-10:]
        history_text = "\n".join([f"{msg.get('role', 'unknown')}: {msg.get('content', '')}" for msg in recent_history])
        
        prompt = f"""
Recent Conversation Context:
{history_text}

New User Question:
{question}
"""
        try:
            res_str = self.llm.generate(system_prompt, prompt)
            res_str = res_str.replace("```json", "").replace("```", "").strip()
            result = json.loads(res_str)
            
            # Validation
            if not isinstance(result.get("is_follow_up"), bool):
                return {"is_follow_up": False, "resolved_question": question}
                
            if result["is_follow_up"] and not result.get("resolved_question"):
                return {"is_follow_up": False, "resolved_question": question}
                
            return result
        except Exception:
            return {"is_follow_up": False, "resolved_question": question}

    def _generate_plan(self, dataframe: pd.DataFrame, data_types: Dict[str, str], question: str) -> Dict[str, Any]:
        system_prompt = """
You are an expert Data Analysis Planner.
Determine if the user's question requires a simple one-step analysis or a multi-step analytical workflow.
A simple question can be answered with a single pandas query (e.g., 'What is the average sales?', 'Show sales by category.').
A multi-step question requires dependent operations (e.g., 'Find the average sales, then show categories above the average.').
If simple, set complexity to "simple" and provide a single step.
If multi-step, set complexity to "multi_step" and break the analysis into sequential steps (MAX 5).

Also determine the user's visualization intent. Determine if a chart is needed (should_visualize), the requested chart type ('bar', 'pie', 'line', 'area', etc. or null), and the purpose.

Output EXACTLY a JSON object with this schema:
{
  "complexity": "simple|multi_step",
  "steps": [
    {
      "id": "step_1",
      "description": "Calculate total sales by category",
      "purpose": "category_sales"
    }
  ],
  "visualization_intent": {
    "should_visualize": true,
    "requested_chart": "bar",
    "purpose": "comparison"
  }
}
"""
        prompt = f"""
Dataset Columns: {', '.join(dataframe.columns)}
Data Types: {json.dumps(data_types)}

User Question: {question}
"""
        try:
            res_str = self.llm.generate(system_prompt, prompt)
            res_str = res_str.replace("```json", "").replace("```", "").strip()
            plan = json.loads(res_str)
            
            # Validation
            if not isinstance(plan.get("steps"), list):
                plan["steps"] = [{"id": "step_1", "description": "General analysis", "purpose": "analysis"}]
            if len(plan["steps"]) > 5:
                plan["steps"] = plan["steps"][:5]
            
            return plan
        except Exception:
            return {
                "complexity": "simple",
                "steps": [{"id": "step_1", "description": "General analysis", "purpose": "analysis"}],
                "visualization_intent": {"should_visualize": True, "requested_chart": None, "purpose": "analysis"}
            }

    def process_query_stream(
        self,
        dataframe: pd.DataFrame,
        statistics: Dict[str, Any],
        data_types: Dict[str, str],
        question: str,
        history: List[Dict[str, str]] = [],
    ):
        yield json.dumps({"content": "> 🤔 Analyzing request...\n"})
        
        # 0. CONTEXT RESOLUTION
        if history:
            yield json.dumps({"content": "> 🧠 Understanding follow-up...\n"})
            context_resolution = self._resolve_context(question, history)
            if context_resolution.get("is_follow_up"):
                question = context_resolution.get("resolved_question", question)
                yield json.dumps({"content": "> 🔗 Using previous analysis...\n"})
        
        # 1. PLAN ANALYSIS
        yield json.dumps({"content": "> 🧠 Building analysis plan...\n"})
        plan = self._generate_plan(dataframe, data_types, question)
        
        is_multi_step = plan.get("complexity") == "multi_step" and len(plan.get("steps", [])) > 1
        steps = plan.get("steps", [])
        
        global_executions = 0
        MAX_GLOBAL_EXECUTIONS = 10
        
        history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-4:]])
        
        system_instruction_code = """
You are an expert Data Analyst Python Programmer.
Your goal is to write a Python script using pandas to analyze a dataset based on the user's question and step instruction.

The dataset is already loaded into a pandas DataFrame named `df`.

Write ONLY valid Python code. Do not use Markdown formatting (like ```python).
The script MUST assign the following variables:
1. `result_text`: A string containing the raw textual/numerical answer computed.
2. `table_data`: A list of dictionaries representing the multi-row analytical result. This MUST be populated if the result contains multiple items/categories to be visualized or displayed. Otherwise, None.

Do not use print() to return results. Do not plot images using matplotlib.plt.show(). Extract data into the variables.
If you cannot answer the question, set `result_text` to an error explanation string.
"""
        
        step_results_context = []
        executed_codes = []
        final_table_data = None
        
        overall_success = True
        explanation_context = ""
        
        for idx, step in enumerate(steps):
            if global_executions >= MAX_GLOBAL_EXECUTIONS:
                overall_success = False
                explanation_context = "Execution budget exceeded. The analysis required too many steps."
                break
                
            step_desc = step.get("description", f"Step {idx+1}")
            
            if is_multi_step:
                yield json.dumps({"content": f"> 📊 Analyzing step {idx+1} of {len(steps)}...\n"})
            else:
                yield json.dumps({"content": "> 💻 Generating Pandas analysis...\n"})
                
            prompt_code = f"""
Dataset Columns: {', '.join(dataframe.columns)}
Data Types: {json.dumps(data_types)}

Conversation History:
{history_text}

User Question: {question}

Current Step: {step_desc}

Previous Step Results:
{json.dumps(step_results_context, indent=2) if step_results_context else "None"}
"""

            try:
                code = self.llm.generate(system_instruction_code, prompt_code)
                code = code.replace("```python", "").replace("```", "").strip()
            except Exception as e:
                overall_success = False
                explanation_context = f"Failed to generate code for step {idx+1}."
                break

            if not is_multi_step:
                yield json.dumps({"content": "> ⚙️ Executing securely...\n"})
                
            sandbox_result = SandboxService.execute(code, dataframe)
            executed_codes.append({"description": step_desc, "code": code})
            global_executions += 1
            
            # STATE MACHINE CORRECTION
            correction_attempts = 0
            if not sandbox_result["success"]:
                classification = self._classify_error(sandbox_result)
                
                if classification == AnalysisErrorType.SECURITY_VIOLATION:
                    sandbox_result = {"success": False, "error": "Charex couldn't safely execute this analysis."}
                elif classification != AnalysisErrorType.UNKNOWN and correction_attempts < 1 and global_executions < MAX_GLOBAL_EXECUTIONS:
                    correction_attempts += 1
                    
                    msg = "> 🔧 Correcting analysis..."
                    if is_multi_step:
                        msg = f"> 🔧 Correcting step {idx+1}..."
                        
                    if classification == AnalysisErrorType.TIMEOUT:
                        if is_multi_step:
                            msg = f"> 🔧 Optimizing step {idx+1}..."
                        else:
                            msg = "> 🔧 Optimizing performance..."
                    elif classification == AnalysisErrorType.MISSING_COLUMN:
                        if is_multi_step:
                            msg = f"> 🔧 Correcting step {idx+1} (Missing Column)..."
                        else:
                            msg = "> 🔧 Correcting analysis (Missing Column)..."
                        
                    yield json.dumps({"content": f"{msg}\n"})
                    
                    correction_prompt = f"""
{prompt_code}

PREVIOUS CODE:
{code}

EXECUTION ERROR:
{sandbox_result.get('error')}

ERROR TYPE:
{classification.value}

INSTRUCTIONS:
Correct the analysis code.
Do not change the user's intent.
Use only the approved analysis libraries.
Return executable Python only.
This is the final automatic correction attempt.
Do not repeat the previous mistake.
"""
                    try:
                        corrected_code = self.llm.generate(system_instruction_code, correction_prompt)
                        corrected_code = corrected_code.replace("```python", "").replace("```", "").strip()
                        
                        if not is_multi_step:
                            yield json.dumps({"content": "> ⚙️ Retrying execution...\n"})
                            
                        sandbox_result = SandboxService.execute(corrected_code, dataframe)
                        executed_codes.append({"description": f"{step_desc} (Corrected)", "code": corrected_code})
                        global_executions += 1
                    except Exception:
                        pass
                        
            if not sandbox_result["success"]:
                overall_success = False
                raw_err = sandbox_result.get("error", "")
                if "safely execute" in raw_err:
                    explanation_context = "Charex couldn't safely execute this analysis. It attempted a security violation."
                elif "took too long" in raw_err:
                    explanation_context = "This analysis was too computationally expensive to complete safely (Timeout)."
                else:
                    explanation_context = f"Charex couldn't complete this analysis at step {idx+1}. Execution failed with error: {raw_err}."
                break
            
            # Step success
            is_empty = self._is_empty_result(sandbox_result)
            rt = sandbox_result.get("result_text", "")
            if isinstance(rt, str):
                rt = rt.strip()
            
            if sandbox_result.get("table_data"):
                final_table_data = sandbox_result.get("table_data")
                
            step_summary = {
                "step_id": step.get("id"),
                "description": step_desc,
                "result_text": rt,
                "is_empty_result": is_empty
            }
            step_results_context.append(step_summary)
            
            # If empty result, we still continue if multi-step, but it might just propagate empty data
            
        # Final Synthesis
        if overall_success:
            yield json.dumps({"content": "> ✓ Preparing final insights...\n"})
            if is_multi_step:
                explanation_context = "Multi-step Analysis completed. Step summaries:\n"
                for res in step_results_context:
                    explanation_context += f"- {res['description']}: {res['result_text']}\n"
            else:
                if step_results_context and step_results_context[0].get("is_empty_result"):
                    explanation_context = "The analysis completed successfully, but no records matched the requested condition. The result is empty."
                elif step_results_context:
                    explanation_context = f"The computed result is: {step_results_context[0]['result_text']}"
        else:
            yield json.dumps({"content": "> 📝 Preparing insights...\n"})
            
        system_instruction_explain = """
You are Charex AI, an expert Data Analyst explaining results to a user.
You are given the computed result of an analysis based on the user's question.
Explain what happened, why it happened, and important observations.
Do NOT hallucinate data. Only explain the computed result provided.
Output EXACTLY a JSON object with this schema:
{
  "answer": "string (the explanation)",
  "suggestions": ["Action 1", "Action 2", "Action 3"]
}
"""
        
        prompt_explain = f"""
User Question: {question}

Context: {explanation_context}
"""
        try:
            explain_json_str = self.llm.generate(system_instruction_explain, prompt_explain)
            explain_json_str = explain_json_str.replace("```json", "").replace("```", "").strip()
            
            try:
                explanation = json.loads(explain_json_str)
            except json.JSONDecodeError:
                explanation = {
                    "answer": explain_json_str,
                    "suggestions": ["Try again"]
                }
        except RuntimeError as e:
            explanation = {
                "answer": f"⚠️ {str(e)}",
                "suggestions": ["Try again"]
            }
        except Exception:
            explanation = {
                "answer": "⚠️ Analysis explanation failed.",
                "suggestions": ["Try again"]
            }

        if not overall_success:
            if "safely execute" in explanation_context:
                explanation["answer"] = "⚠️ Charex couldn't safely execute this analysis."
            elif "Timeout" in explanation_context or "computationally expensive" in explanation_context:
                explanation["answer"] = "⚠️ This analysis was too computationally expensive to complete safely."
            elif "couldn't complete" in explanation_context:
                explanation["answer"] = "⚠️ Charex couldn't complete this analysis. Please try rephrasing the question or checking the dataset columns."
            elif "budget exceeded" in explanation_context:
                explanation["answer"] = "⚠️ The analysis required too many complex steps to finish."

        if overall_success and not is_multi_step and step_results_context and step_results_context[0].get("is_empty_result"):
            explanation["answer"] = explanation.get("answer", "") + "\n\n(The analysis completed, but no records matched the requested condition.)"

        yield json.dumps({"content": "\n---\n\n" + explanation.get("answer", "Analysis complete.")})
        
        # Determine visualization
        viz_intent = plan.get("visualization_intent", {"should_visualize": True, "requested_chart": None})
        viz_result = VisualizationIntelligence.process(final_table_data, viz_intent)
        
        formatted_code = ""
        for ec in executed_codes:
            formatted_code += f"# {ec['description']}\n{ec['code']}\n\n"
        
        formatted_code = formatted_code.strip()
        if len(formatted_code) > 20000:
            formatted_code = formatted_code[:20000] + "\n\n# (Code preview truncated for display. Original code exceeds 20,000 characters.)"
            
        final_payload = {
            "chart_type": viz_result.get("chart_type"),
            "chart_data": viz_result.get("chart_data"),
            "table_data": final_table_data,
            "generated_code": formatted_code if formatted_code else None,
            "suggestions": explanation.get("suggestions", ["Ask another question"])
        }
        yield json.dumps({"payload": final_payload})
