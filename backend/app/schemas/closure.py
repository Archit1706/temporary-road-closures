"""
Pydantic schemas for closure data validation and serialization.
"""

from pydantic import BaseModel, Field, validator, root_validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

from app.models.closure import ClosureType, ClosureStatus


class GeoJSONGeometry(BaseModel):
    """GeoJSON geometry schema."""

    type: str = Field(..., description="Geometry type")
    coordinates: List[List[float]] = Field(..., description="Coordinate array")

    @validator("type")
    def validate_geometry_type(cls, v):
        """Validate geometry type."""
        allowed_types = ["LineString", "Point", "Polygon"]
        if v not in allowed_types:
            raise ValueError(f"Geometry type must be one of {allowed_types}")
        return v

    @validator("coordinates")
    def validate_coordinates(cls, v, values):
        """Validate coordinates based on geometry type."""
        geometry_type = values.get("type")

        if geometry_type == "LineString":
            if len(v) < 2:
                raise ValueError("LineString must have at least 2 coordinates")
            for coord in v:
                if len(coord) != 2:
                    raise ValueError(
                        "Each coordinate must have exactly 2 values [lon, lat]"
                    )
                # Validate longitude and latitude ranges
                lon, lat = coord
                if not (-180 <= lon <= 180):
                    raise ValueError(f"Longitude {lon} is out of range [-180, 180]")
                if not (-90 <= lat <= 90):
                    raise ValueError(f"Latitude {lat} is out of range [-90, 90]")

        return v


class ClosureBase(BaseModel):
    """Base closure schema with common fields."""

    description: str = Field(
        ..., min_length=10, max_length=1000, description="Closure description"
    )
    closure_type: ClosureType = Field(..., description="Type of closure")
    start_time: datetime = Field(..., description="Closure start time")
    end_time: Optional[datetime] = Field(None, description="Closure end time")
    source: Optional[str] = Field(
        None, max_length=100, description="Source of closure information"
    )
    confidence_level: Optional[int] = Field(
        None, ge=1, le=10, description="Confidence level (1-10)"
    )
    osm_way_ids: Optional[str] = Field(None, description="Comma-separated OSM way IDs")

    @validator("end_time")
    def validate_end_time(cls, v, values):
        """Validate that end_time is after start_time."""
        if v is not None and "start_time" in values:
            if v <= values["start_time"]:
                raise ValueError("end_time must be after start_time")
        return v

    @validator("description")
    def validate_description(cls, v):
        """Validate description content."""
        if not v.strip():
            raise ValueError("Description cannot be empty or only whitespace")
        return v.strip()


class ClosureCreate(ClosureBase):
    """Schema for creating a new closure."""

    geometry: GeoJSONGeometry = Field(..., description="Closure geometry as GeoJSON")

    class Config:
        schema_extra = {
            "example": {
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]],
                },
                "description": "Water main repair blocking eastbound traffic",
                "closure_type": "construction",
                "start_time": "2025-06-01T08:00:00Z",
                "end_time": "2025-06-01T18:00:00Z",
                "source": "City of Chicago",
                "confidence_level": 9,
                "osm_way_ids": "123456,789012",
            }
        }


class ClosureUpdate(BaseModel):
    """Schema for updating an existing closure."""

    geometry: Optional[GeoJSONGeometry] = Field(None, description="Updated geometry")
    description: Optional[str] = Field(
        None, min_length=10, max_length=1000, description="Updated description"
    )
    closure_type: Optional[ClosureType] = Field(
        None, description="Updated closure type"
    )
    start_time: Optional[datetime] = Field(None, description="Updated start time")
    end_time: Optional[datetime] = Field(None, description="Updated end time")
    status: Optional[ClosureStatus] = Field(None, description="Updated status")
    source: Optional[str] = Field(None, max_length=100, description="Updated source")
    confidence_level: Optional[int] = Field(
        None, ge=1, le=10, description="Updated confidence level"
    )
    osm_way_ids: Optional[str] = Field(None, description="Updated OSM way IDs")

    @root_validator
    def validate_time_consistency(cls, values):
        """Validate time consistency when both times are provided."""
        start_time = values.get("start_time")
        end_time = values.get("end_time")

        if start_time is not None and end_time is not None:
            if end_time <= start_time:
                raise ValueError("end_time must be after start_time")

        return values


class ClosureResponse(ClosureBase):
    """Schema for closure responses."""

    id: int = Field(..., description="Closure ID")
    geometry: Dict[str, Any] = Field(..., description="Closure geometry as GeoJSON")
    status: ClosureStatus = Field(..., description="Current closure status")
    openlr_code: Optional[str] = Field(None, description="OpenLR location reference")
    submitter_id: int = Field(..., description="ID of user who submitted this closure")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    is_active: bool = Field(..., description="Whether closure is currently active")
    duration_hours: Optional[float] = Field(
        None, description="Closure duration in hours"
    )

    class Config:
        from_attributes = True
        schema_extra = {
            "example": {
                "id": 123,
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]],
                },
                "description": "Water main repair blocking eastbound traffic",
                "closure_type": "construction",
                "start_time": "2025-06-01T08:00:00Z",
                "end_time": "2025-06-01T18:00:00Z",
                "status": "active",
                "openlr_code": "CwRbWyNG/ztP",
                "submitter_id": 456,
                "created_at": "2025-05-29T14:30:00Z",
                "updated_at": "2025-05-29T14:30:00Z",
                "is_active": True,
                "duration_hours": 10.0,
                "source": "City of Chicago",
                "confidence_level": 9,
            }
        }


class ClosureListResponse(BaseModel):
    """Schema for paginated closure list responses."""

    items: List[ClosureResponse] = Field(..., description="List of closures")
    total: int = Field(..., description="Total number of closures")
    page: int = Field(..., description="Current page number")
    size: int = Field(..., description="Page size")
    pages: int = Field(..., description="Total number of pages")

    class Config:
        schema_extra = {
            "example": {
                "items": [
                    # ... ClosureResponse examples
                ],
                "total": 150,
                "page": 1,
                "size": 50,
                "pages": 3,
            }
        }


class ClosureQueryParams(BaseModel):
    """Schema for closure query parameters."""

    bbox: Optional[str] = Field(
        None,
        description="Bounding box as 'min_lon,min_lat,max_lon,max_lat'",
        regex=r"^-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*,-?\d+\.?\d*$",
    )
    active_only: bool = Field(True, description="Return only active closures")
    closure_type: Optional[ClosureType] = Field(
        None, description="Filter by closure type"
    )
    start_time: Optional[datetime] = Field(
        None, description="Filter closures starting after this time"
    )
    end_time: Optional[datetime] = Field(
        None, description="Filter closures ending before this time"
    )
    submitter_id: Optional[int] = Field(None, description="Filter by submitter user ID")
    page: int = Field(1, ge=1, description="Page number")
    size: int = Field(50, ge=1, le=1000, description="Page size")

    @validator("bbox")
    def validate_bbox(cls, v):
        """Validate bounding box format and values."""
        if v is None:
            return v

        try:
            coords = [float(x) for x in v.split(",")]
            if len(coords) != 4:
                raise ValueError("Bounding box must have exactly 4 coordinates")

            min_lon, min_lat, max_lon, max_lat = coords

            # Validate coordinate ranges
            if not (-180 <= min_lon <= 180) or not (-180 <= max_lon <= 180):
                raise ValueError("Longitude values must be between -180 and 180")
            if not (-90 <= min_lat <= 90) or not (-90 <= max_lat <= 90):
                raise ValueError("Latitude values must be between -90 and 90")

            # Validate that min < max
            if min_lon >= max_lon:
                raise ValueError("min_lon must be less than max_lon")
            if min_lat >= max_lat:
                raise ValueError("min_lat must be less than max_lat")

            # Validate reasonable area size (prevent abuse)
            area = (max_lon - min_lon) * (max_lat - min_lat)
            if area > 100:  # Arbitrary large area limit
                raise ValueError("Bounding box area is too large")

            return v

        except (ValueError, IndexError) as e:
            raise ValueError(f"Invalid bounding box format: {e}")


class ClosureStatsResponse(BaseModel):
    """Schema for closure statistics."""

    total_closures: int = Field(..., description="Total number of closures")
    active_closures: int = Field(..., description="Number of active closures")
    by_type: Dict[str, int] = Field(..., description="Closures by type")
    by_status: Dict[str, int] = Field(..., description="Closures by status")
    avg_duration_hours: Optional[float] = Field(
        None, description="Average closure duration in hours"
    )

    class Config:
        schema_extra = {
            "example": {
                "total_closures": 1250,
                "active_closures": 45,
                "by_type": {
                    "construction": 800,
                    "accident": 200,
                    "event": 150,
                    "maintenance": 100,
                },
                "by_status": {"active": 45, "expired": 1100, "cancelled": 105},
                "avg_duration_hours": 12.5,
            }
        }
