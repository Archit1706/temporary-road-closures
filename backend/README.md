# OSM Road Closures API

A FastAPI-based backend service for managing temporary road closures in OpenStreetMap, designed for Google Summer of Code 2025.

## 🔧 Configuration

### Environment Variables

| Variable              | Description                  | Default            | Required |
| --------------------- | ---------------------------- | ------------------ | -------- |
| `DATABASE_URL`        | PostgreSQL connection string | `postgresql://...` | Yes      |
| `SECRET_KEY`          | JWT signing key              | -                  | Yes      |
| `DEBUG`               | Enable debug mode            | `false`            | No       |
| `ALLOWED_ORIGINS`     | CORS allowed origins         | `["*"]`            | No       |
| `OPENLR_ENABLED`      | Enable OpenLR encoding       | `true`             | No       |
| `RATE_LIMIT_REQUESTS` | Requests per hour            | `100`              | No       |

### Database Configuration

For production, ensure your PostgreSQL instance has:

-   PostGIS extension enabled
-   Sufficient memory for spatial operations
-   Appropriate connection limits
-   Regular backups configured

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**

```bash
# Check database is running
docker-compose ps db

# Check connection
docker-compose exec api python -c "from app.core.database import db_manager; print(db_manager.health_check())"

# Reset database
docker-compose down -v
docker-compose up -d db
docker-compose exec api alembic upgrade head
```

**PostGIS Extension Missing**

```sql
-- Connect to database and run:
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
```

**Permission Errors**

```bash
# Check user permissions
docker-compose exec api python -c "
from app.core.database import SessionLocal
from app.models.user import User
db = SessionLocal()
user = User.get_by_username(db, 'your-username')
print(f'Is moderator: {user.is_moderator if user else False}')
"
```

**OpenLR Encoding Failures**

-   OpenLR encoding is optional and won't prevent closure creation
-   Check logs for specific OpenLR library errors
-   Ensure geometry is valid LineString format

### Logs and Debugging

```bash
# View application logs
docker-compose logs -f api

# Database logs
docker-compose logs -f db

# Enable debug logging
# In .env file:
# DEBUG=true
# LOG_LEVEL=DEBUG
```

## 📚 API Documentation

### Interactive Documentation

Once running, visit:

-   **Swagger UI**: http://localhost:8000/api/v1/docs
-   **ReDoc**: http://localhost:8000/api/v1/redoc

### Example Requests

**Create User**

```bash
curl -X POST "http://localhost:8000/api/v1/users/" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "chicago_mapper",
    "email": "mapper@chicago.gov",
    "password": "secure_password_123",
    "full_name": "Chicago City Mapper"
  }'
```

**Update Closure**

```bash
curl -X PUT "http://localhost:8000/api/v1/closures/123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated: Water main repair - lane reopened",
    "end_time": "2025-06-01T15:00:00Z"
  }'
```

**Spatial Query**

```bash
# Get closures within 1km of a point
curl "http://localhost:8000/api/v1/closures/?bbox=-87.6348,-87.6248,41.8731,41.8831"
```

### Error Responses

The API returns structured error responses:

```json
{
    "error": "validation_error",
    "message": "Validation failed",
    "details": {
        "errors": [
            {
                "field": "geometry.coordinates",
                "message": "LineString must have at least 2 coordinates"
            }
        ]
    }
}
```

## 🧩 Integration Examples

### OsmAnd Integration

```kotlin
// Example OsmAnd plugin code
class ClosuresPlugin : OsmandPlugin {

    fun fetchClosures(bbox: LatLonBounds): List<Closure> {
        val url = "https://api.osmclosures.org/api/v1/closures/" +
                 "?bbox=${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}" +
                 "&active_only=true"

        return httpClient.get(url).body<ClosureResponse>().items
    }

    fun decodeOpenLR(closure: Closure): List<LatLon> {
        return openLRDecoder.decode(closure.openlrCode)
    }
}
```

### Frontend Integration

```javascript
// Example React integration
const fetchClosures = async (bounds) => {
    const bbox = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;

    const response = await fetch(
        `http://localhost:8000/api/v1/closures/?bbox=${bbox}&active_only=true`
    );

    return response.json();
};

// Display on map
const ClosureMap = () => {
    const [closures, setClosures] = useState([]);

    useEffect(() => {
        fetchClosures(mapBounds).then(setClosures);
    }, [mapBounds]);

    return (
        <MapContainer>
            {closures.items?.map((closure) => (
                <Polyline
                    key={closure.id}
                    positions={closure.geometry.coordinates}
                    color="red"
                    weight={5}
                />
            ))}
        </MapContainer>
    );
};
```

## 📋 Roadmap

### Phase 1: Core API (Weeks 1-5) ✅

-   [x] Database schema design
-   [x] FastAPI application structure
-   [x] User authentication system
-   [x] Closure CRUD operations
-   [x] Spatial query capabilities

### Phase 2: OpenLR Integration (Weeks 6-7)

-   [ ] OpenLR library integration
-   [ ] Automatic encoding on closure creation
-   [ ] OpenLR validation and error handling
-   [ ] Performance optimization for encoding

### Phase 3: Web Interface (Weeks 9-10)

-   [ ] React frontend development
-   [ ] Interactive map with Leaflet
-   [ ] Closure submission form
-   [ ] User dashboard and management

### Phase 4: OsmAnd Integration (Weeks 11-12)

-   [ ] OsmAnd plugin development
-   [ ] Real-time closure fetching
-   [ ] Route avoidance integration
-   [ ] Testing with navigation scenarios

### Phase 5: Polish & Documentation (Weeks 13-15)

-   [ ] Comprehensive testing
-   [ ] Performance optimization
-   [ ] Production deployment guide
-   [ ] API documentation completion

## 📄 License

This project is part of Google Summer of Code 2025 and is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Archit Rathod, OpenStreetMap

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Acknowledgments

-   **Google Summer of Code 2025** for funding this project
-   **OpenStreetMap Foundation** for mentorship and platform
-   **Simon Poole** for project guidance and mentorship
-   **PostGIS Team** for excellent geospatial database capabilities
-   **FastAPI Team** for the outstanding web framework
-   **TomTom** for OpenLR specification and libraries

## 📞 Support & Contact

-   **Project Repository**: [GitHub Link]
-   **GSoC Project Page**: [summerofcode.withgoogle.com/programs/2025/projects/tF4ccCqZ]
-   **Developer**: Archit Rathod (arath21@uic.edu)
-   **Mentor**: Simon Poole
-   **Issues**: Use GitHub Issues for bug reports and feature requests

---

**Ready to get started?** Run `docker-compose up -d` and visit http://localhost:8000/api/v1/docs to explore the API! 🚀🎯 Project Overview

This project creates a centralized system for collecting and disseminating temporary road closure information, compatible with OSM-based navigation applications. It features:

-   **🗺️ Geospatial Support**: PostGIS-powered spatial queries and geometry storage
-   **📍 OpenLR Integration**: Location referencing for cross-platform compatibility
-   **🔐 Secure API**: JWT authentication and role-based permissions
-   **📊 Real-time Data**: REST API for submitting and querying closures
-   **🚀 High Performance**: Optimized for navigation app integration

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │  Navigation     │    │   OsmAnd        │
│   (React)       │◄──►│   Apps          │◄──►│   Plugin        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   FastAPI       │
                    │   Backend       │
                    └─────────────────┘
                             │
                    ┌─────────────────┐
                    │  PostgreSQL     │
                    │  + PostGIS      │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

-   Python 3.11+
-   Docker & Docker Compose
-   Git

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/Archit1706/temporary-road-closures
cd backend

# Copy environment configuration
cp .env.example .env

# Edit .env with your settings (optional for development)
```

### 2. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Check services are running
docker-compose ps

# View logs
docker-compose logs -f api
```

The API will be available at:

-   **API**: http://localhost:8000
-   **API Docs**: http://localhost:8000/api/v1/docs
-   **Database Admin**: http://localhost:8080 (Adminer)

### 3. Initialize Database

```bash
# Run database initialization
docker-compose exec api python scripts/init_db.py

# Or run migrations manually
docker-compose exec api alembic upgrade head
```

### 4. Test the API

```bash
# Health check
curl http://localhost:8000/health

# Get closures
curl http://localhost:8000/api/v1/closures

# API documentation
open http://localhost:8000/api/v1/docs
```

## 📋 Development Setup

### Local Development (without Docker)

```bash
# Install dependencies
pip install -r requirements.txt

# Setup PostgreSQL with PostGIS
# (Instructions vary by OS)

# Configure environment
export DATABASE_URL="postgresql://user:pass@localhost:5432/osm_closures_dev"

# Run migrations
alembic upgrade head

# Initialize sample data
python scripts/init_db.py

# Start development server
uvicorn app.main:app --reload
```

### Project Structure

```
app/
├── api/                # API endpoints
│   ├── closures.py     # Closure management
│   ├── users.py        # User management
│   ├── auth.py         # Authentication
│   └── deps.py         # Dependencies
├── core/               # Core functionality
│   ├── database.py     # DB configuration
│   ├── security.py     # Auth & security
│   └── exceptions.py   # Custom exceptions
├── models/             # SQLAlchemy models
│   ├── closure.py      # Closure model
│   ├── user.py         # User model
│   └── base.py         # Base model
├── schemas/            # Pydantic schemas
│   ├── closure.py      # Closure validation
│   └── user.py         # User validation
├── services/           # Business logic
│   ├── closure_service.py    # Closure operations
│   ├── openlr_service.py     # OpenLR integration
│   └── spatial_service.py    # Geospatial operations
├── utils/              # Utilities
├── config.py           # Configuration
└── main.py             # FastAPI app
```

## 🔧 API Usage

### Authentication

```bash
# Create user account
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "myuser",
    "email": "user@example.com",
    "password": "secure123"
  }'

# Login to get token
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "myuser",
    "password": "secure123"
  }'

# Use token in requests
export TOKEN="your-jwt-token-here"
```

### Submit a Closure

```bash
curl -X POST "http://localhost:8000/api/v1/closures/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "geometry": {
      "type": "LineString",
      "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
    },
    "description": "Water main repair blocking eastbound traffic",
    "closure_type": "construction",
    "start_time": "2025-06-01T08:00:00Z",
    "end_time": "2025-06-01T18:00:00Z",
    "source": "City of Chicago",
    "confidence_level": 9
  }'
```

### Query Closures

```bash
# Get active closures in Chicago area
curl "http://localhost:8000/api/v1/closures/?bbox=-87.7,41.8,-87.6,41.9&active_only=true"

# Get closures by type
curl "http://localhost:8000/api/v1/closures/?closure_type=construction"

# Get specific closure
curl "http://localhost:8000/api/v1/closures/123"
```

## 🗄️ Database Schema

### Key Tables

**closures**

-   `id` - Primary key
-   `geometry` - PostGIS LineString (WGS84)
-   `start_time`, `end_time` - Temporal bounds
-   `description` - Human-readable description
-   `closure_type` - Enum: construction, accident, event, etc.
-   `status` - Enum: active, expired, cancelled, planned
-   `openlr_code` - OpenLR location reference
-   `submitter_id` - Foreign key to users

**users**

-   `id` - Primary key
-   `username`, `email` - Authentication
-   `is_moderator` - Role permissions
-   `api_key` - API access key

### Spatial Indexes

The database includes optimized spatial indexes for:

-   Bounding box queries (`ST_Intersects`)
-   Distance queries (`ST_DWithin`)
-   Time-based filtering

## 📍 OpenLR Integration

OpenLR (Open Location Referencing) provides map-agnostic location encoding:

```python
# Automatic encoding on closure creation
closure = {
    "geometry": {...},
    # ... other fields
}
# System generates: "openlr_code": "CwRbWyNG/ztP"

# Navigation apps can decode this to their own map
decoded_location = openlr_decoder.decode("CwRbWyNG/ztP")
```

This enables cross-platform compatibility with any OpenLR-capable navigation system.

## 🧪 Testing

```bash
# Run tests
docker-compose exec api pytest

# Run with coverage
docker-compose exec api pytest --cov=app

# Run specific test file
docker-compose exec api pytest tests/test_closures.py
```

## 📊 Monitoring & Analytics

### Health Checks

```bash
# Basic health
curl http://localhost:8000/health

# Detailed system info
curl http://localhost:8000/health/detailed
```

### Statistics

```bash
# Closure statistics
curl http://localhost:8000/api/v1/closures/statistics/summary
```

## 🔒 Security Features

-   **JWT Authentication**: Secure token-based auth
-   **Role-based Access**: User/moderator permissions
-   **API Rate Limiting**: Prevent abuse
-   **Input Validation**: Pydantic schema validation
-   **SQL Injection Protection**: SQLAlchemy ORM
-   **CORS Configuration**: Secure cross-origin requests

## 🚀 Deployment

### Production Environment

```bash
# Set production environment
export ENVIRONMENT=production

# Update configuration
cp .env.example .env.production
# Edit .env.production with production settings

# Deploy with production settings
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Environment Variables

Key production settings:

-   `DATABASE_URL` - Production database
-   `SECRET_KEY` - Strong secret for JWT
-   `ALLOWED_ORIGINS` - Frontend domains
-   `RATE_LIMIT_REQUESTS` - API rate limits

## 📈 Performance Optimization

### Database Optimizations

-   Spatial indexes on geometry columns
-   Composite indexes on frequently queried fields
-   Connection pooling for concurrent requests
-   Query optimization for bounding box operations

### API Optimizations

-   Pagination for large result sets
-   Efficient geometry serialization
-   Caching for static data
-   Async request handling

## 🤝 Contributing

This project is part of Google Summer of Code 2025. Development follows:

1. **Week 1-2**: Project setup and database design ✅
2. **Week 3-5**: Core API implementation
3. **Week 6-7**: OpenLR integration
4. **Week 8**: Midterm evaluation
5. **Week 9-10**: Web UI development
6. **Week 11-12**: OsmAnd integration
7. **Week 13-15**: Testing and documentation

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/closure-statistics

# Make changes and test
docker-compose exec api pytest

# Create migration if needed
docker-compose exec api python scripts/create_migration.py "Add statistics table"

# Commit and push
git add .
git commit -m "Add closure statistics endpoint"
git push origin feature/closure-statistics
```
