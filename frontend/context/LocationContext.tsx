"use client"
import React, { createContext, useContext, useState, useCallback } from 'react';

interface LocationStatus {
    usingGeolocation: boolean;
    error: string | null;
    loading: boolean;
}

interface LocationContextType {
    status: LocationStatus;
    setStatus: (status: LocationStatus) => void;
}

const LocationContext = createContext<LocationContextType>({
    status: { usingGeolocation: false, error: null, loading: true },
    setStatus: () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatusRaw] = useState<LocationStatus>({
        usingGeolocation: false,
        error: null,
        loading: true,
    });

    const setStatus = useCallback((s: LocationStatus) => {
        setStatusRaw(s);
    }, []);

    return (
        <LocationContext.Provider value={{ status, setStatus }}>
            {children}
        </LocationContext.Provider>
    );
}

export const useLocationStatus = () => useContext(LocationContext);
