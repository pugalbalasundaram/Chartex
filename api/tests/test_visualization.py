from app.services.visualization_service import VisualizationIntelligence

def test():
    print("Testing Visualization Intelligence...")
    
    # TEST 1: Fallback from unsupported chart
    table_data = [
        {"Category": "Electronics", "Revenue": 1200},
        {"Category": "Clothing", "Revenue": 500}
    ]
    intent = {"should_visualize": True, "requested_chart": "scatter", "purpose": "comparison"}
    res = VisualizationIntelligence.process(table_data, intent)
    print("TEST 1 (Scatter Fallback):", res)
    assert res["chart_type"] == "bar"

    # TEST 2: High cardinality Pie downgraded to Bar
    table_data_large = [{"Category": f"Item {i}", "Revenue": i*100} for i in range(20)]
    intent_pie = {"should_visualize": True, "requested_chart": "pie", "purpose": "composition"}
    res2 = VisualizationIntelligence.process(table_data_large, intent_pie)
    print("TEST 2 (High Cardinality Pie):", res2["chart_type"])
    assert res2["chart_type"] == "bar"
    
    # TEST 3: Scalar value rejected
    table_data_scalar = [{"Revenue": 5000}]
    res3 = VisualizationIntelligence.process(table_data_scalar, intent)
    print("TEST 3 (Scalar Value):", res3)
    assert res3["chart_type"] is None
    
    # TEST 4: Time trend defaults to area if no chart requested
    table_data_time = [
        {"Month": "Jan", "Sales": 10},
        {"Month": "Feb", "Sales": 20}
    ]
    intent_auto = {"should_visualize": True, "requested_chart": None, "purpose": "trend"}
    res4 = VisualizationIntelligence.process(table_data_time, intent_auto)
    print("TEST 4 (Time Trend Default):", res4["chart_type"])
    assert res4["chart_type"] == "area"

    print("\nAll Visualization Intelligence tests passed!")

if __name__ == "__main__":
    test()
