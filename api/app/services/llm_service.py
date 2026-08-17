import json
import os
import time
import random
from typing import Any, Dict, List
import logging

logger = logging.getLogger(__name__)

import pandas as pd
from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError

load_dotenv()


def with_retry(max_retries=3):
    def decorator(func):
        def wrapper(*args, **kwargs):
            retries = 0
            while True:
                try:
                    return func(*args, **kwargs)
                except APIError as e:
                    # Get status code if available
                    code = getattr(e, 'code', None)
                    status = getattr(e, 'status', None)
                    err_str = str(e)
                    
                    is_rate_limit = (code == 429) or ("429" in err_str)
                    is_server_error = (code and code >= 500) or ("50" in err_str)
                    is_quota = (code == 403) or ("quota" in err_str.lower())

                    if is_quota:
                        # Quota exceeded - don't retry, raise immediately to be caught
                        raise ValueError("QUOTA_EXCEEDED")
                    
                    if is_rate_limit or is_server_error:
                        if retries >= max_retries:
                            raise ValueError("RATE_LIMITED" if is_rate_limit else "SERVICE_UNAVAILABLE")
                        sleep_time = (1.5 ** retries) + random.uniform(0.1, 0.5)
                        time.sleep(sleep_time)
                        retries += 1
                    else:
                        raise e
                except Exception as e:
                    raise e
        return wrapper
    return decorator


class LLMService:

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY environment variable is missing."
            )

        self.client = genai.Client(api_key=api_key)

        self.model = "gemini-flash-latest"

    def dataframe_context(
        self,
        dataframe: pd.DataFrame,
        statistics: Dict[str, Any],
        data_types: Dict[str, str],
    ) -> str:

        return f"""
Rows: {len(dataframe)}
Columns: {', '.join(dataframe.columns)}

Data Types:
{json.dumps(data_types)}

Statistics:
{json.dumps(statistics)}

First 10 Rows:

{dataframe.head(10).to_markdown(index=False)}
"""

    def system_prompt(
        self,
        dataframe: pd.DataFrame,
        statistics: Dict[str, Any],
        data_types: Dict[str, str],
        history: List[Dict[str, str]] = [],
    ) -> str:

        history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])

        return f"""
You are Charex AI, an expert Data Analyst.

You MUST answer ONLY in JSON.

Dataset Information

{self.dataframe_context(dataframe, statistics, data_types)}

Conversation History

{history_text}

JSON FORMAT

{{
  "answer":"string (with markdown if needed)",
  "chart_type":"bar|pie|area|null",
  "chart_data": {{
      "labels": [],
      "values": []
  }},
  "table_data":[
      {{
          "column":"value"
      }}
  ],
  "suggestions":[]
}}

Rules

1. If the user asks for a chart, fill chart_type and chart_data.
2. If the user asks for a table, fill table_data.
3. If no chart is needed, chart_type must be null.
4. If no table is needed, table_data must be null.
5. Use the provided conversation history to understand context for follow-up questions.
6. answer must always be present.
"""

    @with_retry(max_retries=3)
    def ask(
        self,
        dataframe: pd.DataFrame,
        statistics: Dict[str, Any],
        data_types: Dict[str, str],
        question: str,
        history: List[Dict[str, str]] = [],
    ) -> dict[str, Any]:

        prompt = f"""
    User Question

    {question}
    """

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    self.system_prompt(dataframe, statistics, data_types, history),
                    prompt,
                ],
            )

            text = ""

            if hasattr(response, "text") and response.text:
                text = response.text.strip()

            else:
                text = str(response)

            text = (
                text.replace("```json", "")
                .replace("```", "")
                .strip()
            )

            try:

                result = json.loads(text)

                return {
                    "answer": result.get(
                        "answer",
                        "",
                    ),

                    "chart_type": result.get(
                        "chart_type",
                    ),

                    "chart_data": result.get(
                        "chart_data",
                    ),

                    "table_data": result.get(
                        "table_data",
                    ),

                    "suggestions": result.get(
                        "suggestions",
                        [],
                    ),
                }

            except json.JSONDecodeError:

                return {
                    "answer": text,

                    "chart_type": None,

                    "chart_data": None,

                    "table_data": None,

                    "suggestions": [
                        "Summarize this dataset",
                        "Show a bar chart",
                        "Show first 10 rows",
                    ],
                }

        except ValueError as ve:
            reason = str(ve)
            if reason == "QUOTA_EXCEEDED":
                answer = "⚠️ Charex has temporarily reached its AI usage limit. Please try again later."
            elif reason == "RATE_LIMITED":
                answer = "⚠️ Charex is receiving too many requests right now. Please try again in a moment."
            else:
                answer = "⚠️ The AI analysis service is temporarily unavailable. Please try again."
                
            return {
                "answer": answer,
                "chart_type": None,
                "chart_data": None,
                "table_data": None,
                "suggestions": ["Try again"],
            }
        except Exception as e:
            logger.error(f"Gemini API Error: {e}", exc_info=True)

            return {
                "answer": (
                    "⚠️ Charex AI is temporarily unavailable. "
                    "Please try again shortly."
                ),

                "chart_type": None,

                "chart_data": None,

                "table_data": None,

                "suggestions": [
                    "Try again",
                    "Summarize this dataset",
                    "Show first 10 rows",
                ],
            }

    @with_retry(max_retries=3)
    def ask_stream(
        self,
        dataframe: pd.DataFrame,
        statistics: Dict[str, Any],
        data_types: Dict[str, str],
        question: str,
        history: List[Dict[str, str]] = [],
    ):

        prompt = f"""
    User Question

    {question}
    """

        try:
            response_stream = self.client.models.generate_content_stream(
                model=self.model,
                contents=[
                    self.system_prompt(dataframe, statistics, data_types, history),
                    prompt,
                ],
            )

            for chunk in response_stream:
                if chunk.text:
                    yield chunk.text

        except ValueError as ve:
            reason = str(ve)
            if reason == "QUOTA_EXCEEDED":
                yield "⚠️ Charex has temporarily reached its AI usage limit. Please try again later."
            elif reason == "RATE_LIMITED":
                yield "⚠️ Charex is receiving too many requests right now. Please try again in a moment."
            else:
                yield "⚠️ The AI analysis service is temporarily unavailable. Please try again."
        except Exception as e:
            logger.error(f"Gemini API Error: {e}", exc_info=True)
            yield "⚠️ Charex AI is temporarily unavailable."

    @with_retry(max_retries=3)
    def generate(self, system_instruction: str, prompt: str) -> str:
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=[
                    f"System Instruction:\n{system_instruction}",
                    prompt
                ],
            )
            text = ""
            if hasattr(response, "text") and response.text:
                text = response.text.strip()
            else:
                text = str(response)
            return text
        except ValueError as ve:
            # We don't want the agent service to just output the raw error directly into the sandbox. 
            # We raise so it can be handled by AgentService
            raise RuntimeError(str(ve))
        except Exception as e:
            logger.error(f"Gemini Generation Error: {e}", exc_info=True)
            raise RuntimeError(str(e))