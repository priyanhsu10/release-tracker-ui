#!/bin/bash

# Docker build script for Release Tracker UI
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

# Default values
IMAGE_NAME="release-tracker-ui"
TAG="latest"
BUILD_TYPE="production"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--tag)
            TAG="$2"
            shift 2
            ;;
        -n|--name)
            IMAGE_NAME="$2"
            shift 2
            ;;
        -b|--build-type)
            BUILD_TYPE="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -t, --tag TAG         Docker image tag (default: latest)"
            echo "  -n, --name NAME       Docker image name (default: release-tracker-ui)"
            echo "  -b, --build-type TYPE Build type: production or development (default: production)"
            echo "  -h, --help            Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

print_status "Building Release Tracker UI Docker image..."
print_status "Image name: $IMAGE_NAME"
print_status "Tag: $TAG"
print_status "Build type: $BUILD_TYPE"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Docker image
if [ "$BUILD_TYPE" = "production" ]; then
    print_status "Building production image..."
    docker build -t "$IMAGE_NAME:$TAG" -f Dockerfile .
elif [ "$BUILD_TYPE" = "development" ]; then
    print_status "Building development image..."
    docker build -t "$IMAGE_NAME:$TAG" -f Dockerfile.dev .
else
    print_error "Invalid build type: $BUILD_TYPE. Use 'production' or 'development'."
    exit 1
fi

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully!"
    print_status "Image: $IMAGE_NAME:$TAG"
    
    # Show image size
    IMAGE_SIZE=$(docker images "$IMAGE_NAME:$TAG" --format "table {{.Size}}" | tail -n 1)
    print_status "Image size: $IMAGE_SIZE"
    
    # Show usage instructions
    echo ""
    print_status "To run the container:"
    if [ "$BUILD_TYPE" = "production" ]; then
        echo "  docker run -p 8080:80 $IMAGE_NAME:$TAG"
        echo "  Then visit: http://localhost:8080"
    else
        echo "  docker run -p 3000:3000 $IMAGE_NAME:$TAG"
        echo "  Then visit: http://localhost:3000"
    fi
    
    echo ""
    print_status "Or use docker-compose:"
    if [ "$BUILD_TYPE" = "production" ]; then
        echo "  docker-compose up release-tracker-prod"
    else
        echo "  docker-compose up release-tracker-dev"
    fi
else
    print_error "Failed to build Docker image."
    exit 1
fi 