"""
Business logic for closure management.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from geoalchemy2.functions import ST_AsGeoJSON, ST_GeomFromGeoJSON, ST_Intersects
from typing import List, Optional, Dict, Any, Tuple
import json
from datetime import datetime, timezone

from app.models.closure import Closure, ClosureType, ClosureStatus
from app.models.user import User
from app.schemas.closure import ClosureCreate, ClosureUpdate, ClosureQueryParams
from app.core.exceptions import (
    NotFoundException,
    ValidationException,
    GeospatialException,
)
from app.services.openlr_service import OpenLRService
from app.services.spatial_service import SpatialService


class ClosureService:
    """
    Service class for closure-related business logic.
    """

    def __init__(self, db: Session):
        self.db = db
        self.openlr_service = OpenLRService()
        self.spatial_service = SpatialService(db)

    def create_closure(self, closure_data: ClosureCreate, user_id: int) -> Closure:
        """
        Create a new closure.

        Args:
            closure_data: Closure creation data
            user_id: ID of user creating the closure

        Returns:
            Closure: Created closure

        Raises:
            ValidationException: If data is invalid
            GeospatialException: If geometry is invalid
        """
        try:
            # Validate geometry
            geometry_geojson = closure_data.geometry.dict()
            self._validate_geometry(geometry_geojson)

            # Convert GeoJSON to PostGIS geometry
            geometry_wkt = self.spatial_service.geojson_to_wkt(geometry_geojson)

            # Create closure instance
            closure = Closure(
                geometry=func.ST_GeomFromText(geometry_wkt, 4326),
                description=closure_data.description,
                closure_type=closure_data.closure_type.value,
                start_time=closure_data.start_time,
                end_time=closure_data.end_time,
                source=closure_data.source,
                confidence_level=closure_data.confidence_level,
                osm_way_ids=closure_data.osm_way_ids,
                submitter_id=user_id,
                status=ClosureStatus.ACTIVE.value,
            )

            # Generate OpenLR code if enabled
            if hasattr(closure_data, "geometry") and closure_data.geometry:
                try:
                    openlr_code = self.openlr_service.encode_geometry(geometry_geojson)
                    closure.openlr_code = openlr_code
                except Exception as e:
                    # OpenLR encoding is optional, log but don't fail
                    print(f"OpenLR encoding failed: {e}")

            # Save to database
            self.db.add(closure)
            self.db.commit()
            self.db.refresh(closure)

            return closure

        except Exception as e:
            self.db.rollback()
            if isinstance(e, (ValidationException, GeospatialException)):
                raise
            raise ValidationException(f"Failed to create closure: {str(e)}")

    def get_closure_by_id(self, closure_id: int) -> Closure:
        """
        Get closure by ID.

        Args:
            closure_id: Closure ID

        Returns:
            Closure: Found closure

        Raises:
            NotFoundException: If closure not found
        """
        closure = self.db.query(Closure).filter(Closure.id == closure_id).first()

        if not closure:
            raise NotFoundException("Closure", closure_id)

        return closure

    def update_closure(
        self, closure_id: int, closure_data: ClosureUpdate, user: User
    ) -> Closure:
        """
        Update an existing closure.

        Args:
            closure_id: Closure ID to update
            closure_data: Update data
            user: User performing the update

        Returns:
            Closure: Updated closure

        Raises:
            NotFoundException: If closure not found
            ValidationException: If user doesn't have permission or data is invalid
        """
        closure = self.get_closure_by_id(closure_id)

        # Check permissions
        if not self._can_edit_closure(closure, user):
            raise ValidationException("You don't have permission to edit this closure")

        try:
            # Update fields
            update_data = closure_data.dict(exclude_unset=True)

            # Handle geometry update
            if "geometry" in update_data and update_data["geometry"]:
                geometry_geojson = update_data["geometry"]
                self._validate_geometry(geometry_geojson)
                geometry_wkt = self.spatial_service.geojson_to_wkt(geometry_geojson)
                closure.geometry = func.ST_GeomFromText(geometry_wkt, 4326)

                # Regenerate OpenLR code
                try:
                    closure.openlr_code = self.openlr_service.encode_geometry(
                        geometry_geojson
                    )
                except Exception as e:
                    print(f"OpenLR encoding failed during update: {e}")

                del update_data["geometry"]

            # Update other fields
            for field, value in update_data.items():
                if hasattr(closure, field):
                    setattr(closure, field, value)

            # Update status if needed
            closure.update_status_if_needed()

            self.db.commit()
            self.db.refresh(closure)

            return closure

        except Exception as e:
            self.db.rollback()
            if isinstance(e, ValidationException):
                raise
            raise ValidationException(f"Failed to update closure: {str(e)}")

    def delete_closure(self, closure_id: int, user: User) -> None:
        """
        Delete a closure.

        Args:
            closure_id: Closure ID to delete
            user: User performing the deletion

        Raises:
            NotFoundException: If closure not found
            ValidationException: If user doesn't have permission
        """
        closure = self.get_closure_by_id(closure_id)

        # Check permissions
        if not self._can_delete_closure(closure, user):
            raise ValidationException(
                "You don't have permission to delete this closure"
            )

        try:
            self.db.delete(closure)
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise ValidationException(f"Failed to delete closure: {str(e)}")

    def query_closures(
        self, params: ClosureQueryParams, user: Optional[User] = None
    ) -> Tuple[List[Closure], int]:
        """
        Query closures with filters and pagination.

        Args:
            params: Query parameters
            user: Optional user for permission filtering

        Returns:
            tuple: (closures, total_count)
        """
        query = self.db.query(Closure)

        # Apply filters
        if params.bbox:
            min_lon, min_lat, max_lon, max_lat = self._parse_bbox(params.bbox)
            bbox_geom = func.ST_MakeEnvelope(min_lon, min_lat, max_lon, max_lat, 4326)
            query = query.filter(ST_Intersects(Closure.geometry, bbox_geom))

        if params.active_only:
            now = datetime.now(timezone.utc)
            query = query.filter(
                Closure.status == ClosureStatus.ACTIVE,
                Closure.start_time <= now,
                or_(Closure.end_time.is_(None), Closure.end_time > now),
            )

        if params.closure_type:
            query = query.filter(Closure.closure_type == params.closure_type)

        if params.start_time:
            query = query.filter(Closure.start_time >= params.start_time)

        if params.end_time:
            query = query.filter(
                or_(Closure.end_time.is_(None), Closure.end_time <= params.end_time)
            )

        if params.submitter_id:
            query = query.filter(Closure.submitter_id == params.submitter_id)

        # Get total count before pagination
        total = query.count()

        # Apply pagination
        skip = (params.page - 1) * params.size
        closures = query.offset(skip).limit(params.size).all()

        return closures, total

    def get_closure_with_geometry(self, closure_id: int) -> Dict[str, Any]:
        """
        Get closure with GeoJSON geometry.

        Args:
            closure_id: Closure ID

        Returns:
            dict: Closure data with GeoJSON geometry
        """
        closure = self.get_closure_by_id(closure_id)

        # Get geometry as GeoJSON
        geometry_result = (
            self.db.query(ST_AsGeoJSON(Closure.geometry))
            .filter(Closure.id == closure_id)
            .first()
        )

        closure_dict = closure.to_dict()
        if geometry_result and geometry_result[0]:
            closure_dict["geometry"] = json.loads(geometry_result[0])

        return closure_dict

    def get_closures_with_geometry(
        self, closures: List[Closure]
    ) -> List[Dict[str, Any]]:
        """
        Get multiple closures with GeoJSON geometry.

        Args:
            closures: List of closures

        Returns:
            list: Closure data with GeoJSON geometry
        """
        if not closures:
            return []

        closure_ids = [c.id for c in closures]

        # Get geometries for all closures
        geometry_results = (
            self.db.query(Closure.id, ST_AsGeoJSON(Closure.geometry))
            .filter(Closure.id.in_(closure_ids))
            .all()
        )

        geometry_map = {
            result[0]: json.loads(result[1]) if result[1] else None
            for result in geometry_results
        }

        # Convert closures to dict with geometry
        result = []
        for closure in closures:
            closure_dict = closure.to_dict()
            closure_dict["geometry"] = geometry_map.get(closure.id)
            result.append(closure_dict)

        return result

    def get_statistics(self) -> Dict[str, Any]:
        """
        Get closure statistics.

        Returns:
            dict: Statistics data
        """
        now = datetime.now(timezone.utc)

        # Total closures
        total_closures = self.db.query(Closure).count()

        # Active closures
        active_closures = (
            self.db.query(Closure)
            .filter(
                Closure.status == ClosureStatus.ACTIVE,
                Closure.start_time <= now,
                or_(Closure.end_time.is_(None), Closure.end_time > now),
            )
            .count()
        )

        # Closures by type
        type_stats = (
            self.db.query(Closure.closure_type, func.count(Closure.id))
            .group_by(Closure.closure_type)
            .all()
        )

        by_type = {str(type_val): count for type_val, count in type_stats}

        # Closures by status
        status_stats = (
            self.db.query(Closure.status, func.count(Closure.id))
            .group_by(Closure.status)
            .all()
        )

        by_status = {str(status_val): count for status_val, count in status_stats}

        # Average duration
        avg_duration_result = (
            self.db.query(
                func.avg(
                    func.extract("epoch", Closure.end_time - Closure.start_time) / 3600
                )
            )
            .filter(Closure.end_time.isnot(None))
            .scalar()
        )

        avg_duration_hours = float(avg_duration_result) if avg_duration_result else None

        return {
            "total_closures": total_closures,
            "active_closures": active_closures,
            "by_type": by_type,
            "by_status": by_status,
            "avg_duration_hours": avg_duration_hours,
        }

    def _validate_geometry(self, geometry: Dict[str, Any]) -> None:
        """
        Validate GeoJSON geometry.

        Args:
            geometry: GeoJSON geometry object

        Raises:
            GeospatialException: If geometry is invalid
        """
        if not isinstance(geometry, dict):
            raise GeospatialException("Geometry must be a GeoJSON object")

        if "type" not in geometry or "coordinates" not in geometry:
            raise GeospatialException(
                "Geometry must have 'type' and 'coordinates' fields"
            )

        geometry_type = geometry["type"]
        if geometry_type not in ["LineString", "Point", "Polygon"]:
            raise GeospatialException(f"Unsupported geometry type: {geometry_type}")

        # Additional validation could be added here
        # For example, checking coordinate ranges, topology, etc.

    def _parse_bbox(self, bbox: str) -> Tuple[float, float, float, float]:
        """
        Parse bounding box string.

        Args:
            bbox: Bounding box string "min_lon,min_lat,max_lon,max_lat"

        Returns:
            tuple: Parsed coordinates

        Raises:
            ValidationException: If bbox format is invalid
        """
        try:
            coords = [float(x.strip()) for x in bbox.split(",")]
            if len(coords) != 4:
                raise ValueError("Must have exactly 4 coordinates")
            return tuple(coords)
        except (ValueError, IndexError) as e:
            raise ValidationException(f"Invalid bounding box format: {e}")

    def _can_edit_closure(self, closure: Closure, user: User) -> bool:
        """
        Check if user can edit closure.

        Args:
            closure: Closure to check
            user: User to check

        Returns:
            bool: True if user can edit closure
        """
        # Moderators can edit any closure
        if user.is_moderator:
            return True

        # Users can edit their own closures
        return closure.submitter_id == user.id

    def _can_delete_closure(self, closure: Closure, user: User) -> bool:
        """
        Check if user can delete closure.

        Args:
            closure: Closure to check
            user: User to check

        Returns:
            bool: True if user can delete closure
        """
        # Same permissions as editing for now
        return self._can_edit_closure(closure, user)
