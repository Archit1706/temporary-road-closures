"""
Spatial operations service.
"""

import json


class SpatialService:
    def __init__(self, db):
        self.db = db

    def geojson_to_wkt(self, geojson):
        """Convert GeoJSON to WKT format."""
        # Simple conversion for LineString
        if geojson.get("type") == "LineString":
            coords = geojson.get("coordinates", [])
            coord_pairs = [f"{lon} {lat}" for lon, lat in coords]
            return f"LINESTRING({', '.join(coord_pairs)})"
        return None
