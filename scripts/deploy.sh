#!/bin/bash

# OSM Road Closures Deployment Script
set -e

ENVIRONMENT=${1:-dev}
COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"
ENV_FILE=".env.${ENVIRONMENT}"

echo "🚀 Starting deployment for environment: ${ENVIRONMENT}"

# Check if environment file exists
if [ ! -f "${ENV_FILE}" ]; then
    echo "❌ Error: ${ENV_FILE} not found. Please create it first."
    exit 1
fi

# Create necessary directories
mkdir -p logs backups nginx/ssl

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" down

# Remove unused Docker resources
echo "🧹 Cleaning up Docker resources..."
docker system prune -f

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Display service status
echo "📊 Service Status:"
docker-compose -f "${COMPOSE_FILE}" --env-file "${ENV_FILE}" ps

echo "✨ Deployment completed!"