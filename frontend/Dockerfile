FROM node:18-alpine

WORKDIR /app

# Copy package files for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the frontend application
COPY . ./

# Remove _next folder from public directory if it exists
RUN rm -rf ./public/_next

# Build the application
RUN npm run build

# Set Next.js port and host using environment variables
ENV PORT=5005
ENV HOSTNAME=0.0.0.0

EXPOSE 5005

# 5 Command to run the application
CMD ["npm", "run", "start"]
