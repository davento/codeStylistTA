FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

EXPOSE 5003

# Command to run the application
CMD ["flask", "--app", "app", "run", "--host", "0.0.0.0", "--port", "5003"]
