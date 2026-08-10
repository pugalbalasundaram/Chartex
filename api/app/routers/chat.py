from pathlib import Path
import json

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from starlette.concurrency import iterate_in_threadpool

from app.database.database import get_db
from sqlalchemy.orm import Session
from app.models.dataset import Dataset
from app.models.user import User
from app.core.auth import get_current_user

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
)

from app.services.dataset_service import DatasetService
from app.services.analysis_service import AnalysisService
from app.services.intent_service import (
    Intent,
    IntentService,
)
from app.services.llm_service import LLMService

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)

llm = LLMService()

analysis = AnalysisService()

intent_service = IntentService()


@router.post(
    "/stream",
)
async def chat_stream(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dataset = (
        db.query(Dataset)
        .filter(
            Dataset.id == request.dataset_id,
            Dataset.owner_id == current_user.id
        )
        .first()
    )

    if dataset is None:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found.",
        )

    upload_dir = Path("uploads")

    file_path = (
        upload_dir /
        dataset.stored_filename
    )

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Dataset file not found: {file_path}",
        )

    suffix = file_path.suffix.lower()

    if suffix == ".csv":
        dataframe = pd.read_csv(file_path)

    elif suffix in (
        ".xlsx",
        ".xls",
    ):
        dataframe = pd.read_excel(file_path)

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported dataset format.",
        )

    dataframe = dataframe.dropna(
        axis=1,
        how="all",
    )

    dataframe = dataframe.loc[
        :,
        ~dataframe.columns.str.contains(
            "^Unnamed"
        ),
    ]

    statistics = DatasetService._statistics(dataframe)
    data_types = DatasetService._data_types(dataframe)
    history = [msg.dict() for msg in request.history]

    async def generate_response():
        async for chunk in iterate_in_threadpool(llm.ask_stream(dataframe, statistics, data_types, request.message, history)):
            yield f"data: {json.dumps({'content': chunk})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate_response(), media_type="text/event-stream")


@router.post(
    "",
    response_model=ChatResponse,
)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        dataset = (
            db.query(Dataset)
            .filter(
                Dataset.id == request.dataset_id,
                Dataset.owner_id == current_user.id
            )
            .first()
        )

        if dataset is None:
            raise HTTPException(
                status_code=404,
                detail="Dataset not found.",
            )

        upload_dir = Path("uploads")

        file_path = (
            upload_dir /
            dataset.stored_filename
        )

        if not file_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"Dataset file not found: {file_path}",
            )

        suffix = file_path.suffix.lower()

        if suffix == ".csv":
            dataframe = pd.read_csv(file_path)

        elif suffix in (
            ".xlsx",
            ".xls",
        ):
            dataframe = pd.read_excel(file_path)

        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported dataset format.",
            )

        dataframe = dataframe.dropna(
            axis=1,
            how="all",
        )

        dataframe = dataframe.loc[
            :,
            ~dataframe.columns.str.contains(
                "^Unnamed"
            ),
        ]

        detected_intent = intent_service.detect(
            request.message
        )

        if detected_intent == Intent.SUMMARY:

            summary = analysis.summary(dataframe)

            return ChatResponse(
                answer=(
                    f"The dataset contains "
                    f"{summary['rows']} rows and "
                    f"{summary['columns']} columns."
                ),
                chart_type=None,
                chart_data=None,
                table_data=None,
                suggestions=[
                    "Show first 10 rows",
                    "Describe dataset",
                    "Show missing values",
                ],
            )

        elif detected_intent == Intent.HEAD:

            table = analysis.head(dataframe)

            return ChatResponse(
                answer="Here are the first rows of the dataset.",
                chart_type=None,
                chart_data=None,
                table_data=table,
                suggestions=[
                    "Describe dataset",
                    "Show missing values",
                    "Create a bar chart",
                ],
            )

        elif detected_intent == Intent.MISSING:

            table = analysis.missing_values(dataframe)

            return ChatResponse(
                answer="Missing values for every column.",
                chart_type=None,
                chart_data=None,
                table_data=table,
                suggestions=[
                    "Show duplicate rows",
                    "Describe dataset",
                ],
            )

        elif detected_intent == Intent.DUPLICATES:

            duplicate_info = analysis.duplicates(
                dataframe
            )

            return ChatResponse(
                answer=(
                    f"Duplicate rows found: "
                    f"{duplicate_info['duplicate_rows']}"
                ),
                chart_type=None,
                chart_data=None,
                table_data=None,
                suggestions=[
                    "Show missing values",
                    "Describe dataset",
                ],
            )

        elif detected_intent == Intent.COLUMNS:

            table = analysis.columns(
                dataframe
            )

            return ChatResponse(
                answer="Dataset columns and their data types.",
                chart_type=None,
                chart_data=None,
                table_data=table,
                suggestions=[
                    "Describe dataset",
                    "Show first 10 rows",
                ],
            )

        elif detected_intent == Intent.DESCRIBE:

            table = analysis.describe(
                dataframe
            )

            return ChatResponse(
                answer="Statistical summary of the dataset.",
                chart_type=None,
                chart_data=None,
                table_data=table,
                suggestions=[
                    "Show correlation",
                    "Show missing values",
                ],
            )

        elif detected_intent == Intent.SHAPE:

            shape = analysis.shape(
                dataframe
            )

            return ChatResponse(
                answer=(
                    f"The dataset contains "
                    f"{shape['rows']} rows and "
                    f"{shape['columns']} columns."
                ),
                chart_type=None,
                chart_data=None,
                table_data=None,
                suggestions=[
                    "Show columns",
                    "Describe dataset",
                ],
            )

        elif detected_intent == Intent.CORRELATION:

            table = analysis.correlation(
                dataframe
            )

            return ChatResponse(
                answer="Correlation matrix.",
                chart_type=None,
                chart_data=None,
                table_data=table,
                suggestions=[
                    "Describe dataset",
                    "Show statistics",
                ],
            )

        else:
            statistics = DatasetService._statistics(dataframe)
            data_types = DatasetService._data_types(dataframe)
            history = [msg.dict() for msg in request.history]

            result = llm.ask(
                dataframe=dataframe,
                statistics=statistics,
                data_types=data_types,
                question=request.message,
                history=history
            )

            return ChatResponse(
                **result
            )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )