// hooks/useMapCenter.ts
import { useState, useEffect } from 'react';

interface MapCenter {
    center: [number, number];
    zoom: number;
    loading: boolean;
    error: string | null;
    usingGeolocation: boolean;
}

interface UseMapCenterOptions {
    fallbackCenter?: [number, number];
    fallbackZoom?: number;
    useGeolocation?: boolean;
    geolocationZoom?: number;
    timeout?: number;
    maximumAge?: number;
}

export const useMapCenter = (options: UseMapCenterOptions = {}): MapCenter => {
    const {
        fallbackCenter = [0, 0], // World center coordinates
        fallbackZoom = 2, // World view zoom level
        useGeolocation = true,
        geolocationZoom = 13, // Higher zoom for user location
        timeout = 10000, // 10 seconds
        maximumAge = 300000 // 5 minutes
    } = options;

    const [mapCenter, setMapCenter] = useState<MapCenter>({
        center: fallbackCenter,
        zoom: fallbackZoom,
        loading: useGeolocation,
        error: null,
        usingGeolocation: false
    });

    useEffect(() => {
        // Skip geolocation if disabled
        if (!useGeolocation) {
            setMapCenter(prev => ({
                ...prev,
                loading: false
            }));
            return;
        }

        // Check if geolocation is supported
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser');
            setMapCenter(prev => ({
                ...prev,
                loading: false,
                error: 'Geolocation is not supported by this browser'
            }));
            return;
        }

        console.log('🌍 Attempting to get user location...');

        const getUserLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    console.log(`📍 User location found: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)}m)`);

                    setMapCenter({
                        center: [latitude, longitude],
                        zoom: geolocationZoom,
                        loading: false,
                        error: null,
                        usingGeolocation: true
                    });
                },
                (error) => {
                    let errorMessage = 'Failed to get location';

                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied by user';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                    }

                    console.warn('🚫 Geolocation error:', errorMessage);
                    setMapCenter(prev => ({
                        ...prev,
                        loading: false,
                        error: errorMessage,
                        usingGeolocation: false
                    }));
                },
                {
                    enableHighAccuracy: true,
                    timeout,
                    maximumAge
                }
            );
        };

        getUserLocation();
    }, [useGeolocation, geolocationZoom, timeout, maximumAge]);

    return mapCenter;
};

// Preset configurations for common use cases
export const useChicagoMapCenter = (useGeolocation = true) =>
    useMapCenter({
        fallbackCenter: [41.8781, -87.6298], // Chicago coordinates
        fallbackZoom: 11,
        useGeolocation,
        geolocationZoom: 13
    });

export const useWorldMapCenter = (useGeolocation = true) =>
    useMapCenter({
        fallbackCenter: [0, 0], // World center
        fallbackZoom: 2,
        useGeolocation,
        geolocationZoom: 13
    });

export const useUSMapCenter = (useGeolocation = true) =>
    useMapCenter({
        fallbackCenter: [39.8283, -98.5795], // Geographic center of US
        fallbackZoom: 4,
        useGeolocation,
        geolocationZoom: 13
    });