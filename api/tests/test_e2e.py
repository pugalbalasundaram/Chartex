import requests
import json
import time

BASE_URL = "http://localhost:8000"

def run_tests():
    print("--- 0. Register & Verify ---")
    session = requests.Session()
    email = f"test_{int(time.time())}@test.com"
    r = session.post(f"{BASE_URL}/auth/signup", json={"email": email, "password": "password123", "username": "testuser"})
    if r.status_code != 200:
        print(f"Signup failed: {r.text}")
        return
        
    otp = None
    try:
        with open("mail.log", "r") as f:
            for line in f.readlines()[::-1]:
                if email in line:
                    otp = line.split("OTP:")[1].strip()
                    break
    except: pass
    if not otp:
        print("Failed to get OTP")
        return
        
    r = session.post(f"{BASE_URL}/auth/verify-email", json={"email": email, "otp": otp})
    if r.status_code != 200:
        print(f"Verify failed: {r.text}")
        return
        
    print("--- 1. Login ---")
    resp = session.post(f"{BASE_URL}/auth/login", json={"email": email, "password": "password123"})
    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("--- 2. Upload dataset ---")
    with open("Sales.csv", "w") as f:
        f.write("Date,Category,Sales\n2023-01-01,Electronics,500\n2023-01-02,Clothing,300\n2023-01-03,Electronics,600\n2023-01-04,Books,150\n")
    
    with open("Sales.csv", "rb") as f:
        resp = session.post(f"{BASE_URL}/upload/", headers=headers, files={"file": ("Sales.csv", f, "text/csv")})
    if resp.status_code != 200:
        print(f"Upload failed: {resp.text}")
        return
    dataset_id = resp.json()["dataset_id"]
    print(f"Uploaded Dataset ID: {dataset_id}")
    
    print("--- 3. Test Automatic Analytics ---")
    for _ in range(10):
        resp = session.get(f"{BASE_URL}/datasets/{dataset_id}/analytics", headers=headers)
        if resp.status_code == 200:
            print("Analytics completed!")
            data = resp.json()
            print("AI Insights:", data.get("ai_insights"))
            break
        elif resp.status_code == 202:
            print("Analytics processing...")
            time.sleep(2)
        else:
            print(f"Analytics failed: {resp.status_code}")
            break
    
    print("--- 4. Chat Questions ---")
    questions = [
        "What are the top 5 categories by total sales?",
        "What is the average value of the Sales column?",
        "Show me the records where the sales value is above the average.",
        "Which category has the highest sales?",
        "Create a bar chart showing sales by category."
    ]
    
    for q in questions:
        print(f"\nQ: {q}")
        with session.post(f"{BASE_URL}/chat/stream", headers=headers, json={"dataset_id": dataset_id, "message": q}, stream=True) as r:
            for line in r.iter_lines():
                if line:
                    decoded = line.decode('utf-8')
                    if decoded.startswith("data: "):
                        content = decoded[6:]
                        if content == "[DONE]":
                            print("\n[DONE]")
                        elif content.startswith("{"):
                            print(f"\n[PAYLOAD]: {json.dumps(json.loads(content), indent=2)}")
                        else:
                            print(content, end="", flush=True)
        print("\nSleeping 20 seconds for rate limits...")
        time.sleep(20)

import sys
sys.stdout.reconfigure(encoding='utf-8')

if __name__ == "__main__":
    run_tests()
