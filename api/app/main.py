from fastapi import FastAPI

app = FastAPI(
    title="Charex API",
    version="1.0.0",
    description="AI-Native Analytics Platform"
)


@app.get("/")
async def root():
    return {
        "status": "success",
        "message": "Welcome to Charex API 🚀"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }