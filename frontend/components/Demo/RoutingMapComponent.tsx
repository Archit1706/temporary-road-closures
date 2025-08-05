"use client"
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RoutePoint {
    lat: number;
    lng: number;
    address?: string;
}

interface CalculatedRoute {
    coordinates: [number, number][];
    distance: number;
    duration: number;
    avoidedClosures: number;
    excludedPoints: [number, number][];
}

interface Closure {
    id: number;
    description: string;
    closure_type: string;
    status: 'active' | 'inactive' | 'expired';
    start_time: string;
    end_time: string;
    source: string;
    confidence_level: number;
    geometry: {
        type: 'Point' | 'LineString';
        coordinates: number[][];
    };
    is_bidirectional?: boolean;
}

interface RoutingMapComponentProps {
    sourcePoint: RoutePoint | null;
    destinationPoint: RoutePoint | null;
    route: CalculatedRoute | null;
    directRoute: CalculatedRoute | null;
    closures: Closure[];
    onSourceSelect: (point: RoutePoint) => void;
    onDestinationSelect: (point: RoutePoint) => void;
}

// Component to handle map events and render route elements
const MapEventHandler: React.FC<{
    sourcePoint: RoutePoint | null;
    destinationPoint: RoutePoint | null;
    route: CalculatedRoute | null;
    directRoute: CalculatedRoute | null;
    closures: Closure[];
    onSourceSelect: (point: RoutePoint) => void;
    onDestinationSelect: (point: RoutePoint) => void;
}> = ({
    sourcePoint,
    destinationPoint,
    route,
    directRoute,
    closures,
    onSourceSelect,
    onDestinationSelect
}) => {
        const map = useMap();
        const layersRef = useRef<L.LayerGroup>(new L.LayerGroup());

        // Handle map click events
        useMapEvents({
            click: (e) => {
                // Determine what to set based on current state
                if (!sourcePoint) {
                    onSourceSelect({
                        lat: e.latlng.lat,
                        lng: e.latlng.lng,
                        address: `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`
                    });
                } else if (!destinationPoint) {
                    onDestinationSelect({
                        lat: e.latlng.lat,
                        lng: e.latlng.lng,
                        address: `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`
                    });
                }
            },
        });

        // Helper function to create closure markers/lines
        const createClosureLayer = (closure: Closure): L.Layer[] => {
            const layers: L.Layer[] = [];
            const isActive = closure.status === 'active';
            const color = isActive ? '#ef4444' : '#9ca3af';

            if (closure.geometry.type === 'Point') {
                const [lng, lat] = closure.geometry.coordinates[0];

                const icon = L.divIcon({
                    className: 'custom-closure-icon',
                    html: `
          <div class="closure-marker ${isActive ? 'active' : 'inactive'}">
            <div class="closure-marker-inner">⚠</div>
          </div>
        `,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                });

                const marker = L.marker([lat, lng], { icon })
                    .bindPopup(`
          <div class="closure-popup">
            <h3 class="font-semibold text-gray-900 mb-2">${closure.description}</h3>
            <div class="text-sm space-y-1">
              <div><strong>Type:</strong> ${closure.closure_type.replace('_', ' ')}</div>
              <div><strong>Status:</strong> <span class="capitalize ${isActive ? 'text-red-600' : 'text-gray-600'}">${closure.status}</span></div>
              <div><strong>Source:</strong> ${closure.source}</div>
            </div>
          </div>
        `);

                layers.push(marker);

            } else if (closure.geometry.type === 'LineString') {
                const coordinates = closure.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);

                const polyline = L.polyline(coordinates, {
                    color,
                    weight: isActive ? 6 : 4,
                    opacity: isActive ? 0.8 : 0.6,
                    dashArray: isActive ? undefined : '5, 5',
                }).bindPopup(`
        <div class="closure-popup">
          <h3 class="font-semibold text-gray-900 mb-2">${closure.description}</h3>
          <div class="text-sm space-y-1">
            <div><strong>Type:</strong> ${closure.closure_type.replace('_', ' ')}</div>
            <div><strong>Status:</strong> <span class="capitalize ${isActive ? 'text-red-600' : 'text-gray-600'}">${closure.status}</span></div>
            <div><strong>Direction:</strong> ${closure.is_bidirectional ? 'Bidirectional ↔' : 'Unidirectional →'}</div>
            <div><strong>Source:</strong> ${closure.source}</div>
          </div>
        </div>
      `);

                layers.push(polyline);

                // Add direction arrows for active closures
                if (isActive && coordinates.length > 1) {
                    const midIndex = Math.floor(coordinates.length / 2);
                    const [midLat, midLng] = coordinates[midIndex];

                    const arrowIcon = L.divIcon({
                        className: 'direction-arrow',
                        html: `
            <div class="arrow-symbol" style="color: ${color}; background: rgba(255,255,255,0.9); border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 1px solid ${color};">
              ${closure.is_bidirectional ? '↔' : '→'}
            </div>
          `,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                    });

                    const arrowMarker = L.marker([midLat, midLng], { icon: arrowIcon });
                    layers.push(arrowMarker);
                }
            }

            return layers;
        };

        // Update map layers
        useEffect(() => {
            const layerGroup = layersRef.current;
            layerGroup.clearLayers();

            // Add source marker
            if (sourcePoint) {
                const sourceIcon = L.divIcon({
                    className: 'custom-marker source-marker',
                    html: `
          <div style="background-color: #22c55e; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            S
          </div>
        `,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                });

                const sourceMarker = L.marker([sourcePoint.lat, sourcePoint.lng], { icon: sourceIcon })
                    .bindPopup(`
          <div class="text-center">
            <h3 class="font-semibold text-green-700 mb-1">Start Location</h3>
            <p class="text-sm text-gray-600">${sourcePoint.address || 'Selected Point'}</p>
            <p class="text-xs text-gray-500 font-mono">${sourcePoint.lat.toFixed(6)}, ${sourcePoint.lng.toFixed(6)}</p>
          </div>
        `);

                layerGroup.addLayer(sourceMarker);
            }

            // Add destination marker
            if (destinationPoint) {
                const destIcon = L.divIcon({
                    className: 'custom-marker dest-marker',
                    html: `
          <div style="background-color: #ef4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
            D
          </div>
        `,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                });

                const destMarker = L.marker([destinationPoint.lat, destinationPoint.lng], { icon: destIcon })
                    .bindPopup(`
          <div class="text-center">
            <h3 class="font-semibold text-red-700 mb-1">Destination</h3>
            <p class="text-sm text-gray-600">${destinationPoint.address || 'Selected Point'}</p>
            <p class="text-xs text-gray-500 font-mono">${destinationPoint.lat.toFixed(6)}, ${destinationPoint.lng.toFixed(6)}</p>
          </div>
        `);

                layerGroup.addLayer(destMarker);
            }

            // Add direct route (if available)
            if (directRoute && directRoute.coordinates.length > 1) {
                const directPolyline = L.polyline(directRoute.coordinates, {
                    color: '#6b7280',
                    weight: 3,
                    opacity: 0.6,
                    dashArray: '10, 10',
                }).bindPopup(`
        <div>
          <h3 class="font-semibold text-gray-700 mb-1">Direct Route</h3>
          <p class="text-sm">Distance: ${directRoute.distance.toFixed(2)} km</p>
          <p class="text-sm">Duration: ${Math.round(directRoute.duration)} min</p>
          <p class="text-xs text-gray-500 mt-1">This route ignores road closures</p>
        </div>
      `);

                layerGroup.addLayer(directPolyline);
            }

            // Add closure-aware route (if available)
            if (route && route.coordinates.length > 1) {
                const routePolyline = L.polyline(route.coordinates, {
                    color: '#2563eb',
                    weight: 5,
                    opacity: 0.9,
                }).bindPopup(`
        <div>
          <h3 class="font-semibold text-blue-700 mb-1">Closure-Aware Route</h3>
          <p class="text-sm">Distance: ${route.distance.toFixed(2)} km</p>
          <p class="text-sm">Duration: ${Math.round(route.duration)} min</p>
          <p class="text-sm">Closures avoided: ${route.avoidedClosures}</p>
          <p class="text-xs text-blue-600 mt-1">✓ Optimized to avoid road closures</p>
        </div>
      `);

                layerGroup.addLayer(routePolyline);
            }

            // Add closure markers/lines
            closures.forEach(closure => {
                const closureLayers = createClosureLayer(closure);
                closureLayers.forEach(layer => layerGroup.addLayer(layer));
            });

            layerGroup.addTo(map);

            // Auto-fit bounds if we have points or routes
            if ((sourcePoint && destinationPoint) || route) {
                const bounds = L.latLngBounds([]);

                if (sourcePoint) bounds.extend([sourcePoint.lat, sourcePoint.lng]);
                if (destinationPoint) bounds.extend([destinationPoint.lat, destinationPoint.lng]);

                if (route && route.coordinates.length > 0) {
                    route.coordinates.forEach(coord => bounds.extend(coord));
                }

                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [20, 20] });
                }
            }

            return () => {
                layerGroup.clearLayers();
            };
        }, [sourcePoint, destinationPoint, route, directRoute, closures, map]);

        return null;
    };

const RoutingMapComponent: React.FC<RoutingMapComponentProps> = ({
    sourcePoint,
    destinationPoint,
    route,
    directRoute,
    closures,
    onSourceSelect,
    onDestinationSelect
}) => {
    return (
        <>
            <style jsx global>{`
        .closure-marker {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid white;
        }
        
        .closure-marker.active {
          background-color: #ef4444;
          color: white;
        }
        
        .closure-marker.inactive {
          background-color: #9ca3af;
          color: white;
        }
        
        .closure-marker-inner {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .closure-popup {
          min-width: 250px;
          max-width: 300px;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }

        .direction-arrow {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        .custom-marker {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
      `}</style>

            <MapContainer
                center={[41.8781, -87.6298]} // Chicago coordinates
                zoom={11}
                className="h-full w-full"
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapEventHandler
                    sourcePoint={sourcePoint}
                    destinationPoint={destinationPoint}
                    route={route}
                    directRoute={directRoute}
                    closures={closures}
                    onSourceSelect={onSourceSelect}
                    onDestinationSelect={onDestinationSelect}
                />
            </MapContainer>

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Legend</h3>
                <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        <span>Start (S)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                        <span>Destination (D)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-blue-600"></div>
                        <span>Closure-aware route</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-gray-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #6b7280 0, #6b7280 5px, transparent 5px, transparent 10px)' }}></div>
                        <span>Direct route</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">⚠</div>
                        <span>Active closures</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">⚠</div>
                        <span>Inactive closures</span>
                    </div>
                </div>
            </div>

            {/* Click Instructions */}
            {(!sourcePoint || !destinationPoint) && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="text-sm font-medium text-center">
                        {!sourcePoint && !destinationPoint && "Click on map to set start location"}
                        {sourcePoint && !destinationPoint && "Click on map to set destination"}
                    </div>
                </div>
            )}
        </>
    );
};

export default RoutingMapComponent;