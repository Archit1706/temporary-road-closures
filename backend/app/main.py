"""
FastAPI application for OSM Road Closures API with proper Swagger authentication.
"""

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from fastapi.security import HTTPBearer
import time
import logging
from contextlib import asynccontextmanager

from app.config import settings
from app.core.database import init_database, close_database
from app.core.exceptions import APIException, ValidationException
from app.api import closures, users, auth
from app.api import openlr  # Import OpenLR endpoints


# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL), format=settings.LOG_FORMAT
)
logger = logging.getLogger(__name__)

# Security scheme for Swagger UI
security = HTTPBearer()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager for startup and shutdown events.
    """
    # Startup
    logger.info("Starting OSM Road Closures API...")
    try:
        await init_database()
        logger.info("Database initialized successfully")

        # Log OpenLR status
        if settings.OPENLR_ENABLED:
            logger.info(f"OpenLR service enabled - Format: {settings.OPENLR_FORMAT}")
        else:
            logger.info("OpenLR service disabled")

    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down OSM Road Closures API...")
    try:
        await close_database()
        logger.info("Database connections closed")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)


# Add middleware
if settings.ALLOWED_HOSTS != ["*"]:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add response time header to all requests."""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Exception handlers
@app.exception_handler(APIException)
async def api_exception_handler(request: Request, exc: APIException):
    """Handle custom API exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.error_code,
            "message": exc.message,
            "details": exc.details,
        },
    )


@app.exception_handler(ValidationException)
async def validation_exception_handler(request: Request, exc: ValidationException):
    """Handle validation exceptions."""
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "validation_error",
            "message": "Validation failed",
            "details": exc.errors,
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle standard HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "http_error",
            "message": exc.detail,
            "status_code": exc.status_code,
        },
    )


@app.exception_handler(500)
async def internal_server_error_handler(request: Request, exc: Exception):
    """Handle internal server errors."""
    logger.error(f"Internal server error: {exc}", exc_info=True)

    if settings.DEBUG:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "internal_server_error",
                "message": str(exc),
                "type": exc.__class__.__name__,
            },
        )
    else:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "internal_server_error",
                "message": "An internal server error occurred",
            },
        )


# Health check endpoints
@app.get("/health")
async def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Service health status
    """
    from app.core.database import db_manager

    db_healthy = db_manager.health_check()

    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "timestamp": time.time(),
        "version": settings.VERSION,
        "database": "connected" if db_healthy else "disconnected",
        "openlr": {
            "enabled": settings.OPENLR_ENABLED,
            "format": settings.OPENLR_FORMAT if settings.OPENLR_ENABLED else None,
        },
    }


@app.get("/health/detailed")
async def detailed_health_check():
    """
    Detailed health check with system information.

    Returns:
        dict: Detailed system health information
    """
    from app.core.database import db_manager
    import platform

    db_info = db_manager.get_database_info()
    db_healthy = "error" not in db_info

    try:
        import psutil

        system_info = {
            "platform": platform.platform(),
            "python_version": platform.python_version(),
            "cpu_count": psutil.cpu_count(),
            "memory_total": psutil.virtual_memory().total,
            "memory_available": psutil.virtual_memory().available,
            "disk_usage": psutil.disk_usage("/").percent,
        }
    except ImportError:
        system_info = {
            "platform": platform.platform(),
            "python_version": platform.python_version(),
            "note": "psutil not available for detailed system metrics",
        }

    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "timestamp": time.time(),
        "version": settings.VERSION,
        "environment": "development" if settings.DEBUG else "production",
        "database": db_info,
        "system": system_info,
        "openlr": {
            "enabled": settings.OPENLR_ENABLED,
            "format": settings.OPENLR_FORMAT if settings.OPENLR_ENABLED else None,
            "settings": settings.openlr_settings if settings.OPENLR_ENABLED else {},
        },
    }


@app.get("/")
async def root():
    """
    Root endpoint with API information.

    Returns:
        dict: API information
    """
    return {
        "message": "OSM Road Closures API",
        "version": settings.VERSION,
        "docs_url": f"{settings.API_V1_STR}/docs",
        "openapi_url": f"{settings.API_V1_STR}/openapi.json",
        "features": {
            "openlr_enabled": settings.OPENLR_ENABLED,
            "oauth_enabled": settings.OAUTH_ENABLED,
        },
        "endpoints": {
            "closures": f"{settings.API_V1_STR}/closures",
            "users": f"{settings.API_V1_STR}/users",
            "auth": f"{settings.API_V1_STR}/auth",
        },
        "demo_instructions": {
            "step_1": "Register a user at /auth/register",
            "step_2": "Login at /auth/login to get access token",
            "step_3": "Click 'Authorize' button in docs and enter: Bearer <your_token>",
            "step_4": "Use authenticated endpoints",
        },
    }


# Include routers
app.include_router(
    closures.router, prefix=f"{settings.API_V1_STR}/closures", tags=["closures"]
)

app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])

app.include_router(
    auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"]
)

# Add OpenLR router if exists
try:
    from app.api import openlr

    app.include_router(
        openlr.router, prefix=f"{settings.API_V1_STR}/openlr", tags=["openlr"]
    )
except ImportError:
    logger.warning("OpenLR router not found, skipping...")


# Custom OpenAPI schema with proper authentication
def custom_openapi():
    """
    Custom OpenAPI schema with proper OAuth2PasswordBearer authentication.
    """
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=f"""
        {settings.DESCRIPTION}
        
        ## 🚀 Getting Started
        
        1. **Register**: Create a user account using `/auth/register`
        2. **Login**: Click the 🔒 **Authorize** button below and use OAuth2 login
        3. **Explore**: Use any authenticated endpoint!
        
        ## 🔑 Authentication
        
        This API uses **OAuth2 Password Bearer** authentication with JWT tokens.
        
        **Quick Demo Flow:**
        1. Use `/auth/register` to create an account (if needed)
        2. Click the **Authorize** button below
        3. Enter your username and password in the OAuth2 form
        4. Now you can test all authenticated endpoints!
        
        ## 🗺️ Features
        
        - **🗄️ Geospatial Support**: Store and query road closures with PostGIS
        - **📍 OpenLR Integration**: Location referencing compatible with navigation systems  
        - **🔐 Secure Authentication**: OAuth2 + JWT tokens with user management
        - **📊 Rich Querying**: Spatial, temporal, and type-based filtering
        - **🚀 High Performance**: Optimized for real-time navigation applications
        
        ## 📋 Example Usage
        
        **Create a Closure:**
        ```json
        {{
          "geometry": {{
            "type": "LineString", 
            "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
          }},
          "description": "Water main repair blocking eastbound traffic",
          "closure_type": "construction",
          "start_time": "2025-07-03T08:00:00Z",
          "end_time": "2025-07-03T18:00:00Z"
        }}
        ```
        
        ## 🔗 Quick Links
        
        - **Health Check**: [/health](/health)
        - **Database Admin**: http://localhost:8080
        - **GitHub**: https://github.com/Archit1706/temporary-road-closures
        
        ---
        
        **💡 Tip**: After authenticating with OAuth2, try creating a closure and then querying it with different filters!
        """,
        routes=app.routes,
    )

    # Enhanced contact and license info
    openapi_schema["info"]["contact"] = {
        "name": "OSM Road Closures API Support",
        "url": "https://github.com/Archit1706/temporary-road-closures",
        "email": "architrathod77@gmail.com",
    }

    openapi_schema["info"]["license"] = {
        "name": "GNU Affero General Public License v3.0",
        "url": "https://www.gnu.org/licenses/agpl-3.0.en.html",
    }

    # Add server information
    openapi_schema["servers"] = [
        {"url": "http://localhost:8000", "description": "Development server"},
        {
            "url": "https://api.osmclosures.org",
            "description": "Production server (future)",
        },
    ]

    # CORRECTED: Proper OAuth2PasswordBearer security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "oauth2",
            "flows": {
                "password": {
                    "tokenUrl": f"{settings.API_V1_STR}/auth/login",
                    "scopes": {},
                }
            },
            "description": """
            **OAuth2 Password Bearer Authentication**
            
            Enter your username and password to get authenticated.
            
            Test credentials:
            - Username: chicago_mapper
            - Password: SecurePass123
            """,
        },
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": """
            **HTTP Bearer Token Authentication** (Alternative)
            
            For direct API calls, include:
            Header: Authorization: Bearer <your_access_token>
            """,
        },
        "ApiKeyAuth": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key",
            "description": """
            **API Key Authentication** (Alternative to JWT)
            
            Get your API key from /auth/me after login, then include:
            Header: X-API-Key: osm_closures_<your_key>
            """,
        },
    }

    # CORRECTED: Include OAuth2PasswordBearer in global security
    openapi_schema["security"] = [
        {"OAuth2PasswordBearer": []},
        {"BearerAuth": []},
        {"ApiKeyAuth": []},
    ]

    # Add example schemas
    openapi_schema["components"]["examples"] = {
        "UserRegistration": {
            "summary": "User Registration Example",
            "value": {
                "username": "chicago_mapper",
                "email": "mapper@chicago.gov",
                "password": "SecurePass123",
                "full_name": "Chicago City Mapper",
            },
        },
        "UserLogin": {
            "summary": "User Login Example",
            "value": {"username": "chicago_mapper", "password": "SecurePass123"},
        },
        "ClosureExample": {
            "summary": "Construction Closure Example",
            "value": {
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]],
                },
                "description": "Water main repair blocking eastbound traffic on Madison Street",
                "closure_type": "construction",
                "start_time": "2025-07-03T08:00:00Z",
                "end_time": "2025-07-03T18:00:00Z",
                "source": "City of Chicago",
                "confidence_level": 9,
            },
        },
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
