import json
import os
from typing import Any, Dict, List

import pandas as pd
from dotenv import load_dotenv
from google import genai

load_dotenv()


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
            # ... (rest of the logic remains the same, need to be careful with indentation and tool use)

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

        except Exception as e:

            print("\n========== GEMINI ERROR ==========")
            print(e)
            print("==================================\n")

            return {
                "answer": (
                    "⚠️ Charex AI is temporarily unavailable because "
                    "Gemini is experiencing high demand. "
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

        except Exception as e:

            print("\n========== GEMINI ERROR ==========")
            print(e)
            print("==================================\n")
            yield "⚠️ Charex AI is temporarily unavailable."