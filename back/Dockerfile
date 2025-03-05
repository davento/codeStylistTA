FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

EXPOSE 8080

# No need to use the Flask development server in production
# Using gunicorn for better performance
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]