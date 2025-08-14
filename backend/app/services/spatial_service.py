"""
Spatial operations service.
"""

import json


class SpatialService:
    def __init__(self, db):
        self.db = db

    def geojson_to_wkt(self, geojson):
        """Convert GeoJSON to WKT format for both Point and LineString."""
        geometry_type = geojson.get("type")
        coordinates = geojson.get("coordinates", [])
        
        if geometry_type == "Point":
            # Point: POINT(longitude latitude)
            lon, lat = coordinates
            return f"POINT({lon} {lat})"
        
        elif geometry_type == "LineString":
            # LineString: LINESTRING(lon1 lat1, lon2 lat2, ...)
            coord_pairs = [f"{lon} {lat}" for lon, lat in coordinates]
            return f"LINESTRING({', '.join(coord_pairs)})"
        
        return None
