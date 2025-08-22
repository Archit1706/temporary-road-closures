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
        coordinates: number[] | number[][];
    };
    is_bidirectional?: boolean;
}

export type TransportationMode = 'auto' | 'bicycle' | 'pedestrian';

interface RoutingMapComponentProps {
    sourcePoint: RoutePoint | null;
    destinationPoint: RoutePoint | null;
    transportationMode: TransportationMode;
    route: CalculatedRoute | null;
    directRoute: CalculatedRoute | null;
    closures: Closure[];
    relevantClosures: Closure[];
    onSourceSelect: (point: RoutePoint) => void;
    onDestinationSelect: (point: RoutePoint) => void;
}

// Define which closure types affect which transportation modes
const closureTypeEffects: Record<string, TransportationMode[]> = {
    'construction': ['auto', 'bicycle'],
    'accident': ['auto', 'bicycle'],
    'event': ['auto'],
    'maintenance': ['auto', 'bicycle'],
    'weather': ['auto', 'bicycle', 'pedestrian'],
    'emergency': ['auto', 'bicycle', 'pedestrian'],
    'other': ['auto', 'bicycle', 'pedestrian'],
    'sidewalk_repair': ['pedestrian'],
    'bike_lane_closure': ['bicycle'],
    'bridge_closure': ['auto', 'bicycle', 'pedestrian'],
    'tunnel_closure': ['auto', 'bicycle'],
};

// Component to handle map events and render route elements
const MapEventHandler: React.FC<{
    sourcePoint: RoutePoint | null;
    destinationPoint: RoutePoint | null;
    transportationMode: TransportationMode;
    route: CalculatedRoute | null;
    directRoute: CalculatedRoute | null;
    closures: Closure[];
    relevantClosures: Closure[];
    onSourceSelect: (point: RoutePoint) => void;
    onDestinationSelect: (point: RoutePoint) => void;
}> = ({
    sourcePoint,
    destinationPoint,
    transportationMode,
    route,
    directRoute,
    closures,
    relevantClosures,
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

        // Check if closure affects the selected transportation mode
        const doesClosureAffectMode = (closure: Closure, mode: TransportationMode): boolean => {
            const affectedModes = closureTypeEffects[closure.closure_type] || ['auto', 'bicycle', 'pedestrian'];
            return affectedModes.includes(mode);
        };

        // Helper function to create closure markers/lines
        const createClosureLayer = (closure: Closure): L.Layer[] => {
            const layers: L.Layer[] = [];
            const isActive = closure.status === 'active';
            const affectsCurrentMode = doesClosureAffectMode(closure, transportationMode);

            // Color coding based on relevance to transportation mode
            let color: string;
            let opacity: number;
            let className: string;

            if (isActive && affectsCurrentMode) {
                // Red for closures that affect current transportation mode
                color = '#ef4444';
                opacity = 0.9;
                className = 'relevant-active-closure';
            } else if (isActive && !affectsCurrentMode) {
                // Green for closures that don't affect current transportation mode
                color = '#10b981';
                opacity = 0.6;
                className = 'irrelevant-active-closure';
            } else {
                // Gray for inactive closures
                color = '#9ca3af';
                opacity = 0.4;
                className = 'inactive-closure';
            }

            if (closure.geometry.type === 'Point') {
                const [lng, lat] = closure.geometry.coordinates as number[];

                const icon = L.divIcon({
                    className: 'custom-closure-icon',
                    html: `
          <div class="closure-marker ${className}">
            <div class="closure-marker-inner">⚠</div>
            ${isActive && affectsCurrentMode ? '<div class="blocking-indicator">🚫</div>' : ''}
            ${isActive && !affectsCurrentMode ? '<div class="safe-indicator">✓</div>' : ''}
          </div>
        `,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14],
                });

                const marker = L.marker([lat, lng], { icon })
                    .bindPopup(`
          <div class="closure-popup">
            <div class="flex items-center space-x-2 mb-2">
              <h3 class="font-semibold text-gray-900">${closure.description}</h3>
              ${isActive && affectsCurrentMode ? '<span class="text-red-600 font-bold">🚫 BLOCKS</span>' : ''}
              ${isActive && !affectsCurrentMode ? '<span class="text-green-600 font-bold">✓ SAFE</span>' : ''}
            </div>
            <div class="text-sm space-y-1">
              <div><strong>Type:</strong> ${closure.closure_type.replace('_', ' ')}</div>
              <div><strong>Status:</strong> <span class="capitalize ${isActive ? 'text-red-600' : 'text-gray-600'}">${closure.status}</span></div>
              <div><strong>Transportation Impact:</strong></div>
              <div class="ml-4">
                ${['auto', 'bicycle', 'pedestrian'].map(mode => {
                        const affects = (closureTypeEffects[closure.closure_type] || ['auto', 'bicycle', 'pedestrian']).includes(mode as TransportationMode);
                        const isCurrent = mode === transportationMode;
                        const icon = mode === 'auto' ? '🚗' : mode === 'bicycle' ? '🚲' : '🚶';
                        return `
                      <div class="flex items-center space-x-1 ${isCurrent ? 'font-bold' : ''}">
                        <span>${icon}</span>
                        <span class="${affects ? 'text-red-600' : 'text-green-600'}">${affects ? '✗' : '✓'}</span>
                        <span class="${isCurrent ? 'text-blue-600' : ''}">${mode}${isCurrent ? ' (current)' : ''}</span>
                      </div>
                    `;
                    }).join('')}
              </div>
              <div><strong>Source:</strong> ${closure.source}</div>
            </div>
          </div>
        `);

                layers.push(marker);

            } else if (closure.geometry.type === 'LineString') {
                const coordinates = (closure.geometry.coordinates as number[][]).map(([lng, lat]) => [lat, lng] as [number, number]);

                const polyline = L.polyline(coordinates, {
                    color,
                    weight: isActive ? (affectsCurrentMode ? 6 : 4) : 3,
                    opacity,
                    dashArray: isActive ? undefined : '5, 5',
                    className: className
                }).bindPopup(`
        <div class="closure-popup">
          <div class="flex items-center space-x-2 mb-2">
            <h3 class="font-semibold text-gray-900">${closure.description}</h3>
            ${isActive && affectsCurrentMode ? '<span class="text-red-600 font-bold">🚫 BLOCKS</span>' : ''}
            ${isActive && !affectsCurrentMode ? '<span class="text-green-600 font-bold">✓ SAFE</span>' : ''}
          </div>
          <div class="text-sm space-y-1">
            <div><strong>Type:</strong> ${closure.closure_type.replace('_', ' ')}</div>
            <div><strong>Status:</strong> <span class="capitalize ${isActive ? 'text-red-600' : 'text-gray-600'}">${closure.status}</span></div>
            <div><strong>Direction:</strong> ${closure.is_bidirectional ? 'Bidirectional ↔' : 'Unidirectional →'}</div>
            <div><strong>Transportation Impact:</strong></div>
            <div class="ml-4">
              ${['auto', 'bicycle', 'pedestrian'].map(mode => {
                    const affects = (closureTypeEffects[closure.closure_type] || ['auto', 'bicycle', 'pedestrian']).includes(mode as TransportationMode);
                    const isCurrent = mode === transportationMode;
                    const icon = mode === 'auto' ? '🚗' : mode === 'bicycle' ? '🚲' : '🚶';
                    return `
                  <div class="flex items-center space-x-1 ${isCurrent ? 'font-bold' : ''}">
                    <span>${icon}</span>
                    <span class="${affects ? 'text-red-600' : 'text-green-600'}">${affects ? '✗' : '✓'}</span>
                    <span class="${isCurrent ? 'text-blue-600' : ''}">${mode}${isCurrent ? ' (current)' : ''}</span>
                  </div>
                `;
                }).join('')}
            </div>
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
            <div class="arrow-symbol" style="color: ${color}; background: rgba(255,255,255,0.95); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid ${color}; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ${closure.is_bidirectional ? '↔' : '→'}
            </div>
          `,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
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
          <div style="background-color: #22c55e; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.3);">
            S
          </div>
        `,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                });

                const sourceMarker = L.marker([sourcePoint.lat, sourcePoint.lng], { icon: sourceIcon })
                    .bindPopup(`
          <div class="text-center">
            <h3 class="font-semibold text-green-700 mb-1">Start Location</h3>
            <p class="text-sm text-gray-600">${sourcePoint.address || 'Selected Point'}</p>
            <p class="text-xs text-gray-500 font-mono">${sourcePoint.lat.toFixed(6)}, ${sourcePoint.lng.toFixed(6)}</p>
            <div class="mt-2 text-xs text-blue-600">
              Route mode: ${transportationMode === 'auto' ? '🚗 Driving' : transportationMode === 'bicycle' ? '🚲 Cycling' : '🚶 Walking'}
            </div>
          </div>
        `);

                layerGroup.addLayer(sourceMarker);
            }

            // Add destination marker
            if (destinationPoint) {
                const destIcon = L.divIcon({
                    className: 'custom-marker dest-marker',
                    html: `
          <div style="background-color: #ef4444; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.3);">
            D
          </div>
        `,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                });

                const destMarker = L.marker([destinationPoint.lat, destinationPoint.lng], { icon: destIcon })
                    .bindPopup(`
          <div class="text-center">
            <h3 class="font-semibold text-red-700 mb-1">Destination</h3>
            <p class="text-sm text-gray-600">${destinationPoint.address || 'Selected Point'}</p>
            <p class="text-xs text-gray-500 font-mono">${destinationPoint.lat.toFixed(6)}, ${destinationPoint.lng.toFixed(6)}</p>
            <div class="mt-2 text-xs text-blue-600">
              Route mode: ${transportationMode === 'auto' ? '🚗 Driving' : transportationMode === 'bicycle' ? '🚲 Cycling' : '🚶 Walking'}
            </div>
          </div>
        `);

                layerGroup.addLayer(destMarker);
            }

            // Add direct route (if available) - always show in background
            if (directRoute && directRoute.coordinates.length > 1) {
                const directPolyline = L.polyline(directRoute.coordinates, {
                    color: '#6b7280',
                    weight: 3,
                    opacity: 0.5,
                    dashArray: '10, 10',
                }).bindPopup(`
        <div>
          <h3 class="font-semibold text-gray-700 mb-1">Direct Route (${transportationMode})</h3>
          <p class="text-sm">Distance: ${directRoute.distance.toFixed(2)} km</p>
          <p class="text-sm">Duration: ${Math.round(directRoute.duration)} min</p>
          <p class="text-xs text-gray-500 mt-1">This route ignores all road closures</p>
        </div>
      `);

                layerGroup.addLayer(directPolyline);
            }

            // Add closure-aware route (if available) - prominent display
            if (route && route.coordinates.length > 1) {
                const routePolyline = L.polyline(route.coordinates, {
                    color: '#2563eb',
                    weight: 6,
                    opacity: 1.0,
                }).bindPopup(`
        <div>
          <h3 class="font-semibold text-blue-700 mb-1">Closure-Aware Route (${transportationMode})</h3>
          <p class="text-sm">Distance: ${route.distance.toFixed(2)} km</p>
          <p class="text-sm">Duration: ${Math.round(route.duration)} min</p>
          <p class="text-sm">Relevant closures avoided: ${route.avoidedClosures}</p>
          <p class="text-xs text-blue-600 mt-1">✓ Optimized to avoid ${transportationMode}-relevant closures</p>
        </div>
      `);

                layerGroup.addLayer(routePolyline);
            }

            // Add closure markers/lines with transportation mode awareness
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
                    map.fitBounds(bounds, { padding: [30, 30] });
                }
            }

            return () => {
                layerGroup.clearLayers();
            };
        }, [sourcePoint, destinationPoint, transportationMode, route, directRoute, closures, relevantClosures, map]);

        return null;
    };

const RoutingMapComponent: React.FC<RoutingMapComponentProps> = ({
    sourcePoint,
    destinationPoint,
    transportationMode,
    route,
    directRoute,
    closures,
    relevantClosures,
    onSourceSelect,
    onDestinationSelect
}) => {
    const getTransportationModeInfo = (mode: TransportationMode) => {
        switch (mode) {
            case 'auto':
                return { icon: '🚗', label: 'Driving' };
            case 'bicycle':
                return { icon: '🚲', label: 'Cycling' };
            case 'pedestrian':
                return { icon: '🚶', label: 'Walking' };
        }
    };

    const modeInfo = getTransportationModeInfo(transportationMode);

    return (
        <>
            <style jsx global>{`
        .closure-marker {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: bold;
          box-shadow: 0 3px 10px rgba(0,0,0,0.3);
          border: 3px solid white;
          position: relative;
        }
        
        .closure-marker.relevant-active-closure {
          background-color: #ef4444;
          color: white;
        }
        
        .closure-marker.irrelevant-active-closure {
          background-color: #10b981;
          color: white;
        }
        
        .closure-marker.inactive-closure {
          background-color: #9ca3af;
          color: white;
        }
        
        .closure-marker-inner {
          animation: pulse 2s infinite;
        }
        
        .blocking-indicator, .safe-indicator {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          border: 2px solid white;
        }
        
        .blocking-indicator {
          background-color: #dc2626;
        }
        
        .safe-indicator {
          background-color: #059669;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .closure-popup {
          min-width: 280px;
          max-width: 350px;
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
                    transportationMode={transportationMode}
                    route={route}
                    directRoute={directRoute}
                    closures={closures}
                    relevantClosures={relevantClosures}
                    onSourceSelect={onSourceSelect}
                    onDestinationSelect={onDestinationSelect}
                />
            </MapContainer>

            {/* Enhanced Map Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs">
                <div className="flex items-center space-x-2 mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Map Legend</h3>
                    <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded text-xs">
                        <span>{modeInfo.icon}</span>
                        <span className="font-medium text-blue-700">{modeInfo.label}</span>
                    </div>
                </div>
                <div className="space-y-2 text-xs">
                    {/* Route markers */}
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">S</div>
                        <span>Start location</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">D</div>
                        <span>Destination</span>
                    </div>

                    {/* Route lines */}
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-blue-600"></div>
                        <span>Closure-aware route</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-1 bg-gray-500" style={{ backgroundImage: 'repeating-linear-gradient(to right, #6b7280 0, #6b7280 3px, transparent 3px, transparent 6px)' }}></div>
                        <span>Direct route</span>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Closure indicators with transportation mode awareness */}
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">⚠</div>
                        <span>Blocks {modeInfo.label.toLowerCase()} 🚫</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">⚠</div>
                        <span>Safe for {modeInfo.label.toLowerCase()} ✓</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">⚠</div>
                        <span>Inactive closures</span>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Transportation mode explanation */}
                    <div className="bg-blue-50 p-2 rounded text-xs">
                        <p className="font-medium text-blue-900 mb-1">Smart Filtering</p>
                        <p className="text-blue-700">
                            Only closures affecting {modeInfo.label.toLowerCase()} are avoided in routing.
                        </p>
                        <div className="mt-1 text-blue-600">
                            Example: Road construction affects 🚗🚲 but not 🚶
                        </div>
                    </div>
                </div>
            </div>

            {/* Click Instructions */}
            {(!sourcePoint || !destinationPoint) && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="text-sm font-medium text-center flex items-center space-x-2">
                        <span>{modeInfo.icon}</span>
                        <span>
                            {!sourcePoint && !destinationPoint && `Click on map to set start location for ${modeInfo.label.toLowerCase()}`}
                            {sourcePoint && !destinationPoint && `Click on map to set destination for ${modeInfo.label.toLowerCase()}`}
                        </span>
                    </div>
                </div>
            )}

            {/* Transportation mode indicator */}
            {(sourcePoint || destinationPoint) && (
                <div className="absolute top-4 right-4 z-10 bg-white shadow-lg rounded-lg px-3 py-2 border border-gray-200">
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-gray-600">Mode:</span>
                        <span>{modeInfo.icon}</span>
                        <span className="font-medium text-gray-900">{modeInfo.label}</span>
                    </div>
                </div>
            )}
        </>
    );
};

export default RoutingMapComponent;