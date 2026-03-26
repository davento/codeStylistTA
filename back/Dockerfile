FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Create data directory
RUN mkdir -p /app/data

# Set data environment variable (just in case for deploy)
ENV DATA_DIR=/app/data

# Copy the rest of the application
COPY . .

# Expose backend on port 4651
EXPOSE 4651

# Run Gunicorn, binding to port 4651
CMD ["gunicorn", "--bind", "0.0.0.0:4651", "--timeout", "120", "app:app"]
