// components/ClientOnly.tsx
"use client"
import React, { useSyncExternalStore } from 'react';

interface ClientOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
    const hasMounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );

    if (!hasMounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default ClientOnly;
