import pandas as pd
import numpy as np
from typing import Dict, Any, List

class DatasetProfiler:
    """
    Dataset Profiler
    Deterministically calculates semantic types, statistics, outliers, missingness, and quality score.
    Returns a strictly JSON-serializable dictionary.
    """
    
    TOP_CATEGORIES = 10
    MAX_CORRELATIONS = 10
    
    @staticmethod
    def _safe_float(val: Any) -> Any:
        if pd.isna(val) or np.isinf(val):
            return None
        return float(val)
        
    @staticmethod
    def _safe_int(val: Any) -> Any:
        if pd.isna(val) or np.isinf(val):
            return None
        return int(val)

    @classmethod
    def profile(cls, dataframe: pd.DataFrame) -> Dict[str, Any]:
        if dataframe.empty:
            return {
                "row_count": 0,
                "column_count": len(dataframe.columns),
                "quality_score": 0,
                "columns": [],
                "numeric_columns": [],
                "categorical_columns": [],
                "datetime_columns": [],
                "text_columns": [],
                "boolean_columns": [],
                "missing_summary": {"total_missing_cells": 0, "columns_with_missing": 0},
                "duplicate_summary": {"duplicate_rows": 0, "duplicate_percentage": 0.0},
                "outliers": [],
                "correlations": [],
                "quality_issues": [{"severity": "warning", "column": "N/A", "type": "empty_dataset", "message": "The dataset contains no rows."}],
                "readiness": "NEEDS_CLEANING",
                "recommendations": ["Upload a dataset with at least one row."]
            }
            
        row_count = len(dataframe)
        column_count = len(dataframe.columns)
        
        columns_profile = []
        numeric_columns = []
        categorical_columns = []
        datetime_columns = []
        text_columns = []
        boolean_columns = []
        
        quality_issues = []
        outliers_list = []
        
        total_missing_cells = 0
        columns_with_missing = 0
        
        duplicate_rows = int(dataframe.duplicated().sum())
        duplicate_percentage = duplicate_rows / row_count
        
        score_deductions = 0
        
        if duplicate_percentage > 0:
            score_deductions += (duplicate_percentage * 40)
            if duplicate_percentage > 0.05:
                quality_issues.append({"severity": "warning", "column": "N/A", "type": "duplicates", "message": f"Dataset contains {duplicate_percentage:.1%} duplicate rows."})
        
        for col in dataframe.columns:
            series = dataframe[col]
            missing_count = int(series.isnull().sum())
            missing_percentage = missing_count / row_count
            
            if missing_count > 0:
                total_missing_cells += missing_count
                columns_with_missing += 1
                
                # Deduct max 60 points for missingness
                score_deductions += (missing_percentage * 60) / column_count
                
                if missing_percentage > 0.5:
                    missing_severity = "critical"
                    quality_issues.append({"severity": "critical", "column": col, "type": "high_missingness", "message": f"{col} is missing {missing_percentage:.1%} of its values."})
                elif missing_percentage > 0.2:
                    missing_severity = "high"
                elif missing_percentage > 0.05:
                    missing_severity = "moderate"
                else:
                    missing_severity = "low"
            else:
                missing_severity = "complete"
                
            unique_count = int(series.nunique(dropna=True))
            cardinality_ratio = unique_count / row_count if row_count > 0 else 0
            
            constant_column = False
            if unique_count <= 1 and row_count > 0:
                constant_column = True
                quality_issues.append({"severity": "warning", "column": col, "type": "constant_column", "message": f"{col} contains only one unique value."})
                score_deductions += 5
                
            likely_identifier = False
            col_lower = str(col).lower()
            if unique_count == row_count and row_count > 1 and series.dtype == "object":
                likely_identifier = True
            elif col_lower in ["id", "uuid", "email"] or col_lower.endswith("_id") or col_lower.endswith("id"):
                if unique_count > row_count * 0.8:
                    likely_identifier = True
            
            # Semantic type detection
            dtype_str = str(series.dtype)
            semantic_type = "unknown"
            
            numeric_stats = None
            top_values = None
            
            if pd.api.types.is_bool_dtype(series) or (unique_count == 2 and set(series.dropna().unique()).issubset({0, 1, True, False, "Yes", "No", "Y", "N", "true", "false"})):
                semantic_type = "boolean"
                boolean_columns.append(col)
                
            elif pd.api.types.is_datetime64_any_dtype(series):
                semantic_type = "datetime"
                datetime_columns.append(col)
                
            elif pd.api.types.is_numeric_dtype(series) and not likely_identifier:
                semantic_type = "numeric"
                numeric_columns.append(col)
                
                valid_data = series.dropna()
                if len(valid_data) > 0:
                    q1 = valid_data.quantile(0.25)
                    q3 = valid_data.quantile(0.75)
                    iqr = q3 - q1
                    lower_bound = q1 - 1.5 * iqr
                    upper_bound = q3 + 1.5 * iqr
                    
                    outlier_mask = (valid_data < lower_bound) | (valid_data > upper_bound)
                    outlier_count = int(outlier_mask.sum())
                    
                    if outlier_count > 0:
                        outlier_percentage = outlier_count / len(valid_data)
                        outliers_list.append({
                            "column": col,
                            "outlier_count": outlier_count,
                            "outlier_percentage": outlier_percentage
                        })
                        if outlier_percentage > 0.05:
                            score_deductions += 2
                            quality_issues.append({"severity": "warning", "column": col, "type": "outliers", "message": f"{col} contains {outlier_percentage:.1%} potential outliers."})
                    
                    numeric_stats = {
                        "min": cls._safe_float(valid_data.min()),
                        "max": cls._safe_float(valid_data.max()),
                        "mean": cls._safe_float(valid_data.mean()),
                        "median": cls._safe_float(valid_data.median()),
                        "std": cls._safe_float(valid_data.std()),
                        "q1": cls._safe_float(q1),
                        "q3": cls._safe_float(q3),
                        "zero_count": int((valid_data == 0).sum()),
                        "negative_count": int((valid_data < 0).sum())
                    }
                    
                    if numeric_stats["zero_count"] > row_count * 0.9:
                        quality_issues.append({"severity": "info", "column": col, "type": "mostly_zeros", "message": f"{col} contains mostly zeros."})
            else:
                # Text vs Categorical
                if series.dtype == "object" and not constant_column:
                    avg_len = series.dropna().astype(str).str.len().mean()
                    if avg_len > 50 and cardinality_ratio > 0.5:
                        semantic_type = "text"
                        text_columns.append(col)
                    else:
                        semantic_type = "categorical"
                        categorical_columns.append(col)
                else:
                    semantic_type = "categorical"
                    if not constant_column:
                        categorical_columns.append(col)
                        
                if not likely_identifier and not constant_column and semantic_type == "categorical":
                    value_counts = series.value_counts().head(cls.TOP_CATEGORIES)
                    top_values = [{"value": str(k), "count": int(v)} for k, v in value_counts.items()]
            
            col_prof = {
                "name": col,
                "dtype": dtype_str,
                "semantic_type": semantic_type,
                "nullable": missing_count > 0,
                "missing_count": missing_count,
                "missing_percentage": cls._safe_float(missing_percentage),
                "missing_severity": missing_severity,
                "unique_count": unique_count,
                "cardinality_ratio": cls._safe_float(cardinality_ratio),
                "constant_column": constant_column,
                "likely_identifier": likely_identifier
            }
            if numeric_stats:
                col_prof["numeric_stats"] = numeric_stats
            if top_values:
                col_prof["top_values"] = top_values
                
            columns_profile.append(col_prof)

        # Correlation Analysis
        correlations = []
        if len(numeric_columns) > 1:
            numeric_df = dataframe[numeric_columns]
            corr_matrix = numeric_df.corr().abs()
            
            pairs = []
            for i in range(len(numeric_columns)):
                for j in range(i+1, len(numeric_columns)):
                    col_a = numeric_columns[i]
                    col_b = numeric_columns[j]
                    val = corr_matrix.iloc[i, j]
                    if pd.notna(val):
                        # Determine strength
                        strength = "very weak"
                        if val >= 0.8: strength = "very strong"
                        elif val >= 0.6: strength = "strong"
                        elif val >= 0.4: strength = "moderate"
                        elif val >= 0.2: strength = "weak"
                        
                        pairs.append({
                            "column_a": col_a,
                            "column_b": col_b,
                            "correlation": cls._safe_float(val),
                            "strength": strength
                        })
            
            pairs.sort(key=lambda x: x["correlation"], reverse=True)
            correlations = pairs[:cls.MAX_CORRELATIONS]
            
        quality_score = max(0.0, min(100.0, 100.0 - score_deductions))
        quality_score = round(quality_score, 1)
        
        if quality_score >= 90:
            readiness = "READY"
        elif quality_score >= 70:
            readiness = "READY_WITH_WARNINGS"
        else:
            readiness = "NEEDS_CLEANING"
            
        # Prioritize issues
        def sort_severity(issue):
            mapping = {"critical": 0, "warning": 1, "info": 2}
            return mapping.get(issue["severity"], 3)
            
        quality_issues.sort(key=sort_severity)
        quality_issues = quality_issues[:20]
        
        recommendations = []
        if duplicate_rows > 0:
            recommendations.append("Consider removing duplicate rows before analysis.")
        if columns_with_missing > 0:
            recommendations.append("Handle missing values (e.g., imputation or dropping) for more accurate results.")
        if len(outliers_list) > 0:
            recommendations.append("Review columns with potential outliers, as they may skew averages.")
        if len(datetime_columns) > 0:
            recommendations.append(f"Use {datetime_columns[0]} to support time-series analysis.")

        return {
            "row_count": row_count,
            "column_count": column_count,
            "quality_score": quality_score,
            "columns": columns_profile,
            "numeric_columns": numeric_columns,
            "categorical_columns": categorical_columns,
            "datetime_columns": datetime_columns,
            "text_columns": text_columns,
            "boolean_columns": boolean_columns,
            "missing_summary": {
                "total_missing_cells": total_missing_cells,
                "columns_with_missing": columns_with_missing
            },
            "duplicate_summary": {
                "duplicate_rows": duplicate_rows,
                "duplicate_percentage": cls._safe_float(duplicate_percentage)
            },
            "outliers": outliers_list,
            "correlations": correlations,
            "quality_issues": quality_issues,
            "readiness": readiness,
            "recommendations": recommendations
        }
