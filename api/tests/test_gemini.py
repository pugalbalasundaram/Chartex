import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("GEMINI_API_KEY is missing")
    exit(1)

print("GEMINI_API_KEY exists")

try:
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=["Reply 'OK' if you can read this."]
    )
    print("API CONNECTIVITY OK")
    print(response.text)
except Exception as e:
    print(f"API ERROR: {e}")
