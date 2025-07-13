# Docker Deployment Guide

This guide explains how to deploy the Release Tracker UI using Docker.

## Prerequisites

- Docker installed and running
- Docker Compose installed
- Access to the source code

## Quick Start

### 1. Set up Environment Variables

Run the setup script to configure your environment:

```bash
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
```

This will create `env.production` and `env.development` files with your configuration.

### 2. Build and Run

#### Using Docker Compose (Recommended)

**Production:**
```bash
docker-compose up release-tracker-prod
```

**Development:**
```bash
docker-compose up release-tracker-dev
```

#### Using Docker Build Script

**Production:**
```bash
chmod +x scripts/docker-build.sh
./scripts/docker-build.sh --build-type production
```

**Development:**
```bash
./scripts/docker-build.sh --build-type development
```

## Environment Variables

### Required Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `API_BASE_URL` | Base URL for the backend API | `http://localhost:8081` | `https://api.example.com` |
| `API_TIMEOUT` | API request timeout in milliseconds | `30000` | `60000` |
| `ENABLE_MOCK_DATA` | Enable/disable mock data | `false` (prod), `true` (dev) | `false` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_TITLE` | Application title | `Release Tracker` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `LOG_LEVEL` | Logging level | `info` |

### Environment Files

- `env.production` - Production environment variables
- `env.development` - Development environment variables
- `env.example` - Example configuration file

## Docker Images

### Production Image

- **Base**: `nginx:alpine`
- **Size**: ~50MB (optimized)
- **Port**: 80
- **Features**:
  - Multi-stage build
  - Gzip compression
  - Security headers
  - Health checks
  - Non-root user

### Development Image

- **Base**: `node:18-alpine`
- **Size**: ~200MB
- **Port**: 3000
- **Features**:
  - Hot reloading
  - Volume mounting
  - Development tools

## Configuration Examples

### Local Development

```bash
# Set environment variables
export API_BASE_URL=http://localhost:8081
export ENABLE_MOCK_DATA=true

# Run development container
docker-compose up release-tracker-dev
```

### Production Deployment

```bash
# Set environment variables
export API_BASE_URL=https://api.production.com
export ENABLE_MOCK_DATA=false

# Run production container
docker-compose up release-tracker-prod
```

### Custom API Configuration

Edit `env.production`:

```bash
# API Configuration
API_BASE_URL=https://your-api-server.com
API_TIMEOUT=60000

# Feature Flags
ENABLE_MOCK_DATA=false
```

## Docker Compose Services

### Production Service (`release-tracker-prod`)

- **Port**: 8080:80
- **Environment**: Production optimized
- **Health Check**: `/health` endpoint
- **Restart Policy**: Unless stopped

### Development Service (`release-tracker-dev`)

- **Port**: 3000:3000
- **Environment**: Development with hot reload
- **Volumes**: Source code mounted
- **Restart Policy**: Unless stopped

## Nginx Configuration

The production image includes a custom nginx configuration with:

- **Gzip compression** for better performance
- **Security headers** (X-Frame-Options, X-Content-Type-Options, etc.)
- **Caching** for static assets
- **SPA routing** support (React Router)
- **Health check** endpoint

## Health Checks

The application includes health checks:

```bash
# Check container health
docker ps

# Manual health check
curl http://localhost:8080/health
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change ports in docker-compose.yml
   ports:
     - "8081:80"  # Use different port
   ```

2. **Environment variables not loading**
   ```bash
   # Check env file exists
   ls -la env.production
   
   # Verify variables
   docker-compose config
   ```

3. **Build fails**
   ```bash
   # Clean build
   docker-compose build --no-cache
   
   # Check logs
   docker-compose logs
   ```

### Logs

```bash
# View logs
docker-compose logs release-tracker-prod

# Follow logs
docker-compose logs -f release-tracker-prod

# View nginx logs
docker exec -it <container_id> tail -f /var/log/nginx/access.log
```

## Security Considerations

- **Non-root user**: Application runs as non-root user
- **Security headers**: XSS protection, content type sniffing protection
- **Minimal base image**: Alpine Linux for smaller attack surface
- **No secrets in image**: Environment variables for configuration

## Performance Optimization

- **Multi-stage build**: Smaller final image
- **Gzip compression**: Reduced bandwidth usage
- **Static asset caching**: Better user experience
- **Nginx optimization**: Efficient serving of static files

## Monitoring

### Health Check Endpoint

```bash
curl http://localhost:8080/health
# Returns: healthy
```

### Metrics (Optional)

Add monitoring with Prometheus/Grafana:

```yaml
# docker-compose.yml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
```

## Deployment Examples

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: release-tracker-ui
spec:
  replicas: 3
  selector:
    matchLabels:
      app: release-tracker-ui
  template:
    metadata:
      labels:
        app: release-tracker-ui
    spec:
      containers:
      - name: release-tracker-ui
        image: release-tracker-ui:latest
        ports:
        - containerPort: 80
        env:
        - name: API_BASE_URL
          value: "https://api.example.com"
        - name: ENABLE_MOCK_DATA
          value: "false"
```

### AWS ECS

```json
{
  "family": "release-tracker-ui",
  "containerDefinitions": [
    {
      "name": "release-tracker-ui",
      "image": "release-tracker-ui:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "API_BASE_URL",
          "value": "https://api.example.com"
        },
        {
          "name": "ENABLE_MOCK_DATA",
          "value": "false"
        }
      ]
    }
  ]
}
``` 