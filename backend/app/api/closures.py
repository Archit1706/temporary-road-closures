"""
API endpoints for closure management.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import math

from app.core.database import get_db
from app.api.deps import (
    get_current_active_user,
    get_current_user_optional,
    get_current_moderator,
    get_pagination_params,
)
from app.models.user import User
from app.models.closure import ClosureType, ClosureStatus
from app.schemas.closure import (
    ClosureCreate,
    ClosureUpdate,
    ClosureResponse,
    ClosureListResponse,
    ClosureQueryParams,
    ClosureStatsResponse,
)
from app.services.closure_service import ClosureService
from app.core.exceptions import NotFoundException, ValidationException


router = APIRouter()


@router.post(
    "/",
    response_model=ClosureResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new closure",
    description="Submit a new temporary road closure with geometry and metadata.",
)
async def create_closure(
    closure_data: ClosureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new closure.

    - **geometry**: GeoJSON LineString representing the closed road segment
    - **description**: Human-readable description of the closure
    - **closure_type**: Type of closure (construction, accident, event, etc.)
    - **start_time**: When the closure begins
    - **end_time**: When the closure ends (optional for indefinite closures)
    - **source**: Source of the closure information (optional)
    - **confidence_level**: Confidence in the information (1-10, optional)
    - **osm_way_ids**: Comma-separated OSM way IDs (optional)

    Returns the created closure with generated ID and OpenLR code.
    """
    service = ClosureService(db)
    closure = service.create_closure(closure_data, current_user.id)

    # Get closure with geometry for response
    closure_dict = service.get_closure_with_geometry(closure.id)

    return ClosureResponse(**closure_dict)


@router.get(
    "/",
    response_model=ClosureListResponse,
    summary="Query closures",
    description="Query closures with spatial, temporal, and other filters.",
)
async def query_closures(
    bbox: Optional[str] = Query(
        None,
        description="Bounding box filter: 'min_lon,min_lat,max_lon,max_lat'",
        example="-87.7,41.8,-87.6,41.9",
    ),
    active_only: bool = Query(
        True, description="Return only currently active closures"
    ),
    closure_type: Optional[ClosureType] = Query(
        None, description="Filter by closure type"
    ),
    start_time: Optional[str] = Query(
        None, description="Filter closures starting after this time (ISO 8601)"
    ),
    end_time: Optional[str] = Query(
        None, description="Filter closures ending before this time (ISO 8601)"
    ),
    submitter_id: Optional[int] = Query(
        None, description="Filter by submitter user ID"
    ),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(50, ge=1, le=1000, description="Page size"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Query closures with various filters.

    **Spatial Filtering:**
    - Use `bbox` parameter to get closures within a geographic area
    - Format: "min_longitude,min_latitude,max_longitude,max_latitude"

    **Temporal Filtering:**
    - `active_only=true` (default): Only return currently active closures
    - `start_time`: Filter closures that start after the specified time
    - `end_time`: Filter closures that end before the specified time

    **Other Filters:**
    - `closure_type`: Filter by type (construction, accident, event, etc.)
    - `submitter_id`: Get closures submitted by a specific user

    **Pagination:**
    - Use `page` and `size` parameters to paginate results
    - Maximum page size is 1000

    Returns paginated list of closures with metadata.
    """
    # Parse datetime strings if provided
    start_datetime = None
    end_datetime = None

    if start_time:
        try:
            from datetime import datetime

            start_datetime = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid start_time format. Use ISO 8601 format.",
            )

    if end_time:
        try:
            from datetime import datetime

            end_datetime = datetime.fromisoformat(end_time.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid end_time format. Use ISO 8601 format.",
            )

    # Create query parameters
    query_params = ClosureQueryParams(
        bbox=bbox,
        active_only=active_only,
        closure_type=closure_type,
        start_time=start_datetime,
        end_time=end_datetime,
        submitter_id=submitter_id,
        page=page,
        size=size,
    )

    service = ClosureService(db)
    closures, total = service.query_closures(query_params, current_user)

    # Convert closures to response format with geometry
    closure_dicts = service.get_closures_with_geometry(closures)
    closure_responses = [
        ClosureResponse(**closure_dict) for closure_dict in closure_dicts
    ]

    # Calculate pagination metadata
    pages = math.ceil(total / size) if total > 0 else 1

    return ClosureListResponse(
        items=closure_responses, total=total, page=page, size=size, pages=pages
    )


@router.get(
    "/{closure_id}",
    response_model=ClosureResponse,
    summary="Get closure by ID",
    description="Get detailed information about a specific closure.",
)
async def get_closure(
    closure_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get a specific closure by ID.

    Returns detailed closure information including:
    - Full geometry as GeoJSON
    - Metadata and timestamps
    - OpenLR location reference code
    - Current status and activity state
    """
    service = ClosureService(db)

    try:
        closure_dict = service.get_closure_with_geometry(closure_id)
        return ClosureResponse(**closure_dict)
    except NotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Closure with ID {closure_id} not found",
        )


@router.put(
    "/{closure_id}",
    response_model=ClosureResponse,
    summary="Update closure",
    description="Update an existing closure. Only the submitter or moderators can edit.",
)
async def update_closure(
    closure_id: int,
    closure_data: ClosureUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Update an existing closure.

    **Permissions:**
    - Users can update their own closures
    - Moderators can update any closure

    **Updatable Fields:**
    - Geometry (will regenerate OpenLR code)
    - Description and metadata
    - Start/end times
    - Status (for moderators)
    - Closure type

    **Automatic Updates:**
    - `updated_at` timestamp is automatically set
    - OpenLR code is regenerated if geometry changes
    - Status may be automatically updated based on timing
    """
    service = ClosureService(db)

    try:
        closure = service.update_closure(closure_id, closure_data, current_user)
        closure_dict = service.get_closure_with_geometry(closure.id)
        return ClosureResponse(**closure_dict)
    except NotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Closure with ID {closure_id} not found",
        )
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.delete(
    "/{closure_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete closure",
    description="Delete a closure. Only the submitter or moderators can delete.",
)
async def delete_closure(
    closure_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Delete a closure.

    **Permissions:**
    - Users can delete their own closures
    - Moderators can delete any closure

    **Note:** This is a hard delete operation. The closure and all its data
    will be permanently removed from the database.
    """
    service = ClosureService(db)

    try:
        service.delete_closure(closure_id, current_user)
    except NotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Closure with ID {closure_id} not found",
        )
    except ValidationException as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.get(
    "/statistics/summary",
    response_model=ClosureStatsResponse,
    summary="Get closure statistics",
    description="Get statistical summary of closures in the system.",
)
async def get_closure_statistics(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get statistical summary of closures.

    Returns:
    - Total number of closures
    - Number of currently active closures
    - Breakdown by closure type
    - Breakdown by status
    - Average closure duration

    This endpoint can be used for dashboards and monitoring.
    """
    service = ClosureService(db)
    stats = service.get_statistics()

    return ClosureStatsResponse(**stats)


@router.get(
    "/user/{user_id}",
    response_model=ClosureListResponse,
    summary="Get user's closures",
    description="Get closures submitted by a specific user.",
)
async def get_user_closures(
    user_id: int,
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(50, ge=1, le=1000, description="Page size"),
    active_only: bool = Query(False, description="Return only active closures"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get closures submitted by a specific user.

    **Privacy:**
    - Anyone can view closures by user ID
    - User information is not included in the response

    **Filtering:**
    - Use `active_only=true` to see only currently active closures
    - Results are ordered by creation date (newest first)
    """
    query_params = ClosureQueryParams(
        submitter_id=user_id, active_only=active_only, page=page, size=size
    )

    service = ClosureService(db)
    closures, total = service.query_closures(query_params, current_user)

    # Convert to response format
    closure_dicts = service.get_closures_with_geometry(closures)
    closure_responses = [
        ClosureResponse(**closure_dict) for closure_dict in closure_dicts
    ]

    pages = math.ceil(total / size) if total > 0 else 1

    return ClosureListResponse(
        items=closure_responses, total=total, page=page, size=size, pages=pages
    )


@router.post(
    "/{closure_id}/status",
    response_model=ClosureResponse,
    summary="Update closure status",
    description="Update the status of a closure (moderators only).",
)
async def update_closure_status(
    closure_id: int,
    new_status: ClosureStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_moderator),
):
    """
    Update closure status (moderators only).

    **Available Statuses:**
    - `active`: Closure is currently in effect
    - `expired`: Closure has ended naturally
    - `cancelled`: Closure was cancelled before completion
    - `planned`: Closure is scheduled for the future

    **Moderator Action:**
    This endpoint is restricted to moderators for status management.
    Regular users should use the general update endpoint.
    """
    service = ClosureService(db)

    try:
        # Create update object with just status
        update_data = ClosureUpdate(status=new_status)
        closure = service.update_closure(closure_id, update_data, current_user)

        closure_dict = service.get_closure_with_geometry(closure.id)
        return ClosureResponse(**closure_dict)
    except NotFoundException:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Closure with ID {closure_id} not found",
        )
