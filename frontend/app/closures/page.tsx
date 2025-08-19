// app/closures/page.tsx 
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { ClosuresProvider, useClosures } from '@/context/ClosuresContext';
// import Layout from '@/components/Layout/Layout';
// import ClosureForm from '@/components/Forms/ClosureForm';
// import EditClosureForm from '@/components/Forms/EditClosureForm';
import ClientOnly from '@/components/ClientOnly';
import { LogIn, Info, MapPin, Route, Edit3, TriangleAlert, Target } from 'lucide-react';
import L from 'leaflet';

// // Dynamically import MapComponent to avoid SSR issues
// const MapComponent = dynamic(
//   () => import('@/components/Map/MapComponent'),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="h-full w-full bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading map...</p>
//         </div>
//       </div>
//     )
//   }
// );

// Dynamically import all components that use browser APIs
const Layout = dynamic(() => import('@/components/Layout/Layout'), { ssr: false });
const ClosureForm = dynamic(() => import('@/components/Forms/ClosureForm'), { ssr: false });
const EditClosureForm = dynamic(() => import('@/components/Forms/EditClosureForm'), { ssr: false });
const MapComponent = dynamic(() => import('@/components/Map/MapComponent'), { ssr: false });
const DemoControlPanel = dynamic(() => import('@/components/Demo/DemoControlPanel'), { ssr: false });

// Loading component
const LoadingSpinner = () => (
  <div className="h-screen w-full bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading application...</p>
    </div>
  </div>
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
              Login Required for Full Features
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              You can view closures, but need to log in to report new ones or edit existing closures.
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
  geometryType: 'Point' | 'LineString';
}> = ({ isSelecting, pointCount, hasRoute, routeInfo, onClear, onFinish, geometryType }) => {
  if (!isSelecting) return null;

  const getInstructionText = () => {
    if (geometryType === 'Point') {
      return pointCount === 0 ? "Click on the map to select a point location" : "Point location selected";
    } else {
      return pointCount === 0 ? "Click on the map to start selecting points" :
        pointCount === 1 ? "Add at least one more point to calculate route" :
          pointCount >= 2 && !hasRoute && !routeInfo ? "Calculating route with Valhalla..." :
            hasRoute && routeInfo ? `Route calculated: ${routeInfo.points_count} points, ${routeInfo.distance_km.toFixed(2)} km` :
              "Select points for road segment";
    }
  };

  const getGeometryIcon = () => {
    return geometryType === 'Point' ? Target : Route;
  };

  const GeometryIcon = getGeometryIcon();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${geometryType === 'Point' ? 'bg-orange-600' : 'bg-blue-600'}`}></div>
          <GeometryIcon className={`w-4 h-4 ${geometryType === 'Point' ? 'text-orange-600' : 'text-blue-600'}`} />
          <span className="font-medium text-gray-900">
            {geometryType === 'Point' ? 'Point Selection' : 'Road Segment Selection'} ({pointCount}/{geometryType === 'Point' ? '1' : '2+'})
            {hasRoute && routeInfo && geometryType === 'LineString' && (
              <span className="text-green-600 ml-2">
                → Route: {routeInfo.distance_km.toFixed(2)}km
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        {getInstructionText()}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500">
          {geometryType === 'Point' ? (
            <div className="flex items-center space-x-1">
              <Target className="w-3 h-3" />
              <span>Single point location</span>
            </div>
          ) : hasRoute ? (
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
            className={`text-white hover:opacity-90 px-3 py-1 rounded text-sm font-medium ${geometryType === 'Point' ? 'bg-orange-600' : 'bg-blue-600'
              }`}
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
  geometryType: 'Point' | 'LineString';
}> = ({ isRouting, hasRoute, routeError, routeInfo, geometryType }) => {
  if (geometryType === 'Point') return null; // No routing for points
  if (!isRouting && !hasRoute && !routeError) return null;

  return (
    <div className="fixed top-4 right-4 z-40 max-w-sm">
      {isRouting && (
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg mb-2">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm font-medium">Calculating route with Valhalla...</span>
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
              Valhalla Route: {routeInfo.distance_km.toFixed(2)}km ({routeInfo.points_count} points)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Edit Status Component
const EditStatus: React.FC<{
  isEditing: boolean;
  editingClosure: any;
  onCancel: () => void;
}> = ({ isEditing, editingClosure, onCancel }) => {
  if (!isEditing || !editingClosure) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 max-w-md">
      <div className="bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <Edit3 className="w-4 h-4" />
          <span className="text-sm font-medium">
            Editing Closure #{editingClosure.id}
          </span>
          <button
            onClick={onCancel}
            className="ml-2 text-orange-200 hover:text-white text-sm underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

function ClosuresPageContent() {
  const [mounted, setMounted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<L.LatLng[]>([]);
  const [isSelectingPoints, setIsSelectingPoints] = useState(false);
  const [geometryType, setGeometryType] = useState<'Point' | 'LineString'>('LineString');

  // Move useClosures hook here, before any conditional returns
  const { state, stopEditingClosure } = useClosures();
  const { editingClosure, editLoading } = state;

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

  useEffect(() => {
    setMounted(true);
  }, []);

  // Watch for editing state changes
  useEffect(() => {
    if (editingClosure && !isEditFormOpen) {
      setIsEditFormOpen(true);
      setIsFormOpen(false);
    }
  }, [editingClosure, isEditFormOpen]);

  // Consolidated event listeners
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

    // Consolidated geometry type change handler
    const handleGeometryTypeChange = (event: CustomEvent) => {
      const newGeometryType = event.detail.geometryType;
      setGeometryType(newGeometryType);

      // Clear points when switching between Point and LineString
      if (newGeometryType !== geometryType) {
        setSelectedPoints([]);
        setRouteState({
          isRouting: false,
          hasRoute: false
        });
      }
    };

    window.addEventListener('clearPoints', handleClearPoints);
    window.addEventListener('finishSelection', handleFinishSelection);
    window.addEventListener('geometryTypeChanged', handleGeometryTypeChange as EventListener);

    return () => {
      window.removeEventListener('clearPoints', handleClearPoints);
      window.removeEventListener('finishSelection', handleFinishSelection);
      window.removeEventListener('geometryTypeChanged', handleGeometryTypeChange as EventListener);
    };
  }, [geometryType]);

  // Early return after ALL hooks have been called
  if (!mounted) {
    return <LoadingSpinner />;
  }

  const handleToggleForm = () => {
    if (isFormOpen) {
      setSelectedPoints([]);
      setIsSelectingPoints(false);
      setRouteState({
        isRouting: false,
        hasRoute: false
      });
      setGeometryType('LineString'); // Reset to default
    }
    setIsFormOpen(!isFormOpen);

    if (!isFormOpen && isEditFormOpen) {
      setIsEditFormOpen(false);
      stopEditingClosure();
    }
  };

  const handleToggleEditForm = () => {
    setIsEditFormOpen(!isEditFormOpen);

    if (isEditFormOpen) {
      stopEditingClosure();
    }

    if (!isEditFormOpen && isFormOpen) {
      setIsFormOpen(false);
      setSelectedPoints([]);
      setIsSelectingPoints(false);
      setRouteState({
        isRouting: false,
        hasRoute: false
      });
    }
  };

  const handleEditClosure = (closureId: number) => {
    setIsEditFormOpen(true);

    if (isFormOpen) {
      setIsFormOpen(false);
      setSelectedPoints([]);
      setIsSelectingPoints(false);
      setRouteState({
        isRouting: false,
        hasRoute: false
      });
    }
  };

  const handlePointsSelect = () => {
    setIsSelectingPoints(true);
    setRouteState({
      isRouting: false,
      hasRoute: false
    });
  };

  const handleMapClick = (latlng: L.LatLng) => {
    if (isSelectingPoints && isFormOpen && !isEditFormOpen) {
      // For Point geometry, replace the existing point; for LineString, add to the array
      if (geometryType === 'Point') {
        setSelectedPoints([latlng]); // Replace with single point
      } else {
        setSelectedPoints(prev => [...prev, latlng]); // Add to array
      }

      // Reset route state when new points are added
      setRouteState({
        isRouting: false,
        hasRoute: false
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
    // Only handle route calculation for LineString geometry
    if (geometryType !== 'LineString') return;

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

    const event = new CustomEvent('routeCalculated', {
      detail: { coordinates, stats }
    });
    window.dispatchEvent(event);
  };

  // Handle routing state changes
  const handleRoutingStart = () => {
    if (geometryType === 'LineString') {
      setRouteState(prev => ({
        ...prev,
        isRouting: true,
        hasRoute: false,
        routeError: undefined
      }));
    }
  };

  const handleRoutingError = (error: string) => {
    if (geometryType === 'LineString') {
      setRouteState({
        isRouting: false,
        hasRoute: false,
        routeError: error
      });
    }
  };

  return (
    <div className="h-screen">
      <Layout
        onToggleForm={handleToggleForm}
        isFormOpen={isFormOpen}
        onEditClosure={handleEditClosure}
      >
        <MapComponent
          onMapClick={handleMapClick}
          selectedPoints={selectedPoints}
          isSelecting={isSelectingPoints && isFormOpen && !isEditFormOpen}
          onClearPoints={handleClearPoints}
          onFinishSelection={handleFinishSelection}
          onRouteCalculated={handleRouteCalculated}
          geometryType={geometryType}
        />

        {/* Create Form Sidebar */}
        <ClosureForm
          isOpen={isFormOpen}
          onClose={handleToggleForm}
          selectedPoints={selectedPoints}
          onPointsSelect={handlePointsSelect}
          isSelectingPoints={isSelectingPoints}
        />

        {/* Edit Form Sidebar */}
        {editingClosure && (
          <EditClosureForm
            isOpen={isEditFormOpen}
            onClose={handleToggleEditForm}
            closure={editingClosure}
          />
        )}
      </Layout>

      {/* Auth Notice for non-authenticated users */}
      <AuthNotice />

      {/* Edit Status Indicator */}
      <EditStatus
        isEditing={isEditFormOpen && !!editingClosure}
        editingClosure={editingClosure}
        onCancel={handleToggleEditForm}
      />

      {/* Route Status Indicators */}
      <RouteStatus
        isRouting={routeState.isRouting}
        hasRoute={routeState.hasRoute}
        routeError={routeState.routeError}
        routeInfo={routeState.routeInfo}
        geometryType={geometryType}
      />

      {/* Point Selection Instructions */}
      <PointSelectionInstructions
        isSelecting={isSelectingPoints && isFormOpen && !isEditFormOpen}
        pointCount={selectedPoints.length}
        hasRoute={routeState.hasRoute}
        routeInfo={routeState.routeInfo}
        onClear={handleClearPoints}
        onFinish={handleFinishSelection}
        geometryType={geometryType}
      />

      {/* Demo Control Panel - Client-side only */}
      <ClientOnly>
        <DemoControlPanel />
      </ClientOnly>

      {/* Point Selection Status - Fixed position when create form is open */}
      {isSelectingPoints && isFormOpen && !isEditFormOpen && (
        <div className="fixed top-20 right-[25rem] z-40 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            {geometryType === 'Point' ? <Target className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
            <span className="text-sm font-medium">
              {geometryType === 'Point' ? (
                selectedPoints.length === 0 ? 'Click on map to select point' : 'Point selected'
              ) : (
                selectedPoints.length === 0 ? 'Click on map to add points' :
                  selectedPoints.length === 1 ? '1 point selected - add more for routing' :
                    `${selectedPoints.length} points selected`
              )}
              {routeState.hasRoute && routeState.routeInfo && geometryType === 'LineString' && (
                <span className="text-green-200 ml-2">
                  → {routeState.routeInfo.distance_km.toFixed(2)}km route
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Edit Form Status - Fixed position when edit form is open */}
      {isEditFormOpen && editingClosure && (
        <div className="fixed top-20 right-[25rem] z-40 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-4 h-4" />
            <span className="text-sm font-medium">
              Editing: {editingClosure.description.substring(0, 30)}
              {editingClosure.description.length > 30 ? '...' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Geometry Type Indicator */}
      {isSelectingPoints && isFormOpen && !isEditFormOpen && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            {geometryType === 'Point' ? (
              <>
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Point Closure Mode</span>
              </>
            ) : (
              <>
                <Route className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Road Segment Mode</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Valhalla Integration Notice - Only for LineString */}
      {geometryType === 'LineString' && selectedPoints.length >= 2 && !routeState.hasRoute && !routeState.isRouting && isFormOpen && !isEditFormOpen && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Route className="w-4 h-4" />
            <span className="text-sm font-medium">
              Waiting for Valhalla route calculation...
            </span>
          </div>
        </div>
      )}

      {/* Route Success Notice - Only for LineString */}
      {geometryType === 'LineString' && routeState.hasRoute && routeState.routeInfo && isFormOpen && !isEditFormOpen && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Route className="w-4 h-4" />
            <span className="text-sm font-medium">
              ✅ Valhalla route ready: {routeState.routeInfo.distance_km.toFixed(2)}km ({routeState.routeInfo.points_count} points)
            </span>
          </div>
        </div>
      )}

      {/* Point Selection Success Notice - Only for Point */}
      {geometryType === 'Point' && selectedPoints.length === 1 && isFormOpen && !isEditFormOpen && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">
              📍 Point location selected
            </span>
          </div>
        </div>
      )}

      {/* Form Conflict Warning */}
      {isFormOpen && isEditFormOpen && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <TriangleAlert className="w-4 h-4" />
            <span className="text-sm font-medium">
              Cannot have both create and edit forms open simultaneously
            </span>
          </div>
        </div>
      )}

      {/* Loading State for Edit */}
      {editLoading && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm font-medium">
              {editingClosure ? 'Updating closure...' : 'Loading closure for editing...'}
            </span>
          </div>
        </div>
      )}

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