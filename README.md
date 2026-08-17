# Charex

Charex is an intelligent data analysis platform powered by Gemini.

## Requirements

- Node.js >= 18
- Python >= 3.11
- PostgreSQL (or SQLite for development)
- Google Gemini API Key

## Setup

### Backend (API)

```bash
cd api
python -m venv .venv
source .venv/Scripts/activate  # Windows
# source .venv/bin/activate  # macOS/Linux

pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and other settings.

# Run migrations (Optional if using default SQLite)
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend (Web)

```bash
cd apps/web
npm install

# Start server
npm run dev
```

## Architecture

- **Backend**: FastAPI, SQLAlchemy, Alembic, Pandas, Google GenAI SDK.
- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion, Recharts.
- **AI Agent**: Custom sandbox environment for safe code execution, multi-step analytical reasoning, and stateful dataset contexts.

## Deployment Notes

- `SECRET_KEY` in `.env` must be secure for production.
- `api/requirements.txt` is pinned for production stability.
- Ensure correct database URL is provided via `DATABASE_URL`.
- Set up a cron or automated task to manage cleanup of old datasets/sandboxes if applicable.
