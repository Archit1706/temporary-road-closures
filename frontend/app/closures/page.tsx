'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Toaster } from 'react-hot-toast';
import { ClosuresProvider, useClosures } from '@/context/ClosuresContext';
import Layout from '@/components/Layout/Layout';
import ClosureForm from '@/components/Forms/ClosureForm';
import ClientOnly from '@/components/ClientOnly';
import { LogIn, Info, MapPin } from 'lucide-react';
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
  onClear: () => void;
  onFinish: () => void;
}> = ({ isSelecting, pointCount, onClear, onFinish }) => {
  if (!isSelecting) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="font-medium text-gray-900">Selecting Points ({pointCount})</span>
        </div>
        <div className="text-sm text-gray-600">
          Click on the map to add points along the road segment
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-500">
          {pointCount === 0 && "Click on the map to start"}
          {pointCount === 1 && "Add at least one more point for LineString"}
          {pointCount >= 2 && "✓ Ready for LineString"}
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

function ClosuresPageContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<L.LatLng[]>([]);
  const [isSelectingPoints, setIsSelectingPoints] = useState(false);

  // Handle custom events from the form
  useEffect(() => {
    const handleClearPoints = () => {
      setSelectedPoints([]);
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
    }
    setIsFormOpen(!isFormOpen);
  };

  const handlePointsSelect = () => {
    setIsSelectingPoints(true);
  };

  const handleMapClick = (latlng: L.LatLng) => {
    if (isSelectingPoints) {
      // Add point to the selection
      setSelectedPoints(prev => [...prev, latlng]);
    }
  };

  const handleClearPoints = () => {
    setSelectedPoints([]);
  };

  const handleFinishSelection = () => {
    setIsSelectingPoints(false);
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

      {/* Point Selection Instructions */}
      <PointSelectionInstructions
        isSelecting={isSelectingPoints}
        pointCount={selectedPoints.length}
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
                selectedPoints.length === 1 ? '1 point selected - add more' :
                  `${selectedPoints.length} points selected`}
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