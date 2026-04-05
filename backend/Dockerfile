# ---- 1. Use a small Python base ----
FROM python:3.11-slim AS base

# Set working directory
WORKDIR /app

# ---- 2. Copy and install dependencies ----
COPY requirements.txt .

# Install only production deps
RUN pip install --no-cache-dir -r requirements.txt

# ---- 3. Copy app code ----
COPY . .

# ---- 4. Expose port (Railway uses $PORT) ----
ENV PORT=8000
EXPOSE 8000

# ---- 5. Start the FastAPI server ----
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]