"""
Dependency injection functions for API endpoints.
"""

from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional, Generator
import jwt
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.security import verify_token, verify_api_key
from app.core.exceptions import AuthenticationException, AuthorizationException
from app.models.user import User
from app.config import settings


# Security schemes
bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    db: Session = Depends(get_db),
    credentials: Optional[HTTPAuthorizationCredentials] = Security(bearer_scheme),
) -> Optional[User]:
    """
    Get current authenticated user from JWT token.

    Args:
        db: Database session
        credentials: Bearer token credentials

    Returns:
        User: Current authenticated user or None

    Raises:
        AuthenticationException: If token is invalid
    """
    if not credentials:
        return None

    try:
        payload = verify_token(credentials.credentials)
        user_id = payload.get("sub")

        if user_id is None:
            raise AuthenticationException("Invalid token: missing user ID")

        user = User.get_by_id(db, int(user_id))
        if user is None:
            raise AuthenticationException("User not found")

        if not user.is_active:
            raise AuthenticationException("User account is disabled")

        return user

    except jwt.ExpiredSignatureError:
        raise AuthenticationException("Token has expired")
    except jwt.InvalidTokenError:
        raise AuthenticationException("Invalid token")
    except ValueError:
        raise AuthenticationException("Invalid user ID in token")


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current active user (authentication required).

    Args:
        current_user: Current user from token

    Returns:
        User: Current authenticated user

    Raises:
        AuthenticationException: If no user is authenticated
    """
    if current_user is None:
        raise AuthenticationException("Authentication required")

    return current_user


async def get_current_user_optional(
    current_user: Optional[User] = Depends(get_current_user),
) -> Optional[User]:
    """
    Get current user optionally (authentication not required).

    Args:
        current_user: Current user from token (optional)

    Returns:
        User or None: Current user if authenticated, None otherwise
    """
    return current_user


async def get_current_moderator(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    Get current user with moderator privileges.

    Args:
        current_user: Current authenticated user

    Returns:
        User: Current user with moderator privileges

    Raises:
        AuthorizationException: If user is not a moderator
    """
    if not current_user.is_moderator:
        raise AuthorizationException("Moderator privileges required")

    return current_user


async def get_user_from_api_key(
    api_key: str, db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get user from API key.

    Args:
        api_key: API key string
        db: Database session

    Returns:
        User or None: User associated with API key
    """
    if not api_key:
        return None

    user = User.get_by_api_key(db, api_key)
    if user and user.is_active:
        return user

    return None


def require_permission(permission: str):
    """
    Dependency factory for requiring specific permissions.

    Args:
        permission: Permission name to require

    Returns:
        Dependency function that checks permission
    """

    async def permission_checker(
        current_user: User = Depends(get_current_active_user),
    ) -> User:
        if not current_user.has_permission(permission):
            raise AuthorizationException(
                f"Permission '{permission}' required",
                details={"required_permission": permission},
            )
        return current_user

    return permission_checker


def get_pagination_params(
    page: int = 1, size: int = settings.DEFAULT_PAGE_SIZE
) -> dict:
    """
    Get pagination parameters with validation.

    Args:
        page: Page number (1-based)
        size: Page size

    Returns:
        dict: Pagination parameters

    Raises:
        HTTPException: If parameters are invalid
    """
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Page number must be >= 1"
        )

    if size < 1 or size > settings.MAX_PAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Page size must be between 1 and {settings.MAX_PAGE_SIZE}",
        )

    skip = (page - 1) * size

    return {"skip": skip, "limit": size, "page": page, "size": size}


def validate_bbox(bbox: str) -> tuple[float, float, float, float]:
    """
    Validate and parse bounding box string.

    Args:
        bbox: Bounding box string "min_lon,min_lat,max_lon,max_lat"

    Returns:
        tuple: Parsed coordinates (min_lon, min_lat, max_lon, max_lat)

    Raises:
        HTTPException: If bbox format is invalid
    """
    try:
        coords = [float(x.strip()) for x in bbox.split(",")]
        if len(coords) != 4:
            raise ValueError("Must have exactly 4 coordinates")

        min_lon, min_lat, max_lon, max_lat = coords

        # Validate ranges
        if not (-180 <= min_lon <= 180) or not (-180 <= max_lon <= 180):
            raise ValueError("Longitude must be between -180 and 180")
        if not (-90 <= min_lat <= 90) or not (-90 <= max_lat <= 90):
            raise ValueError("Latitude must be between -90 and 90")

        # Validate order
        if min_lon >= max_lon:
            raise ValueError("min_lon must be less than max_lon")
        if min_lat >= max_lat:
            raise ValueError("min_lat must be less than max_lat")

        # Validate area (prevent abuse)
        area = (max_lon - min_lon) * (max_lat - min_lat)
        if area > settings.MAX_BBOX_AREA:
            raise ValueError(
                f"Bounding box area too large (max: {settings.MAX_BBOX_AREA} sq degrees)"
            )

        return min_lon, min_lat, max_lon, max_lat

    except (ValueError, IndexError) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid bounding box format: {e}",
        )


async def rate_limit_check(
    request, current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Check rate limits for API requests.

    Args:
        request: FastAPI request object
        current_user: Current user (optional)

    Raises:
        HTTPException: If rate limit exceeded
    """
    if not settings.RATE_LIMIT_ENABLED:
        return

    # Implementation would typically use Redis or similar
    # For now, this is a placeholder
    # In production, you'd implement actual rate limiting logic here
    pass


class CommonQueryParams:
    """
    Common query parameters for list endpoints.
    """

    def __init__(
        self,
        page: int = 1,
        size: int = settings.DEFAULT_PAGE_SIZE,
        sort_by: Optional[str] = None,
        sort_order: str = "desc",
    ):
        self.pagination = get_pagination_params(page, size)
        self.sort_by = sort_by

        if sort_order not in ["asc", "desc"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="sort_order must be 'asc' or 'desc'",
            )
        self.sort_order = sort_order


def get_db_with_error_handling() -> Generator[Session, None, None]:
    """
    Get database session with enhanced error handling.

    Yields:
        Session: Database session

    Raises:
        HTTPException: If database connection fails
    """
    try:
        db = next(get_db())
        yield db
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database connection failed",
        )


# Convenience dependency combinations
RequireAuth = Depends(get_current_active_user)
RequireModerator = Depends(get_current_moderator)
OptionalAuth = Depends(get_current_user_optional)
PaginationParams = Depends(get_pagination_params)
CommonParams = Depends(CommonQueryParams)
