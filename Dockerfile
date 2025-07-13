# Multi-stage build for production
# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application with environment variables
ARG VITE_API_BASE_URL
ARG VITE_API_TIMEOUT
ARG VITE_ENABLE_MOCK_DATA
ARG VITE_APP_TITLE
ARG VITE_APP_VERSION

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT
ENV VITE_ENABLE_MOCK_DATA=$VITE_ENABLE_MOCK_DATA
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_APP_VERSION=$VITE_APP_VERSION

RUN npm run build

# Stage 2: Production runtime
FROM nginx:alpine AS production

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx user if it doesn't exist
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of the nginx directory
RUN chown -R nextjs:nodejs /usr/share/nginx/html && \
    chown -R nextjs:nodejs /var/cache/nginx && \
    chown -R nextjs:nodejs /var/log/nginx && \
    chown -R nextjs:nodejs /etc/nginx/conf.d

# Switch to non-root user
USER nextjs

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 