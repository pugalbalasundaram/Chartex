import pandas as pd
from app.services.sandbox_service import SandboxService

def test():
    print("Testing Sandbox...")
    df = pd.DataFrame({"A": [1, 2, 3], "B": [4, 5, 6]})
    
    code = """
while True:
    pass
    """
    
    print("Executing infinite loop...")
    result = SandboxService.execute(code, df)
    
    print("Result:", result)
    assert result["success"] == False
    assert "timeout" in result["error"].lower() or "too long" in result["error"].lower()
    print("Timeout test passed!")
    
if __name__ == "__main__":
    test()
