#!/bin/bash

# Docker debug script for Release Tracker UI
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Docker Debug Script for Release Tracker UI"
echo "================================================"

# Check if Docker is running
print_status "Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi
print_success "Docker is running"

# Check Docker version
print_status "Docker version:"
docker --version

# Check if required files exist
print_status "Checking required files..."
required_files=("package.json" "package-lock.json" "Dockerfile.simple" "nginx.conf")
missing_files=()

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_error "✗ $file missing"
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    print_error "Missing required files: ${missing_files[*]}"
    exit 1
fi

# Check package.json for build script
print_status "Checking package.json..."
if grep -q '"build"' package.json; then
    print_success "✓ Build script found in package.json"
else
    print_error "✗ Build script not found in package.json"
fi

# Check if Vite is in devDependencies
if grep -q '"vite"' package.json; then
    print_success "✓ Vite found in package.json"
else
    print_error "✗ Vite not found in package.json"
fi

# Check environment files
print_status "Checking environment files..."
if [ -f "env.production" ]; then
    print_success "✓ env.production exists"
else
    print_warning "⚠ env.production missing (will use defaults)"
fi

if [ -f "env.development" ]; then
    print_success "✓ env.development exists"
else
    print_warning "⚠ env.development missing (will use defaults)"
fi

# Test Docker build
print_status "Testing Docker build..."
print_status "Building with Dockerfile.simple..."

# Build the image with detailed output
if docker build -f Dockerfile.simple -t release-tracker-debug .; then
    print_success "✓ Docker build successful"
    
    # Show image info
    print_status "Image information:"
    docker images release-tracker-debug --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
    
    # Test running the container
    print_status "Testing container startup..."
    CONTAINER_ID=$(docker run -d -p 8082:80 release-tracker-debug)
    
    # Wait a moment for container to start
    sleep 5
    
    # Check if container is running
    if docker ps | grep -q "$CONTAINER_ID"; then
        print_success "✓ Container started successfully"
        
        # Test health check
        print_status "Testing health check..."
        if curl -f http://localhost:8082/health > /dev/null 2>&1; then
            print_success "✓ Health check passed"
        else
            print_warning "⚠ Health check failed"
        fi
        
        # Stop and remove test container
        docker stop "$CONTAINER_ID" > /dev/null 2>&1
        docker rm "$CONTAINER_ID" > /dev/null 2>&1
        print_status "Test container cleaned up"
    else
        print_error "✗ Container failed to start"
        docker logs "$CONTAINER_ID"
        docker stop "$CONTAINER_ID" > /dev/null 2>&1
        docker rm "$CONTAINER_ID" > /dev/null 2>&1
    fi
else
    print_error "✗ Docker build failed"
    exit 1
fi

# Clean up test image
docker rmi release-tracker-debug > /dev/null 2>&1

echo ""
print_success "Debug check completed successfully!"
print_status "You can now run: docker-compose up release-tracker-prod" 