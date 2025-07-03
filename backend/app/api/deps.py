"""
Dependency injection functions for API endpoints with proper Swagger UI authentication.
"""

from fastapi import Depends, HTTPException, status, Security, Header
from fastapi.security import (
    OAuth2PasswordBearer,
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from sqlalchemy.orm import Session
from typing import Optional, Generator
import jwt
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.security import verify_token
from app.core.exceptions import AuthenticationException, AuthorizationException
from app.models.user import User
from app.config import settings


# OAuth2 scheme for Swagger UI - this is the key fix!
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    auto_error=False,  # Don't auto-error, let us handle it
)

# Alternative HTTPBearer scheme for API key auth
bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user_from_token(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Get current user from OAuth2 token (works with Swagger UI).

    Args:
        token: JWT token from OAuth2PasswordBearer
        db: Database session

    Returns:
        User or None: Authenticated user if token is valid
    """
    if not token:
        return None

    try:
        # Verify the JWT token
        payload = verify_token(token)
        user_id = payload.get("sub")

        if user_id is None:
            return None

        # Get user from database
        user = User.get_by_id(db, int(user_id))
        if user and user.is_active:
            return user

    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except (ValueError, TypeError):
        return None
    except Exception:
        return None

    return None


async def get_current_user_from_bearer(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(bearer_scheme),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Get current user from Bearer token (alternative method).

    Args:
        credentials: Bearer token credentials
        db: Database session

    Returns:
        User or None: Authenticated user if token is valid
    """
    if not credentials or not credentials.credentials:
        return None

    try:
        token = credentials.credentials
        payload = verify_token(token)
        user_id = payload.get("sub")

        if user_id is None:
            return None

        user = User.get_by_id(db, int(user_id))
        if user and user.is_active:
            return user

    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    except (ValueError, TypeError):
        return None
    except Exception:
        return None

    return None


async def get_current_user_from_api_key(
    api_key: Optional[str] = Header(None, alias="X-API-Key"),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Get current user from API key.

    Args:
        api_key: API key from header
        db: Database session

    Returns:
        User or None: Authenticated user if API key is valid
    """
    if not api_key:
        return None

    try:
        user = User.get_by_api_key(db, api_key)
        if user and user.is_active:
            return user
    except Exception:
        pass

    return None


async def get_current_user(
    # Try OAuth2 token first (for Swagger UI)
    user_from_oauth: Optional[User] = Depends(get_current_user_from_token),
    # Try Bearer token (for direct API calls)
    user_from_bearer: Optional[User] = Depends(get_current_user_from_bearer),
    # Try API key (alternative auth)
    user_from_api_key: Optional[User] = Depends(get_current_user_from_api_key),
) -> Optional[User]:
    """
    Get current authenticated user from any valid authentication method.

    This function tries multiple authentication methods in order:
    1. OAuth2PasswordBearer token (Swagger UI)
    2. HTTPBearer token (direct API calls)
    3. API key (alternative auth)

    Returns:
        User or None: Current authenticated user
    """
    # Return the first valid user found
    return user_from_oauth or user_from_bearer or user_from_api_key


async def get_current_active_user(
    current_user: Optional[User] = Depends(get_current_user),
) -> User:
    """
    Get current active user (authentication required).

    Args:
        current_user: Current user from authentication

    Returns:
        User: Current authenticated user

    Raises:
        HTTPException: If no user is authenticated
    """
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return current_user


async def get_current_user_optional(
    current_user: Optional[User] = Depends(get_current_user),
) -> Optional[User]:
    """
    Get current user optionally (authentication not required).

    Args:
        current_user: Current user from authentication (optional)

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
        HTTPException: If user is not a moderator
    """
    if not current_user.is_moderator:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Moderator privileges required",
        )

    return current_user


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


# Convenience dependency combinations
RequireAuth = Depends(get_current_active_user)
RequireModerator = Depends(get_current_moderator)
OptionalAuth = Depends(get_current_user_optional)
PaginationParams = Depends(get_pagination_params)


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


CommonParams = Depends(CommonQueryParams)
