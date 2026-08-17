import pytest
from unittest.mock import patch

class MockLLMService:
    def __init__(self, *args, **kwargs):
        self.model = "mock"
        
    def dataframe_context(self, *args, **kwargs):
        return "mock_context"
        
    def system_prompt(self, *args, **kwargs):
        return "mock_prompt"
        
    def generate(self, system_instruction: str, prompt: str) -> str:
        # A mock implementation that returns valid code for the tests
        if "average revenue" in prompt.lower():
            return "```python\nresult_text = str(df['Revenue'].mean())\n```"
        
        return "```python\nresult_text = 'Mock result'\n```"

    def ask(self, dataframe, statistics, data_types, question, history=None):
        return {
            "answer": "Mock answer",
            "chart_type": None,
            "chart_data": None,
            "table_data": None,
            "suggestions": []
        }
        
    def ask_stream(self, dataframe, statistics, data_types, question, history=None):
        yield "Mock stream response"

@pytest.fixture(autouse=True)
def mock_gemini_api():
    # Patch the LLMService in all services that use it
    with patch("app.services.agent_service.LLMService", new=MockLLMService):
        yield
