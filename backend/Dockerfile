FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port Cloud Run uses
EXPOSE 8080

# Run the FastAPI server
# Cloud Run automatically sets the PORT environment variable to 8080
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
