import pandas as pd
import json
from app.services.dataset_profiler import DatasetProfiler

def test_profiler_schema():
    df = pd.DataFrame({
        "Category": ["Electronics", "Electronics", "Clothing", "Clothing", "Books", "Books", "Toys"],
        "Region": ["North", "North", "South", "South", "North", "South", "East"],
        "Year": [2024, 2025, 2024, 2025, 2024, 2025, 2024],
        "Revenue": [1000, 1500, 700, 900, 300, 400, 1200],
        "Age": [25, 27, 31, 33, 42, 45, 19],
        "AdSpend": [300, 400, 250, 280, 100, 120, 350],
        "OrderDate": pd.to_datetime(["2024-01-01", "2025-01-01", "2024-02-01", "2025-02-01", "2024-03-01", "2025-03-01", "2024-04-01"]),
        "CustomerID": ["C001", "C002", "C003", "C004", "C005", "C006", "C007"],
        "Comment": ["Good", "Excellent", "Average", "Good", "Okay", "Bad", "Superb " * 10], # One long string to test length, but unique
        "IsActive": [True, False, True, False, True, False, True]
    })
    
    # Introduce an outlier and some duplicates
    df.loc[7] = ["Electronics", "North", 2024, 999999, 100, 10000, pd.to_datetime("2024-01-01"), "C008", "Wow", True] # Outlier
    df.loc[8] = df.loc[0].copy() # Duplicate
    
    # Introduce missing values
    df.loc[2, "Revenue"] = None
    df.loc[4, "Age"] = None
    
    profile = DatasetProfiler.profile(df)
    
    # JSON serialization check
    json_str = json.dumps(profile)
    assert "NaN" not in json_str, "Found NaN in JSON output!"
    assert "Infinity" not in json_str, "Found Infinity in JSON output!"
    
    print(f"Row count: {profile['row_count']}")
    print(f"Readiness: {profile['readiness']}")
    print(f"Quality Score: {profile['quality_score']}")
    
    # Validations
    assert profile["row_count"] == 9
    assert profile["missing_summary"]["total_missing_cells"] == 2
    assert profile["duplicate_summary"]["duplicate_rows"] > 0
    assert "Revenue" in profile["numeric_columns"]
    assert "IsActive" in profile["boolean_columns"]
    assert "OrderDate" in profile["datetime_columns"]
    assert "CustomerID" in profile["categorical_columns"] # Will it be text? len is 4, so categorical
    
    # Check Outliers
    assert len(profile["outliers"]) > 0
    
    # Check ID detection
    id_col = next(c for c in profile["columns"] if c["name"] == "CustomerID")
    assert id_col["likely_identifier"] is True
    
    print("All tests passed.")

if __name__ == "__main__":
    test_profiler_schema()
