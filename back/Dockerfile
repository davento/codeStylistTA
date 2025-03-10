FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create data directory
RUN mkdir -p /app/data

# Copy the rest of the application
COPY . .

# Expose backend on port 5002
EXPOSE 5002

# Run Gunicorn, binding to port 5002
CMD ["gunicorn", "--bind", "0.0.0.0:5002", "app:app"]