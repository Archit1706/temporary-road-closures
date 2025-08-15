import React from 'react';
import { InfoBox } from '../../Common';
import EndPointCard from '../../EndPointCard';

const OpenLR: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">OpenLR</h1>
                <p className="text-lg text-gray-600">
                    Open Location Referencing for cross-platform compatibility.
                </p>
            </div>

            <InfoBox type="info" title="About OpenLR">
                <p>
                    OpenLR (Open Location Referencing) is a standard for describing road locations in a
                    map-agnostic way. This enables any OSM-based navigation app to accurately map closures
                    onto their own road network, even if the underlying map data differs slightly.
                </p>
            </InfoBox>

            <EndPointCard
                method="GET"
                path="/api/v1/openlr/info"
                description="Get OpenLR configuration and statistics."
                responseBody={`{
  "enabled": true,
  "format": "base64",
  "accuracy_tolerance": 50.0,
  "settings": {
    "enabled": true,
    "format": "base64",
    "max_points": 15,
    "min_distance": 15.0,
    "validate_roundtrip": true
  }
}`}
            />

            <EndPointCard
                method="POST"
                path="/api/v1/openlr/encode"
                description="Encode a GeoJSON geometry to OpenLR format with optional validation."
                requestBody={`{
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "validate_roundtrip": true
}`}
                responseBody={`{
  "success": true,
  "openlr_code": "CwRbWyNG/ztP",
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "accuracy_meters": 12.5,
  "valid": true,
  "metadata": {
    "tolerance_meters": 50.0,
    "original_geometry": {...}
  }
}`}
            />

            <EndPointCard
                method="POST"
                path="/api/v1/openlr/decode"
                description="Decode an OpenLR code to GeoJSON geometry."
                requestBody={`{
  "openlr_code": "CwRbWyNG/ztP"
}`}
                responseBody={`{
  "success": true,
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "metadata": {
    "openlr_code": "CwRbWyNG/ztP",
    "format_detected": "auto"
  }
}`}
            />

            <EndPointCard
                method="POST"
                path="/api/v1/openlr/encode-osm-way"
                description="Encode an OpenStreetMap way to OpenLR format."
                requestBody={`{
  "way_id": 123456789,
  "start_node": 1001,
  "end_node": 1002
}`}
                responseBody={`{
  "success": true,
  "openlr_code": "CwRbWyNG/ztP",
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "metadata": {
    "way_id": 123456789,
    "start_node": 1001,
    "end_node": 1002,
    "source": "OpenStreetMap"
  }
}`}
            />

            <EndPointCard
                method="POST"
                path="/api/v1/openlr/validate"
                description="Validate an OpenLR code format and accuracy."
                requestBody={`{
  "openlr_code": "CwRbWyNG/ztP"
}`}
                responseBody={`{
  "valid": true,
  "tolerance_meters": 50.0,
  "decoded_geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "openlr_code": "CwRbWyNG/ztP"
}`}
            />

            <EndPointCard
                method="GET"
                path="/api/v1/openlr/test/coordinates"
                description="Quick test endpoint for encoding coordinate pairs."
                parameters={[
                    { name: 'coordinates', type: 'string', description: 'Comma-separated coordinates: lon1,lat1,lon2,lat2,...', required: true }
                ]}
                responseBody={`{
  "success": true,
  "openlr_code": "CwRbWyNG/ztP",
  "metadata": {
    "input_coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]],
    "coordinate_count": 2
  }
}`}
            />

            <InfoBox type="warning" title="Important Notes">
                <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>OpenLR encoding only works with LineString geometries, not Points</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Encoding accuracy depends on the quality of the input geometry</span>
                    </li>
                    <li className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>Roundtrip validation is recommended for production use</span>
                    </li>
                </ul>
            </InfoBox>
        </div>
    );
};

export default OpenLR;