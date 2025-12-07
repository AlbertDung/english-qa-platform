# Use Node.js LTS version
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Use PORT env var (Cloud Run requirement) or default to 8080
ENV PORT=8080

# Start the application
CMD ["node", "dist/server.js"]

