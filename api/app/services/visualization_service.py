import math
from typing import Any, Dict, List, Optional

class VisualizationIntelligence:
    
    SUPPORTED_CHARTS = ["bar", "pie", "area"]
    MAX_PIE_CATEGORIES = 8
    MAX_ITEMS = 1000

    @staticmethod
    def process(table_data: Optional[List[Dict[str, Any]]], intent: Dict[str, Any]) -> Dict[str, Any]:
        """
        Determines the appropriate visualization based on the table data and analytical intent.
        Returns a dictionary with 'chart_type' and 'chart_data'.
        """
        if not table_data or len(table_data) <= 1:
            return {"chart_type": None, "chart_data": None}
            
        should_visualize = intent.get("should_visualize", True)
        if not should_visualize:
            return {"chart_type": None, "chart_data": None}
            
        requested_chart = intent.get("requested_chart", "")
        if isinstance(requested_chart, str):
            requested_chart = requested_chart.lower()
            
        # Map equivalent semantic charts to the supported frontend components
        if requested_chart == "line":
            requested_chart = "area"
        elif requested_chart == "donut":
            requested_chart = "pie"
            
        # 1. Identify columns
        first_row = table_data[0]
        keys = list(first_row.keys())
        if len(keys) < 2:
            return {"chart_type": None, "chart_data": None}
            
        # Default fallback
        label_key = keys[0]
        value_key = keys[1]
        
        # If there are multiple keys, try to find a numeric one for values (preferring the last ones)
        for k in reversed(keys):
            val = first_row.get(k)
            if isinstance(val, (int, float)):
                value_key = k
                break
                
        # The label key should be the first key that is not the value key
        for k in keys:
            if k != value_key:
                label_key = k
                break

        labels = []
        values = []
        
        for row in table_data:
            l = row.get(label_key)
            v = row.get(value_key)
            
            # Clean values for valid JSON
            if v is None or (isinstance(v, float) and (math.isnan(v) or math.isinf(v))):
                v = 0
            
            labels.append(str(l))
            values.append(v)
            
        # 2. Apply Guardrails
        chart_type = requested_chart if requested_chart in VisualizationIntelligence.SUPPORTED_CHARTS else "bar"
        
        # Heuristics if no chart requested or an unsupported chart was requested
        if not requested_chart or requested_chart not in VisualizationIntelligence.SUPPORTED_CHARTS:
            # Check if it looks temporal
            label_lower = label_key.lower()
            if any(t in label_lower for t in ["date", "time", "month", "year", "day"]):
                chart_type = "area"
            else:
                chart_type = "bar"
                
        # Cardinality rules
        if chart_type == "pie" and len(labels) > VisualizationIntelligence.MAX_PIE_CATEGORIES:
            chart_type = "bar"
            
        # Truncate to MAX_ITEMS
        if len(labels) > VisualizationIntelligence.MAX_ITEMS:
            labels = labels[:VisualizationIntelligence.MAX_ITEMS]
            values = values[:VisualizationIntelligence.MAX_ITEMS]

        return {
            "chart_type": chart_type,
            "chart_data": {
                "labels": labels,
                "values": values
            }
        }
