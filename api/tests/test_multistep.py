import pandas as pd
from app.services.agent_service import AgentService

def test():
    print("Testing Multi-Step Reasoning...")
    
    agent = AgentService()
    df = pd.DataFrame({"Category": ["Electronics", "Clothing", "Books", "Electronics"], "Revenue": [1000, 500, 300, 200]})
    statistics = {}
    data_types = {"Category": "object", "Revenue": "int64"}
    
    print("\n--- TEST 1: SIMPLE QUESTION ---")
    question = "What is the total revenue?"
    stream = agent.process_query_stream(df, statistics, data_types, question)
    for msg in stream:
        print(msg)
        
    print("\n--- TEST 2: MULTI-STEP QUESTION ---")
    question = "Compare the top categories and explain how much each contributes to total sales."
    stream = agent.process_query_stream(df, statistics, data_types, question)
    for msg in stream:
        print(msg)

if __name__ == "__main__":
    test()
