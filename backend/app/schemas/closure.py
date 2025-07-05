"""
Pydantic schemas for closure data validation and serialization.
"""

from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

from app.models.closure import ClosureType, ClosureStatus


class GeoJSONGeometry(BaseModel):
    """GeoJSON geometry schema."""

    type: str = Field(..., description="Geometry type")
    coordinates: List[List[float]] = Field(..., description="Coordinate array")

    @field_validator("type")
    @classmethod
    def validate_geometry_type(cls, v):
        """Validate geometry type."""
        allowed_types = ["LineString", "Point", "Polygon"]
        if v not in allowed_types:
            raise ValueError(f"Geometry type must be one of {allowed_types}")
        return v

    @field_validator("coordinates")
    @classmethod
    def validate_coordinates(cls, v, info):
        """Validate coordinates based on geometry type."""
        # Get the geometry type from the validated data
        data = info.data if hasattr(info, "data") else {}
        geometry_type = data.get("type")

        if geometry_type == "LineString":
            if len(v) < 2:
                raise ValueError("LineString must have at least 2 coordinates")

            # Round coordinates to 5 decimal places and validate ranges
            rounded_coords = []
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

                # Round to 5 decimal places
                rounded_coords.append([round(lon, 5), round(lat, 5)])

            return rounded_coords

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

    @field_validator("end_time")
    @classmethod
    def validate_end_time(cls, v, info):
        """Validate that end_time is after start_time."""
        if v is not None and hasattr(info, "data") and "start_time" in info.data:
            if v <= info.data["start_time"]:
                raise ValueError("end_time must be after start_time")
        return v

    @field_validator("description")
    @classmethod
    def validate_description(cls, v):
        """Validate description content."""
        if not v.strip():
            raise ValueError("Description cannot be empty or only whitespace")
        return v.strip()


class ClosureCreate(ClosureBase):
    """Schema for creating a new closure."""

    geometry: GeoJSONGeometry = Field(..., description="Closure geometry as GeoJSON")

    model_config = {
        "json_schema_extra": {
            "example": {
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[-87.62980, 41.87810], [-87.62900, 41.87850]],
                },
                "description": "Water main repair blocking eastbound traffic",
                "closure_type": "construction",
                "start_time": "2025-06-01T08:00:00Z",
                "end_time": "2025-06-01T18:00:00Z",
                "source": "City of Chicago",
                "confidence_level": 9,
            }
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

    @model_validator(mode="after")
    def validate_time_consistency(self):
        """Validate time consistency when both times are provided."""
        if self.start_time is not None and self.end_time is not None:
            if self.end_time <= self.start_time:
                raise ValueError("end_time must be after start_time")
        return self


class ClosureResponse(ClosureBase):
    """Schema for closure responses."""

    id: int = Field(..., description="Closure ID")
    geometry: Dict[str, Any] = Field(..., description="Closure geometry as GeoJSON")
    status: ClosureStatus = Field(..., description="Current closure status")
    openlr_code: Optional[str] = Field(None, description="OpenLR location reference")
    submitter_id: int = Field(..., description="ID of user who submitted this closure")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    is_valid: bool = Field(..., description="Whether closure is currently valid")
    duration_hours: Optional[float] = Field(
        None, description="Closure duration in hours"
    )

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": 123,
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[-87.62980, 41.87810], [-87.62900, 41.87850]],
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
                "is_valid": True,
                "duration_hours": 10.0,
                "source": "City of Chicago",
                "confidence_level": 9,
            }
        },
    }


class ClosureListResponse(BaseModel):
    """Schema for paginated closure list responses."""

    items: List[ClosureResponse] = Field(..., description="List of closures")
    total: int = Field(..., description="Total number of closures")
    page: int = Field(..., description="Current page number")
    size: int = Field(..., description="Page size")
    pages: int = Field(..., description="Total number of pages")


class ClosureQueryParams(BaseModel):
    """Schema for closure query parameters."""

    bbox: Optional[str] = Field(
        None, description="Bounding box as 'min_lon,min_lat,max_lon,max_lat'"
    )
    valid_only: bool = Field(True, description="Return only valid closures")
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


class ClosureStatsResponse(BaseModel):
    """Schema for closure statistics."""

    total_closures: int = Field(..., description="Total number of closures")
    valid_closures: int = Field(..., description="Number of valid closures")
    by_type: Dict[str, int] = Field(..., description="Closures by type")
    by_status: Dict[str, int] = Field(..., description="Closures by status")
    avg_duration_hours: Optional[float] = Field(
        None, description="Average closure duration in hours"
    )
