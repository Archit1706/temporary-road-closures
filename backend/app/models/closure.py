"""
Closure model for managing temporary road closures.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum, func
from sqlalchemy.orm import relationship, Session
from sqlalchemy.dialects.postgresql import ENUM
from geoalchemy2 import Geometry
from geoalchemy2.functions import (
    ST_AsGeoJSON,
    ST_GeomFromGeoJSON,
    ST_Intersects,
    ST_DWithin,
)
from typing import Optional, List, Dict, Any
import enum
import datetime

from app.models.base import BaseModel


class ClosureType(str, enum.Enum):
    """Enumeration of closure types."""

    CONSTRUCTION = "construction"
    ACCIDENT = "accident"
    EVENT = "event"
    MAINTENANCE = "maintenance"
    WEATHER = "weather"
    OTHER = "other"


class ClosureStatus(str, enum.Enum):
    """Enumeration of closure statuses."""

    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    PLANNED = "planned"


# Create PostgreSQL enum types
closure_type_enum = ENUM(ClosureType, name="closure_type_enum", create_type=False)
closure_status_enum = ENUM(ClosureStatus, name="closure_status_enum", create_type=False)


class Closure(BaseModel):
    """
    Model representing a temporary road closure.
    """

    __tablename__ = "closures"

    id = Column(Integer, primary_key=True, index=True, doc="Unique closure identifier")

    # Geospatial data
    geometry = Column(
        Geometry("LINESTRING", srid=4326),
        nullable=False,
        doc="Road segment geometry as LineString in WGS84",
    )

    # Temporal data
    start_time = Column(
        DateTime(timezone=True), nullable=False, index=True, doc="Closure start time"
    )

    end_time = Column(
        DateTime(timezone=True),
        nullable=True,
        index=True,
        doc="Closure end time (None for indefinite)",
    )

    # Descriptive data
    description = Column(
        Text, nullable=False, doc="Human-readable description of the closure"
    )

    closure_type = Column(
        String(50),
        nullable=False,
        index=True,
        doc="Type of closure (construction, accident, etc.)",
    )

    # OpenLR location reference
    openlr_code = Column(Text, nullable=True, doc="OpenLR encoded location reference")

    # Status and metadata
    status = Column(
        String(50),
        nullable=False,
        default="active",
        index=True,
        doc="Current status of the closure",
    )

    # User attribution
    submitter_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
        doc="ID of user who submitted this closure",
    )

    # Additional metadata
    source = Column(String(100), nullable=True, doc="Source of the closure information")

    confidence_level = Column(
        Integer, nullable=True, doc="Confidence level of the closure information (1-10)"
    )

    # Relationships
    submitter = relationship(
        "User", back_populates="closures", doc="User who submitted this closure"
    )

    def __init__(self, **kwargs):
        """Initialize closure with automatic status management."""
        super().__init__(**kwargs)
        self.update_status_if_needed()

    @property
    def is_valid(self) -> bool:
        """
        Check if the closure is currently valid (active and within time bounds).

        Returns:
            bool: True if closure is valid
        """
        now = datetime.datetime.now(datetime.timezone.utc)

        # Check if status is active
        if self.status != ClosureStatus.ACTIVE:
            return False

        # Check temporal bounds
        if self.start_time > now:
            return False

        if self.end_time and self.end_time < now:
            return False

        return True

    @property
    def duration_hours(self) -> Optional[float]:
        """
        Calculate closure duration in hours.

        Returns:
            float or None: Duration in hours or None if ongoing
        """
        if not self.end_time:
            return None

        delta = self.end_time - self.start_time
        return delta.total_seconds() / 3600

    def update_status_if_needed(self) -> bool:
        """
        Update status based on current time and closure schedule.

        Returns:
            bool: True if status was updated
        """
        now = datetime.datetime.now(datetime.timezone.utc)
        old_status = self.status

        # Don't update cancelled closures
        if self.status == ClosureStatus.CANCELLED:
            return False

        # Check if closure should be expired
        if (
            self.end_time
            and self.end_time < now
            and self.status == ClosureStatus.ACTIVE
        ):
            self.status = ClosureStatus.EXPIRED
            return True

        # Check if planned closure should be active
        if self.start_time <= now and self.status == ClosureStatus.PLANNED:
            self.status = ClosureStatus.ACTIVE
            return True

        return False

    def get_geojson(self) -> Dict[str, Any]:
        """
        Get geometry as GeoJSON.

        Returns:
            dict: GeoJSON representation of the geometry
        """
        if not self.geometry:
            return None

        # This will need to be implemented with a database session
        # For now, return a placeholder
        return {
            "type": "Feature",
            "geometry": None,  # Will be populated by service layer
            "properties": {
                "id": self.id,
                "description": self.description,
                "closure_type": self.closure_type.value,
                "status": self.status.value,
                "start_time": self.start_time.isoformat(),
                "end_time": self.end_time.isoformat() if self.end_time else None,
            },
        }

    @classmethod
    def get_valid_closures(
        cls, db: Session, skip: int = 0, limit: int = 100
    ) -> List["Closure"]:
        """
        Get all currently valid closures.

        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List[Closure]: List of valid closures
        """
        now = datetime.datetime.now(datetime.timezone.utc)

        return (
            db.query(cls)
            .filter(
                cls.status == ClosureStatus.ACTIVE,
                cls.start_time <= now,
                (cls.end_time.is_(None)) | (cls.end_time > now),
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    @classmethod
    def get_by_bbox(
        cls,
        db: Session,
        min_lon: float,
        min_lat: float,
        max_lon: float,
        max_lat: float,
        valid_only: bool = True,
        skip: int = 0,
        limit: int = 100,
    ) -> List["Closure"]:
        """
        Get closures within a bounding box.

        Args:
            db: Database session
            min_lon: Minimum longitude
            min_lat: Minimum latitude
            max_lon: Maximum longitude
            max_lat: Maximum latitude
            valid_only: Whether to return only valid closures
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List[Closure]: List of closures in the bounding box
        """
        # Round coordinates to 5 decimal places
        min_lon = round(min_lon, 5)
        min_lat = round(min_lat, 5)
        max_lon = round(max_lon, 5)
        max_lat = round(max_lat, 5)

        # Create bounding box geometry
        bbox_wkt = f"POLYGON(({min_lon} {min_lat}, {max_lon} {min_lat}, {max_lon} {max_lat}, {min_lon} {max_lat}, {min_lon} {min_lat}))"

        query = db.query(cls).filter(
            ST_Intersects(cls.geometry, func.ST_GeomFromText(bbox_wkt, 4326))
        )

        if valid_only:
            now = datetime.datetime.now(datetime.timezone.utc)
            query = query.filter(
                cls.status == ClosureStatus.ACTIVE,
                cls.start_time <= now,
                (cls.end_time.is_(None)) | (cls.end_time > now),
            )

        return query.offset(skip).limit(limit).all()

    @classmethod
    def get_by_user(
        cls, db: Session, user_id: int, skip: int = 0, limit: int = 100
    ) -> List["Closure"]:
        """
        Get closures submitted by a specific user.

        Args:
            db: Database session
            user_id: User ID
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List[Closure]: List of user's closures
        """
        return (
            db.query(cls)
            .filter(cls.submitter_id == user_id)
            .order_by(cls.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @classmethod
    def get_by_type(
        cls,
        db: Session,
        closure_type: ClosureType,
        valid_only: bool = True,
        skip: int = 0,
        limit: int = 100,
    ) -> List["Closure"]:
        """
        Get closures by type.

        Args:
            db: Database session
            closure_type: Type of closure
            valid_only: Whether to return only valid closures
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List[Closure]: List of closures of the specified type
        """
        query = db.query(cls).filter(cls.closure_type == closure_type)

        if valid_only:
            now = datetime.datetime.now(datetime.timezone.utc)
            query = query.filter(
                cls.status == ClosureStatus.ACTIVE,
                cls.start_time <= now,
                (cls.end_time.is_(None)) | (cls.end_time > now),
            )

        return query.offset(skip).limit(limit).all()

    def to_dict(self, include_geometry: bool = False) -> Dict[str, Any]:
        """
        Convert closure to dictionary.

        Args:
            include_geometry: Whether to include geometry data

        Returns:
            dict: Closure data dictionary
        """
        data = super().to_dict(exclude=["geometry"] if not include_geometry else [])

        # Convert enums to strings
        if "closure_type" in data:
            data["closure_type"] = (
                data["closure_type"].value
                if hasattr(data["closure_type"], "value")
                else data["closure_type"]
            )

        if "status" in data:
            data["status"] = (
                data["status"].value
                if hasattr(data["status"], "value")
                else data["status"]
            )

        # Add computed properties
        data["is_valid"] = self.is_valid
        data["duration_hours"] = self.duration_hours

        return data

    def __repr__(self) -> str:
        """String representation of the closure."""
        return (
            f"<Closure(id={self.id}, type={self.closure_type}, status={self.status})>"
        )
