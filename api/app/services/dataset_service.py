from pathlib import Path
from typing import Any, Dict, List

import numpy as np
import pandas as pd


class DatasetService:
    """
    Dataset Analysis Service

    Responsibilities

    1. Read Dataset
    2. Clean Dataset
    3. Generate Summary
    4. Statistics
    5. Correlation
    6. Dashboard Data
    """

    # ==========================================================
    # FILE LOADER
    # ==========================================================

    @staticmethod
    def _load_dataset(
        file_path: str,
    ) -> pd.DataFrame:

        path = Path(file_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Dataset not found: {file_path}"
            )

        suffix = path.suffix.lower()

        if suffix == ".csv":
            dataframe = pd.read_csv(path)

        elif suffix in (
            ".xlsx",
            ".xls",
        ):
            dataframe = pd.read_excel(path)

        else:
            raise ValueError(
                "Unsupported dataset format."
            )

        return dataframe

    # ==========================================================
    # CLEAN DATASET
    # ==========================================================

    @staticmethod
    def _clean_dataset(
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:

        dataframe = dataframe.dropna(
            axis=1,
            how="all",
        )

        dataframe = dataframe.dropna(
            axis=0,
            how="all",
        )

        dataframe.columns = [
            str(column).strip()
            for column in dataframe.columns
        ]

        missing_percentage = (
            dataframe.isnull().mean()
        )

        dataframe = dataframe.loc[
            :,
            missing_percentage < 0.95,
        ]

        return dataframe

    # ==========================================================
    # MEMORY USAGE
    # ==========================================================

    @staticmethod
    def _memory_usage(
        dataframe: pd.DataFrame,
    ) -> float:

        memory = (
            dataframe.memory_usage(
                deep=True
            ).sum()
            / (1024 * 1024)
        )

        return round(memory, 2)

    # ==========================================================
    # QUALITY SCORE
    # ==========================================================

    @staticmethod
    def _quality_score(
        dataframe: pd.DataFrame,
    ) -> float:

        rows = len(dataframe)

        cols = len(dataframe.columns)

        total_cells = max(
            rows * cols,
            1,
        )

        missing = int(
            dataframe.isnull().sum().sum()
        )

        duplicates = int(
            dataframe.duplicated().sum()
        )

        score = (
            100
            - ((missing / total_cells) * 60)
            - ((duplicates / max(rows, 1)) * 40)
        )

        return round(
            max(score, 0),
            1,
        )

    # ==========================================================
    # COLUMN PROFILE
    # ==========================================================

    @staticmethod
    def _column_profile(
        dataframe: pd.DataFrame,
    ) -> List[Dict[str, Any]]:

        profile = []

        for column in dataframe.columns:

            series = dataframe[column]

            profile.append(
                {
                    "name": column,
                    "dtype": str(series.dtype),
                    "missing": int(
                        series.isnull().sum()
                    ),
                    "unique": int(
                        series.nunique()
                    ),
                    "null_percentage": round(
                        series.isnull().mean() * 100,
                        2,
                    ),
                }
            )

        return profile

    # ==========================================================
    # MISSING VALUE REPORT
    # ==========================================================

    @staticmethod
    def _missing_report(
        dataframe: pd.DataFrame,
    ):

        report = {}

        for column in dataframe.columns:

            count = int(
                dataframe[column]
                .isnull()
                .sum()
            )

            report[column] = {
                "count": count,
                "percentage": round(
                    count
                    / max(
                        len(dataframe),
                        1,
                    )
                    * 100,
                    2,
                ),
            }

        return report

    # ==========================================================
    # DUPLICATE REPORT
    # ==========================================================

    @staticmethod
    def _duplicate_report(
        dataframe: pd.DataFrame,
    ):

        duplicates = int(
            dataframe.duplicated().sum()
        )

        return {
            "rows": duplicates,
            "percentage": round(
                duplicates
                / max(
                    len(dataframe),
                    1,
                )
                * 100,
                2,
            ),
        }

    # ==========================================================
    # DATASET INFO
    # ==========================================================

    @staticmethod
    def _dataset_info(
        dataframe: pd.DataFrame,
    ):

        numeric_columns = list(
            dataframe.select_dtypes(
                include=np.number,
            ).columns
        )

        categorical_columns = list(
            dataframe.select_dtypes(
                include=[
                    "object",
                    "category",
                    "bool",
                ]
            ).columns
        )

        datetime_columns = list(
            dataframe.select_dtypes(
                include=[
                    "datetime64[ns]",
                    "datetime",
                ]
            ).columns
        )

        return (
            numeric_columns,
            categorical_columns,
            datetime_columns,
        )
        # ==========================================================
    # DATA TYPES
    # ==========================================================

    @staticmethod
    def _data_types(
        dataframe: pd.DataFrame,
    ) -> Dict[str, str]:

        return {
            column: str(dtype)
            for column, dtype in dataframe.dtypes.items()
        }

    # ==========================================================
    # DATASET PREVIEW
    # ==========================================================

    @staticmethod
    def _preview(
        dataframe: pd.DataFrame,
        rows: int = 10,
    ) -> List[Dict[str, Any]]:

        preview = (
            dataframe.head(rows)
            .replace({np.nan: ""})
            .to_dict(
                orient="records"
            )
        )

        return preview

    # ==========================================================
    # DESCRIPTIVE STATISTICS
    # ==========================================================

    @staticmethod
    def _statistics(
        dataframe: pd.DataFrame,
    ) -> Dict[str, Any]:

        statistics = (
            dataframe.describe(
                include="all"
            )
            .fillna("")
            .to_dict()
        )

        return statistics

    # ==========================================================
    # CORRELATION MATRIX
    # ==========================================================

    @staticmethod
    def _correlation_matrix(
        dataframe: pd.DataFrame,
    ) -> List[Dict[str, Any]]:

        numeric_dataframe = dataframe.select_dtypes(
            include=np.number
        )

        if numeric_dataframe.shape[1] < 2:
            return []

        correlation = (
            numeric_dataframe.corr()
            .round(3)
        )

        matrix = []

        columns = list(
            correlation.columns
        )

        for i in range(len(columns)):

            for j in range(i + 1, len(columns)):

                value = correlation.iloc[i, j]

                if pd.isna(value):
                    continue

                matrix.append(
                    {
                        "column1": columns[i],
                        "column2": columns[j],
                        "correlation": float(value),
                    }
                )

        matrix.sort(
            key=lambda item: abs(
                item["correlation"]
            ),
            reverse=True,
        )

        return matrix[:10]
        # ==========================================================
    # CHART RECOMMENDATIONS
    # ==========================================================

    @staticmethod
    def _recommended_charts(
        dataframe: pd.DataFrame,
    ) -> List[Dict[str, str]]:

        charts = []

        numeric_columns = list(
            dataframe.select_dtypes(
                include=np.number
            ).columns
        )

        categorical_columns = list(
            dataframe.select_dtypes(
                include=[
                    "object",
                    "category",
                    "bool",
                ]
            ).columns
        )

        if len(numeric_columns) >= 1:

            charts.append(
                {
                    "type": "histogram",
                    "reason": "Distribution of numeric values",
                }
            )

            charts.append(
                {
                    "type": "boxplot",
                    "reason": "Detect outliers",
                }
            )

        if len(categorical_columns) >= 1:

            charts.append(
                {
                    "type": "bar",
                    "reason": "Category frequency",
                }
            )

            charts.append(
                {
                    "type": "pie",
                    "reason": "Category proportion",
                }
            )

        if len(numeric_columns) >= 2:

            charts.append(
                {
                    "type": "scatter",
                    "reason": "Relationship between variables",
                }
            )

            charts.append(
                {
                    "type": "heatmap",
                    "reason": "Correlation analysis",
                }
            )

        return charts

    # ==========================================================
    # DATASET SUMMARY
    # ==========================================================

    @classmethod
    def dataset_summary(
        cls,
        file_path: str,
    ) -> Dict[str, Any]:

        dataframe = cls._load_dataset(
            file_path
        )

        dataframe = cls._clean_dataset(
            dataframe
        )

        (
            numeric_columns,
            categorical_columns,
            datetime_columns,
        ) = cls._dataset_info(
            dataframe
        )

        duplicate_report = cls._duplicate_report(
            dataframe
        )

        total_missing = int(
            dataframe.isnull().sum().sum()
        )

        return {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "missing_values": total_missing,
            "duplicates": duplicate_report["rows"],
            "numeric_columns": len(numeric_columns),
            "categorical_columns": len(categorical_columns),
            "datetime_columns": len(datetime_columns),
            "memory_usage_mb": cls._memory_usage(
                dataframe
            ),
            "quality_score": cls._quality_score(
                dataframe
            ),
        }
        # ==========================================================
    # MAIN ANALYZER
    # ==========================================================

    @classmethod
    def analyze_dataset(
        cls,
        file_path: str,
    ) -> Dict[str, Any]:

        dataframe = cls._load_dataset(
            file_path
        )

        dataframe = cls._clean_dataset(
            dataframe
        )

        (
            numeric_columns,
            categorical_columns,
            datetime_columns,
        ) = cls._dataset_info(
            dataframe
        )

        duplicate_report = cls._duplicate_report(
            dataframe
        )

        missing_report = cls._missing_report(
            dataframe
        )

        total_missing = int(
            dataframe.isnull().sum().sum()
        )

        return {

            "summary": {
                "rows": len(dataframe),
                "columns": len(dataframe.columns),
                "memory_usage_mb": cls._memory_usage(
                    dataframe
                ),
                "quality_score": cls._quality_score(
                    dataframe
                ),
            },

            "column_names": list(
                dataframe.columns
            ),

            "column_profile": cls._column_profile(
                dataframe
            ),

            "data_types": cls._data_types(
                dataframe
            ),

            "duplicate_rows": duplicate_report[
                "rows"
            ],

            "duplicate_percentage": duplicate_report[
                "percentage"
            ],

            "missing_values": missing_report,

            "total_missing_cells": total_missing,

            "numeric_columns": len(
                numeric_columns
            ),

            "categorical_columns": len(
                categorical_columns
            ),

            "datetime_columns": len(
                datetime_columns
            ),

            "numeric_column_names": numeric_columns,

            "categorical_column_names": categorical_columns,

            "datetime_column_names": datetime_columns,

            "preview": cls._preview(
                dataframe
            ),

            "statistics": cls._statistics(
                dataframe
            ),

            "correlations": cls._correlation_matrix(
                dataframe
            ),

            "recommended_charts": cls._recommended_charts(
                dataframe
            ),
        }