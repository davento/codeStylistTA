FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose backend on port 6380
EXPOSE 6380

# Run Gunicorn, binding to port 6380
CMD ["gunicorn", "--bind", "0.0.0.0:6380", "app:app"]
