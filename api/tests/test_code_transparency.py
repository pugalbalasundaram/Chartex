import asyncio
import os
import json
import pandas as pd
from app.services.agent_service import AgentService

def test_transparency():
    agent = AgentService()
    df = pd.DataFrame({
        "Category": ["A", "B", "C"],
        "Revenue": [100, 200, 300]
    })
    
    stream = agent.process_query_stream(
        dataframe=df,
        statistics={},
        data_types={"Category": "object", "Revenue": "int64"},
        question="What is the average revenue?"
    )
    
    final_payload = None
    for chunk in stream:
        print("CHUNK:", chunk)
        data = json.loads(chunk)
        if "payload" in data:
            final_payload = data["payload"]
            
    print("\nFINAL PAYLOAD:", json.dumps(final_payload, indent=2))
    assert "generated_code" in final_payload
    assert final_payload["generated_code"] is not None
    assert "df[\"Revenue\"].mean()" in final_payload["generated_code"] or "mean" in final_payload["generated_code"]
    
if __name__ == "__main__":
    test_transparency()
