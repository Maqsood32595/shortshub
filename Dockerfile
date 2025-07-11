# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY package*.json ./

# Install backend dependencies
RUN cd server && npm ci --only=production

# Install frontend dependencies (if package.json exists)
RUN npm ci --only=production || echo "No root package.json found"

# Copy source code
COPY server/ ./server/
COPY . .

# Build backend
RUN cd server && npm run build

# Build frontend
RUN npm run build || echo "No frontend build script found"

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start the application
CMD ["node", "server/dist/index.js"]