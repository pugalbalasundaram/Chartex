FROM python:3.10-slim

# Prevent Python from writing pyc files and keep stdout unbuffered
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create a non-root user
RUN useradd -m charex
USER charex

# Copy the application code
COPY --chown=charex:charex . .

# Expose port (Render sets PORT automatically)
ENV PORT=8000
EXPOSE ${PORT}

# Start command runs migrations then starts the server
# We use a shell format to evaluate the PORT environment variable and run sequential commands
CMD sh -c "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"
