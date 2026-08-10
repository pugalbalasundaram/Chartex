from enum import Enum


class Intent(str, Enum):
    SUMMARY = "summary"
    MISSING = "missing"
    HEAD = "head"
    SHAPE = "shape"
    COLUMNS = "columns"
    DESCRIBE = "describe"
    DUPLICATES = "duplicates"
    CORRELATION = "correlation"
    CHART = "chart"
    TABLE = "table"
    GEMINI = "gemini"


class IntentService:

    def detect(self, question: str) -> Intent:

        q = question.lower()

        if any(word in q for word in [
            "summary",
            "summarize",
            "overview",
        ]):
            return Intent.SUMMARY

        if any(word in q for word in [
            "missing",
            "null",
            "nan",
        ]):
            return Intent.MISSING

        if any(word in q for word in [
            "first",
            "top",
            "head",
            "rows",
        ]):
            return Intent.HEAD

        if any(word in q for word in [
            "shape",
            "rows and columns",
        ]):
            return Intent.SHAPE

        if any(word in q for word in [
            "columns",
            "column names",
            "features",
        ]):
            return Intent.COLUMNS

        if any(word in q for word in [
            "describe",
            "statistics",
            "summary statistics",
        ]):
            return Intent.DESCRIBE

        if any(word in q for word in [
            "duplicate",
            "duplicates",
        ]):
            return Intent.DUPLICATES

        if any(word in q for word in [
            "correlation",
            "heatmap",
        ]):
            return Intent.CORRELATION

        if any(word in q for word in [
            "chart",
            "graph",
            "plot",
            "bar",
            "pie",
            "line",
            "area",
        ]):
            return Intent.CHART

        if "table" in q:
            return Intent.TABLE

        return Intent.GEMINI