#!/bin/bash

# OSM Road Closures Production Deployment Script
set -e

echo "🚀 Starting production deployment for OSM Road Closures"

# Check if we're in the right directory
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found. Please run from project root."
    exit 1
fi

# Check if .env.prod exists
if [ ! -f ".env.prod" ]; then
    echo "❌ Error: .env.prod not found. Please create it with your production settings."
    echo "💡 Example: Copy .env.prod.example to .env.prod and fill in the values"
    exit 1
fi

# Source environment variables
source .env.prod

# Validate required environment variables
if [ -z "$DB_PASSWORD" ] || [ -z "$SECRET_KEY" ]; then
    echo "❌ Error: Required environment variables not set in .env.prod"
    echo "   Please ensure DB_PASSWORD and SECRET_KEY are set"
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs backups nginx/ssl

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Remove unused Docker resources
echo "🧹 Cleaning up Docker resources..."
docker system prune -f

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 45

# Check health of all services
echo "🏥 Checking service health..."

# Check database
echo "Checking database..."
if docker-compose -f docker-compose.prod.yml exec -T db pg_isready -U postgres; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready"
fi

# Check Redis
echo "Checking Redis..."
if docker-compose -f docker-compose.prod.yml exec -T redis redis-cli ping | grep -q PONG; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
fi

# Check API
echo "Checking API..."
if docker-compose -f docker-compose.prod.yml exec -T api curl -f http://localhost:8000/health; then
    echo "✅ API is ready"
else
    echo "❌ API is not ready"
fi

# Check Frontend
echo "Checking Frontend..."
if docker-compose -f docker-compose.prod.yml exec -T frontend curl -f http://localhost:3000; then
    echo "✅ Frontend is ready"
else
    echo "❌ Frontend is not ready"
fi

# Display service status
echo "📊 Service Status:"
docker-compose -f docker-compose.prod.yml ps

# Show logs for unhealthy services
unhealthy_services=$(docker-compose -f docker-compose.prod.yml ps --filter "health=unhealthy" -q)
if [ ! -z "$unhealthy_services" ]; then
    echo "⚠️  Found unhealthy services. Showing recent logs..."
    for service in $unhealthy_services; do
        service_name=$(docker inspect --format='{{.Name}}' $service | sed 's/\///')
        echo "📋 Logs for $service_name:"
        docker logs --tail 20 $service
        echo "---"
    done
fi

# Test external access
echo "🌐 Testing external access..."
echo "Frontend should be accessible at: http://closures.osm.ch"
echo "API should be accessible at: http://api.closures.osm.ch"
echo "API docs should be accessible at: http://api.closures.osm.ch/docs"

# Show final URLs
echo ""
echo "✨ Deployment completed!"
echo ""
echo "🔗 Application URLs:"
echo "   Frontend:    http://closures.osm.ch"
echo "   API:         http://api.closures.osm.ch"
echo "   API Docs:    http://api.closures.osm.ch/docs"
echo "   Health Check: http://api.closures.osm.ch/health"
echo ""
echo "📊 To view logs:"
echo "   docker-compose -f docker-compose.prod.yml logs -f [service-name]"
echo ""
echo "🔧 To troubleshoot:"
echo "   docker-compose -f docker-compose.prod.yml ps"
echo "   docker-compose -f docker-compose.prod.yml exec [service-name] /bin/sh"