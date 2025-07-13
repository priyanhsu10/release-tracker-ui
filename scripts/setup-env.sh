#!/bin/bash

# Environment setup script for Release Tracker UI
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

# Function to prompt for input with default value
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    echo -n "$prompt [$default]: "
    read -r input
    if [ -z "$input" ]; then
        input="$default"
    fi
    eval "$var_name=\"$input\""
}

print_status "Setting up environment files for Release Tracker UI..."

# Check if env files already exist
if [ -f "env.production" ] || [ -f "env.development" ]; then
    print_warning "Environment files already exist!"
    echo -n "Do you want to overwrite them? (y/N): "
    read -r overwrite
    if [[ ! "$overwrite" =~ ^[Yy]$ ]]; then
        print_status "Environment setup cancelled."
        exit 0
    fi
fi

echo ""
print_status "Production Environment Setup"
echo "=================================="

# Get production environment values
prompt_with_default "Enter API Base URL for production" "http://api.example.com" API_BASE_URL_PROD
prompt_with_default "Enter API timeout (ms)" "30000" API_TIMEOUT_PROD
prompt_with_default "Enable mock data in production? (true/false)" "false" ENABLE_MOCK_DATA_PROD
prompt_with_default "Enter log level" "info" LOG_LEVEL_PROD

echo ""
print_status "Development Environment Setup"
echo "==================================="

# Get development environment values
prompt_with_default "Enter API Base URL for development" "http://localhost:8081" API_BASE_URL_DEV
prompt_with_default "Enter API timeout (ms)" "30000" API_TIMEOUT_DEV
prompt_with_default "Enable mock data in development? (true/false)" "true" ENABLE_MOCK_DATA_DEV
prompt_with_default "Enter log level" "debug" LOG_LEVEL_DEV

# Create production environment file
cat > env.production << EOF
# Production Environment Variables
# API Configuration
API_BASE_URL=$API_BASE_URL_PROD
API_TIMEOUT=$API_TIMEOUT_PROD

# Feature Flags
ENABLE_MOCK_DATA=$ENABLE_MOCK_DATA_PROD

# Application Settings
NODE_ENV=production
VITE_APP_TITLE=Release Tracker
VITE_APP_VERSION=1.0.0

# Logging
LOG_LEVEL=$LOG_LEVEL_PROD
EOF

# Create development environment file
cat > env.development << EOF
# Development Environment Variables
# API Configuration
API_BASE_URL=$API_BASE_URL_DEV
API_TIMEOUT=$API_TIMEOUT_DEV

# Feature Flags
ENABLE_MOCK_DATA=$ENABLE_MOCK_DATA_DEV

# Application Settings
NODE_ENV=development
VITE_APP_TITLE=Release Tracker (Dev)
VITE_APP_VERSION=1.0.0

# Logging
LOG_LEVEL=$LOG_LEVEL_DEV
EOF

print_success "Environment files created successfully!"

echo ""
print_status "Created files:"
echo "  - env.production"
echo "  - env.development"

echo ""
print_status "Next steps:"
echo "  1. Review and edit the environment files if needed"
echo "  2. Build and run with docker-compose:"
echo "     - Production: docker-compose up release-tracker-prod"
echo "     - Development: docker-compose up release-tracker-dev"
echo ""
print_status "Or use the build script:"
echo "  ./scripts/docker-build.sh --build-type production"
echo "  ./scripts/docker-build.sh --build-type development" 