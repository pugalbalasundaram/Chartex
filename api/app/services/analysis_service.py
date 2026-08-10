import pandas as pd


class AnalysisService:

    @staticmethod
    def summary(
        dataframe: pd.DataFrame,
    ):
        return {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "column_names": dataframe.columns.tolist(),
        }

    @staticmethod
    def head(
        dataframe: pd.DataFrame,
        rows: int = 10,
    ):
        return dataframe.head(rows).to_dict(
            orient="records"
        )

    @staticmethod
    def missing_values(
        dataframe: pd.DataFrame,
    ):
        result = (
            dataframe.isnull()
            .sum()
            .reset_index()
        )

        result.columns = [
            "Column",
            "Missing Values",
        ]

        return result.to_dict(
            orient="records"
        )

    @staticmethod
    def duplicates(
        dataframe: pd.DataFrame,
    ):
        return {
            "duplicate_rows": int(
                dataframe.duplicated().sum()
            )
        }

    @staticmethod
    def describe(
        dataframe: pd.DataFrame,
    ):
        return (
            dataframe.describe(
                include="all"
            )
            .fillna("")
            .reset_index()
            .rename(
                columns={
                    "index": "Statistic",
                }
            )
            .to_dict(
                orient="records"
            )
        )

    @staticmethod
    def columns(
        dataframe: pd.DataFrame,
    ):
        return [
            {
                "Column": column,
                "Data Type": str(
                    dataframe[column].dtype
                ),
            }
            for column in dataframe.columns
        ]

    @staticmethod
    def shape(
        dataframe: pd.DataFrame,
    ):
        return {
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
        }

    @staticmethod
    def correlation(
        dataframe: pd.DataFrame,
    ):
        numeric = dataframe.select_dtypes(
            include="number"
        )

        if numeric.empty:
            return []

        return (
            numeric.corr()
            .round(2)
            .reset_index()
            .rename(
                columns={
                    "index": "Column",
                }
            )
            .to_dict(
                orient="records"
            )
        )