from typing import Any

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    dataset_id: int = Field(..., gt=0, description="Dataset ID")
    message: str = Field(..., min_length=1, max_length=5000, description="User prompt")
    history: list[ChatMessage] = Field(default_factory=list, description="Conversation history")


class ChatResponse(BaseModel):
    answer: str
    chart_type: str | None = None
    chart_data: dict[str, Any] | None = None
    table_data: list[dict[str, Any]] | None = None
    suggestions: list[str] = Field(default_factory=list)