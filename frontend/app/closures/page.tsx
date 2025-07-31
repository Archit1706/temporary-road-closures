// app/closures/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { ClosuresProvider, useClosures } from '@/context/ClosuresContext';
import Layout from '@/components/Layout/Layout';
import ClosureForm from '@/components/Forms/ClosureForm';
import ClientOnly from '@/components/ClientOnly';
import { LogIn, Info, MapPin, Route } from 'lucide-react';
import L from 'leaflet';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(
  () => import('@/components/Map/MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

// Dynamically import DemoControlPanel to avoid SSR issues with localStorage
const DemoControlPanel = dynamic(
  () => import('@/components/Demo/DemoControlPanel'),
  {
    ssr: false,
    loading: () => null
  }
);

// Auth Notice Component
const AuthNotice: React.FC = () => {
  const { state } = useClosures();
  const { isAuthenticated } = state;

  if (isAuthenticated) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 max-w-md">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Login Required to Report Closures
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              You can view all road closures, but you need to log in to report new ones.
            </p>
            <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
              <LogIn className="w-4 h-4 mr-1" />
              Login in Header
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Point Selection Instructions Component
const PointSelectionInstructions: React.FC<{
  isSelecting: boolean;
  pointCount: number;
  hasRoute: boolean;
  routeInfo?: { distance_km: number; points_count: number };
  onClear: () => void;
  onFinish: () => void;
}> = ({ isSelecting, pointCount, hasRoute, routeInfo, onClear, onFinish }) => {
  if (!isSelecting) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="font-medium text-gray-900">
            Selecting Points ({pointCount})
            {hasRoute && routeInfo && (
              <span className="text-green-600 ml-2">
                → Route: {routeInfo.distance_km.toFixed(2)}km
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {pointCount === 0 && "Click on the map to start selecting points"}
        {pointCount === 1 && "Add at least one more point to calculate route"}
        {pointCount >= 2 && !hasRoute && "Calculating route..."}
        {hasRoute && routeInfo && (
          <div className="text-green-700">
            ✅ Route calculated: {routeInfo.points_count} points, {routeInfo.distance_km.toFixed(2)} km
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500">
          {hasRoute ? (
            <div className="flex items-center space-x-1">
              <Route className="w-3 h-3" />
              <span>Using Valhalla routing</span>
            </div>
          ) : pointCount >= 2 ? (
            "Route calculation in progress..."
          ) : (
            "Click on map to add points"
          )}
        </div>
        <div className="flex space-x-2">
          {pointCount > 0 && (
            <button
              onClick={onClear}
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
            >
              Clear ({pointCount})
            </button>
          )}
          <button
            onClick={onFinish}
            className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded text-sm font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// Route Status Component
const RouteStatus: React.FC<{
  isRouting: boolean;
  hasRoute: boolean;
  routeError?: string;
  routeInfo?: { distance_km: number; points_count: number };
}> = ({ isRouting, hasRoute, routeError, routeInfo }) => {
  if (!isRouting && !hasRoute && !routeError) return null;

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm">
      {isRouting && (
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm font-medium">Calculating route...</span>
          </div>
        </div>
      )}

      {routeError && (
        <div className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm">⚠️ {routeError}</span>
          </div>
        </div>
      )}

      {hasRoute && routeInfo && (
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Route className="w-4 h-4" />
            <span className="text-sm">
              Route: {routeInfo.distance_km.toFixed(2)}km ({routeInfo.points_count} points)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

function ClosuresPageContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<L.LatLng[]>([]);
  const [isSelectingPoints, setIsSelectingPoints] = useState(false);

  // Route state
  const [routeState, setRouteState] = useState<{
    isRouting: boolean;
    hasRoute: boolean;
    routeError?: string;
    routeInfo?: { distance_km: number; points_count: number; coordinates: [number, number][] };
  }>({
    isRouting: false,
    hasRoute: false
  });

  // Handle custom events from the form
  useEffect(() => {
    const handleClearPoints = () => {
      setSelectedPoints([]);
      setRouteState({
        isRouting: false,
        hasRoute: false
      });
    };

    const handleFinishSelection = () => {
      setIsSelectingPoints(false);
    };

    window.addEventListener('clearPoints', handleClearPoints);
    window.addEventListener('finishSelection', handleFinishSelection);

    return () => {
      window.removeEventListener('clearPoints', handleClearPoints);
      window.removeEventListener('finishSelection', handleFinishSelection);
    };
  }, []);

  const handleToggleForm = () => {
    if (isFormOpen) {
      // Reset point selection when closing form
      setSelectedPoints([]);
      setIsSelectingPoints(false);
      setRouteState({
        isRouting: false,
        hasRoute: false
      });
    }
    setIsFormOpen(!isFormOpen);
  };

  const handlePointsSelect = () => {
    setIsSelectingPoints(true);
    setRouteState({
      isRouting: false,
      hasRoute: false
    });
  };

  const handleMapClick = (latlng: L.LatLng) => {
    if (isSelectingPoints) {
      // Add point to the selection
      setSelectedPoints(prev => {
        const newPoints = [...prev, latlng];

        // Reset route state when new points are added
        setRouteState({
          isRouting: false,
          hasRoute: false
        });

        return newPoints;
      });
    }
  };

  const handleClearPoints = () => {
    setSelectedPoints([]);
    setRouteState({
      isRouting: false,
      hasRoute: false
    });
  };

  const handleFinishSelection = () => {
    setIsSelectingPoints(false);
  };

  // Handle route calculation from MapComponent
  const handleRouteCalculated = (coordinates: [number, number][], stats: any) => {
    console.log('📍 Route calculated in page:', {
      pointsCount: coordinates.length,
      distance: stats.distance_km
    });

    setRouteState({
      isRouting: false,
      hasRoute: true,
      routeInfo: {
        distance_km: stats.distance_km,
        points_count: coordinates.length,
        coordinates
      }
    });

    // Dispatch event for form component
    const event = new CustomEvent('routeCalculated', {
      detail: { coordinates, stats }
    });
    window.dispatchEvent(event);
  };

  // Handle routing state changes
  const handleRoutingStart = () => {
    setRouteState(prev => ({
      ...prev,
      isRouting: true,
      hasRoute: false,
      routeError: undefined
    }));
  };

  const handleRoutingError = (error: string) => {
    setRouteState({
      isRouting: false,
      hasRoute: false,
      routeError: error
    });
  };

  return (
    <div className="h-screen">
      <Layout
        onToggleForm={handleToggleForm}
        isFormOpen={isFormOpen}
      >
        <MapComponent
          onMapClick={handleMapClick}
          selectedPoints={selectedPoints}
          isSelecting={isSelectingPoints}
          onClearPoints={handleClearPoints}
          onFinishSelection={handleFinishSelection}
          onRouteCalculated={handleRouteCalculated}
        />

        {/* Form Sidebar */}
        <ClosureForm
          isOpen={isFormOpen}
          onClose={handleToggleForm}
          selectedPoints={selectedPoints}
          onPointsSelect={handlePointsSelect}
          isSelectingPoints={isSelectingPoints}
        />
      </Layout>

      {/* Auth Notice for non-authenticated users */}
      <AuthNotice />

      {/* Route Status Indicators */}
      <RouteStatus
        isRouting={routeState.isRouting}
        hasRoute={routeState.hasRoute}
        routeError={routeState.routeError}
        routeInfo={routeState.routeInfo}
      />

      {/* Point Selection Instructions */}
      <PointSelectionInstructions
        isSelecting={isSelectingPoints}
        pointCount={selectedPoints.length}
        hasRoute={routeState.hasRoute}
        routeInfo={routeState.routeInfo}
        onClear={handleClearPoints}
        onFinish={handleFinishSelection}
      />

      {/* Demo Control Panel - Client-side only */}
      <ClientOnly>
        <DemoControlPanel />
      </ClientOnly>

      {/* Point Selection Status - Fixed position when form is open */}
      {isSelectingPoints && isFormOpen && (
        <div className="fixed top-20 right-[25rem] z-40 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">
              {selectedPoints.length === 0 ? 'Click on map to add points' :
                selectedPoints.length === 1 ? '1 point selected - add more for routing' :
                  `${selectedPoints.length} points selected`}
              {routeState.hasRoute && routeState.routeInfo && (
                <span className="text-green-200 ml-2">
                  → {routeState.routeInfo.distance_km.toFixed(2)}km route
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Valhalla Integration Notice */}
      {selectedPoints.length >= 2 && !routeState.hasRoute && !routeState.isRouting && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Route className="w-4 h-4" />
            <span className="text-sm font-medium">
              Waiting for route calculation...
            </span>
          </div>
        </div>
      )}

      {/* Valhalla Success Notice */}
      {/* {routeState.hasRoute && routeState.routeInfo && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Route className="w-4 h-4" />
            <span className="text-sm font-medium">
              ✅ Smart route calculated: {routeState.routeInfo.distance_km.toFixed(2)}km path
            </span>
          </div>
        </div>
      )} */}

      {/* Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default function ClosuresPage() {
  return (
    <ClosuresProvider>
      <ClosuresPageContent />
    </ClosuresProvider>
  );
}