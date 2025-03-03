FROM node:18-alpine

WORKDIR /app

# Copy package files for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend application
COPY . ./

# Build the application
RUN npm run build

# Set Next.js port using environment variable
ENV PORT=5003

EXPOSE 5003

# Command to run the application
CMD ["npm", "run", "start"]
