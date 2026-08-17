import pandas as pd
from app.services.agent_service import AgentService

def test():
    print("Testing Context Resolution...")
    
    agent = AgentService()
    df = pd.DataFrame({"Category": ["Electronics", "Clothing", "Books", "Electronics"], "Revenue": [1000, 500, 300, 200]})
    statistics = {}
    data_types = {"Category": "object", "Revenue": "int64"}
    
    # Simulate a history where we asked about revenue by category
    history = [
        {"role": "user", "content": "What is the total revenue by category?"},
        {"role": "assistant", "content": "Electronics has 1200 revenue. Clothing has 500. Books has 300."}
    ]
    
    print("\n--- TEST 1: STANDALONE (No history) ---")
    question = "How many rows are in the dataset?"
    stream = agent.process_query_stream(df, statistics, data_types, question, [])
    for msg in stream:
        print(msg)
        
    print("\n--- TEST 2: FOLLOW-UP (Chart request) ---")
    question = "Show that as a bar chart."
    stream = agent.process_query_stream(df, statistics, data_types, question, history)
    for msg in stream:
        print(msg)
        
    print("\n--- TEST 3: EXPLICIT RESET ---")
    question = "Ignore the previous analysis. What is the sum of all revenue?"
    stream = agent.process_query_stream(df, statistics, data_types, question, history)
    for msg in stream:
        print(msg)

if __name__ == "__main__":
    test()
