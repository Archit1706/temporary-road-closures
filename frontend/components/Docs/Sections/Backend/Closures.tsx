import React from 'react';
import { InfoBox } from '../../Common';
import EndPointCard from '../../EndPointCard';

const Closures: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Closures</h1>
                <p className="text-lg text-gray-600">
                    Manage temporary road closures with spatial and temporal data.
                </p>
            </div>

            <EndPointCard
                method="POST"
                path="/api/v1/closures/"
                description="Submit a new temporary road closure with geometry and metadata."
                requestBody={`{
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "description": "Water main repair blocking eastbound traffic",
  "closure_type": "construction",
  "start_time": "2025-07-09T08:00:00Z",
  "end_time": "2025-07-09T18:00:00Z",
  "source": "City of Chicago",
  "confidence_level": 9,
  "is_bidirectional": false
}`}
                responseBody={`{
  "id": 123,
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "description": "Water main repair blocking eastbound traffic",
  "closure_type": "construction",
  "start_time": "2025-07-09T08:00:00Z",
  "end_time": "2025-07-09T18:00:00Z",
  "status": "active",
  "openlr_code": "CwRbWyNG/ztP",
  "submitter_id": 456,
  "source": "City of Chicago",
  "confidence_level": 9,
  "is_bidirectional": false,
  "is_valid": true,
  "duration_hours": 10.0,
  "created_at": "2025-07-08T14:30:00Z",
  "updated_at": "2025-07-08T14:30:00Z"
}`}
            />

            <EndPointCard
                method="GET"
                path="/api/v1/closures/"
                description="Query closures with spatial, temporal, and other filters."
                parameters={[
                    { name: 'bbox', type: 'string', description: 'Bounding box: min_lon,min_lat,max_lon,max_lat' },
                    { name: 'valid_only', type: 'boolean', description: 'Return only currently valid closures', required: false },
                    { name: 'closure_type', type: 'string', description: 'Filter by closure type', required: false },
                    { name: 'is_bidirectional', type: 'boolean', description: 'Filter by direction', required: false },
                    { name: 'page', type: 'integer', description: 'Page number (default: 1)', required: false },
                    { name: 'size', type: 'integer', description: 'Page size (default: 50)', required: false }
                ]}
                responseBody={`{
  "items": [
    {
      "id": 123,
      "geometry": {...},
      "description": "Water main repair...",
      "closure_type": "construction",
      "status": "active",
      "is_valid": true,
      "created_at": "2025-07-08T14:30:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 50,
  "pages": 1
}`}
            />

            <EndPointCard
                method="GET"
                path="/api/v1/closures/{closure_id}"
                description="Get detailed information about a specific closure."
                parameters={[
                    { name: 'closure_id', type: 'integer', description: 'Closure ID', required: true }
                ]}
                responseBody={`{
  "id": 123,
  "geometry": {
    "type": "LineString",
    "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
  },
  "description": "Water main repair blocking eastbound traffic",
  "closure_type": "construction",
  "status": "active",
  "openlr_code": "CwRbWyNG/ztP",
  "is_valid": true,
  "duration_hours": 10.0,
  "is_bidirectional": false,
  "created_at": "2025-07-08T14:30:00Z"
}`}
            />

            <EndPointCard
                method="PUT"
                path="/api/v1/closures/{closure_id}"
                description="Update an existing closure. Only the submitter or moderators can edit."
                parameters={[
                    { name: 'closure_id', type: 'integer', description: 'Closure ID', required: true }
                ]}
                requestBody={`{
  "description": "Updated: Water main repair with lane restrictions",
  "end_time": "2025-07-09T20:00:00Z",
  "confidence_level": 8
}`}
                responseBody={`{
  "id": 123,
  "description": "Updated: Water main repair with lane restrictions",
  "end_time": "2025-07-09T20:00:00Z",
  "confidence_level": 8,
  "updated_at": "2025-07-08T15:00:00Z"
}`}
            />

            <EndPointCard
                method="DELETE"
                path="/api/v1/closures/{closure_id}"
                description="Delete a closure. Only the submitter or moderators can delete."
                parameters={[
                    { name: 'closure_id', type: 'integer', description: 'Closure ID', required: true }
                ]}
            />

            <EndPointCard
                method="GET"
                path="/api/v1/closures/statistics/summary"
                description="Get statistical summary of closures in the system."
                responseBody={`{
  "total_closures": 150,
  "valid_closures": 45,
  "by_type": {
    "construction": 80,
    "accident": 30,
    "event": 25,
    "maintenance": 15
  },
  "by_status": {
    "active": 45,
    "expired": 90,
    "cancelled": 10,
    "planned": 5
  },
  "avg_duration_hours": 8.5
}`}
            />

            <InfoBox type="success" title="Supported Geometry Types">
                <div className="space-y-3">
                    <div>
                        <h4 className="font-medium text-green-700">LineString (Recommended)</h4>
                        <p className="text-green-600 text-sm">For road segments and linear closures. Supports OpenLR encoding.</p>
                    </div>
                    <div>
                        <h4 className="font-medium text-green-700">Point</h4>
                        <p className="text-green-600 text-sm">For intersection closures or specific locations. OpenLR not applicable.</p>
                    </div>
                </div>
            </InfoBox>
        </div>
    );
};

export default Closures;