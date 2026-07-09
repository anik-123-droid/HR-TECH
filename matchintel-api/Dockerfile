FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libmagic1 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run as non-root user (Security Layer 14)
RUN adduser --disabled-password myuser
USER myuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
