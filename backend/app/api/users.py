"""
User management endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import math

from app.core.database import get_db
from app.api.deps import (
    get_current_active_user,
    get_current_moderator,
    get_current_user_optional,
)
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, UserStats, ApiKeyResponse
from app.services.user_service import UserService
from app.core.exceptions import (
    NotFoundException,
    ValidationException,
    AuthorizationException,
)


router = APIRouter()


@router.get(
    "/",
    response_model=List[UserResponse],
    summary="List users",
    description="Get list of users (moderators only).",
)
async def list_users(
    skip: int = Query(0, ge=0, description="Number of users to skip"),
    limit: int = Query(
        50, ge=1, le=1000, description="Maximum number of users to return"
    ),
    search: Optional[str] = Query(
        None, description="Search users by username or email"
    ),
    active_only: bool = Query(True, description="Return only active users"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_moderator),
):
    """
    Get list of users (moderators only).

    **Parameters:**
    - **skip**: Number of users to skip for pagination
    - **limit**: Maximum number of users to return (1-1000)
    - **search**: Search term for username or email filtering
    - **active_only**: Whether to return only active users

    **Permissions:**
    - Requires moderator privileges

    Returns paginated list of users with their basic information.
    """
    query = db.query(User)

    # Apply filters
    if active_only:
        query = query.filter(User.is_active == True)

    if search:
        search_term = f"%{search.lower()}%"
        query = query.filter(
            (User.username.ilike(search_term))
            | (User.email.ilike(search_term))
            | (User.full_name.ilike(search_term))
        )

    # Apply pagination
    users = query.offset(skip).limit(limit).all()

    return [UserResponse.from_orm(user) for user in users]


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get user by ID",
    description="Get user information by user ID.",
)
async def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get user information by ID.

    **Parameters:**
    - **user_id**: User ID to retrieve

    **Permissions:**
    - Public endpoint (no authentication required)
    - Returns basic user information only

    Returns user profile information. Some fields may be restricted
    based on privacy settings and authentication status.
    """
    user = User.get_by_id(db, user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return UserResponse.from_orm(user)


@router.get(
    "/{user_id}/stats",
    response_model=UserStats,
    summary="Get user statistics",
    description="Get user activity statistics.",
)
async def get_user_stats(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get user activity statistics.

    **Parameters:**
    - **user_id**: User ID to get statistics for

    **Permissions:**
    - Public endpoint (no authentication required)
    - Returns public activity statistics

    Returns user's contribution statistics including:
    - Total number of closures submitted
    - Number of currently active closures
    - Last submission timestamp
    """
    user = User.get_by_id(db, user_id)

    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    try:
        user_service = UserService(db)
        stats = user_service.get_user_stats(user_id)

        return UserStats(**stats)

    except NotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update current user",
    description="Update current user's profile information.",
)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """
    Update current user's profile information.

    **Updatable fields:**
    - **full_name**: User's full name
    - **email**: Email address (requires re-verification)

    **Authentication:**
    - Requires valid authentication token
    - Users can only update their own profile

    If email is changed, the user will need to verify the new email address
    before it becomes active.
    """
    try:
        user_service = UserService(db)
        updated_user = user_service.update_user(current_user.id, user_data)

        return UserResponse.from_orm(updated_user)

    except ValidationException as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user profile",
        )


@router.put(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update user",
    description="Update user information (moderators only).",
)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_moderator),
    db: Session = Depends(get_db),
):
    """
    Update user information (moderators only).

    **Parameters:**
    - **user_id**: User ID to update
    - **user_data**: Updated user information

    **Permissions:**
    - Requires moderator privileges

    **Updatable fields:**
    - **full_name**: User's full name
    - **email**: Email address

    Moderators can update any user's profile information.
    Email changes will require re-verification.
    """
    try:
        user_service = UserService(db)
        updated_user = user_service.update_user(user_id, user_data)

        return UserResponse.from_orm(updated_user)

    except NotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )
    except ValidationException as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )


@router.post(
    "/{user_id}/deactivate",
    summary="Deactivate user",
    description="Deactivate user account (moderators only).",
)
async def deactivate_user(
    user_id: int,
    current_user: User = Depends(get_current_moderator),
    db: Session = Depends(get_db),
):
    """
    Deactivate user account (moderators only).

    **Parameters:**
    - **user_id**: User ID to deactivate

    **Permissions:**
    - Requires moderator privileges
    - Cannot deactivate other moderators

    Deactivating a user will:
    - Prevent them from logging in
    - Hide their profile from public view
    - Keep their submitted closures visible
    """
    target_user = User.get_by_id(db, user_id)

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )

    # Prevent moderators from deactivating other moderators
    if target_user.is_moderator and target_user.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot deactivate another moderator",
        )

    try:
        user_service = UserService(db)
        success = user_service.deactivate_user(user_id)

        if success:
            return {"message": f"User {user_id} deactivated successfully"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to deactivate user",
            )

    except ValidationException as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e)
        )


@router.post(
    "/{user_id}/activate",
    summary="Activate user",
    description="Reactivate user account (moderators only).",
)
async def activate_user(
    user_id: int,
    current_user: User = Depends(get_current_moderator),
    db: Session = Depends(get_db),
):
    """
    Reactivate user account (moderators only).

    **Parameters:**
    - **user_id**: User ID to reactivate

    **Permissions:**
    - Requires moderator privileges

    Reactivating a user will restore their access to the platform.
    """
    target_user = User.get_by_id(db, user_id)

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )

    try:
        target_user.is_active = True
        db.commit()

        return {"message": f"User {user_id} activated successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to activate user",
        )


@router.post(
    "/{user_id}/promote",
    summary="Promote user to moderator",
    description="Grant moderator privileges to user (moderators only).",
)
async def promote_user(
    user_id: int,
    current_user: User = Depends(get_current_moderator),
    db: Session = Depends(get_db),
):
    """
    Promote user to moderator (moderators only).

    **Parameters:**
    - **user_id**: User ID to promote

    **Permissions:**
    - Requires moderator privileges

    Grants moderator privileges to the specified user, allowing them to:
    - Manage other users
    - Edit any closure
    - Access moderation endpoints
    """
    target_user = User.get_by_id(db, user_id)

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )

    if target_user.is_moderator:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is already a moderator",
        )

    try:
        target_user.is_moderator = True
        db.commit()

        return {"message": f"User {user_id} promoted to moderator"}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to promote user",
        )


@router.post(
    "/{user_id}/demote",
    summary="Remove moderator privileges",
    description="Remove moderator privileges from user (moderators only).",
)
async def demote_user(
    user_id: int,
    current_user: User = Depends(get_current_moderator),
    db: Session = Depends(get_db),
):
    """
    Remove moderator privileges from user (moderators only).

    **Parameters:**
    - **user_id**: User ID to demote

    **Permissions:**
    - Requires moderator privileges
    - Cannot demote yourself

    Removes moderator privileges from the specified user.
    """
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot demote yourself"
        )

    target_user = User.get_by_id(db, user_id)

    if not target_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found",
        )

    if not target_user.is_moderator:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a moderator"
        )

    try:
        target_user.is_moderator = False
        db.commit()

        return {"message": f"User {user_id} demoted from moderator"}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to demote user",
        )


@router.get(
    "/search",
    response_model=List[UserResponse],
    summary="Search users",
    description="Search users by username, email, or name.",
)
async def search_users(
    q: str = Query(..., min_length=3, description="Search query"),
    limit: int = Query(10, ge=1, le=50, description="Maximum number of results"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Search users by username, email, or name.

    **Parameters:**
    - **q**: Search query (minimum 3 characters)
    - **limit**: Maximum number of results (1-50)

    **Permissions:**
    - Public endpoint (no authentication required)
    - Returns basic user information only

    Searches across username, email, and full name fields.
    Only returns active users.
    """
    search_term = f"%{q.lower()}%"

    users = (
        db.query(User)
        .filter(
            User.is_active == True,
            (User.username.ilike(search_term))
            | (User.email.ilike(search_term))
            | (User.full_name.ilike(search_term)),
        )
        .limit(limit)
        .all()
    )

    return [UserResponse.from_orm(user) for user in users]


@router.get(
    "/me/api-key",
    response_model=ApiKeyResponse,
    summary="Get current API key",
    description="Get current user's API key.",
)
async def get_api_key(current_user: User = Depends(get_current_active_user)):
    """
    Get current user's API key.

    **Authentication:**
    - Requires valid authentication token

    Returns the user's current API key that can be used for programmatic
    access to the API. The API key should be included in the X-API-Key header.
    """
    return ApiKeyResponse(
        api_key=current_user.api_key, created_at=current_user.created_at
    )
