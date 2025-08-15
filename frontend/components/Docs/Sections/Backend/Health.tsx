import React from 'react';
import { InfoBox } from '../../Common';
import EndPointCard from '../../EndPointCard';

const Health: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Health Check</h1>
                <p className="text-lg text-gray-600">
                    System health and status monitoring endpoints.
                </p>
            </div>

            <EndPointCard
                method="GET"
                path="/health"
                description="Basic health check endpoint for service monitoring."
                responseBody={`{
  "status": "healthy",
  "timestamp": 1705492800.0,
  "version": "1.0.0",
  "database": "connected",
  "openlr": {
    "enabled": true,
    "format": "base64"
  }
}`}
            />

            <EndPointCard
                method="GET"
                path="/health/detailed"
                description="Detailed health check with system information."
                responseBody={`{
  "status": "healthy",
  "timestamp": 1705492800.0,
  "version": "1.0.0",
  "environment": "development",
  "database": {
    "postgresql_version": "PostgreSQL 15.3...",
    "postgis_version": "3.5.0",
    "pool_size": 5,
    "checked_out": 2,
    "overflow": 0
  },
  "system": {
    "platform": "Linux-5.15.0-91-generic-x86_64",
    "python_version": "3.11.7",
    "cpu_count": 8,
    "memory_total": 16777216000,
    "memory_available": 8388608000,
    "disk_usage": 45.2
  },
  "openlr": {
    "enabled": true,
    "format": "base64",
    "settings": {
      "accuracy_tolerance": 50.0,
      "validate_roundtrip": true
    }
  }
}`}
            />

            <InfoBox type="success" title="Monitoring Integration">
                <p className="mb-4">
                    Use these endpoints for monitoring and alerting:
                </p>
                <div className="space-y-2 text-sm">
                    <div><strong>Basic monitoring:</strong> <code>/health</code> - Returns 200 if healthy</div>
                    <div><strong>Detailed monitoring:</strong> <code>/health/detailed</code> - Full system status</div>
                    <div><strong>Database check:</strong> Verifies PostgreSQL and PostGIS connectivity</div>
                    <div><strong>OpenLR status:</strong> Configuration and feature availability</div>
                </div>
            </InfoBox>
        </div>
    );
};

export default Health;