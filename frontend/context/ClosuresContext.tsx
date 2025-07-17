"use client"
import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { Closure, CreateClosureData, BoundingBox, closuresApi, authApi } from '@/services/api';
import toast from 'react-hot-toast';

// State interface
interface ClosuresState {
    closures: Closure[];
    loading: boolean;
    error: string | null;
    selectedClosure: Closure | null;
    isAuthenticated: boolean;
    user: any | null;
}

// Action types
type ClosuresAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_CLOSURES'; payload: Closure[] }
    | { type: 'ADD_CLOSURE'; payload: Closure }
    | { type: 'UPDATE_CLOSURE'; payload: Closure }
    | { type: 'DELETE_CLOSURE'; payload: number }
    | { type: 'SET_SELECTED_CLOSURE'; payload: Closure | null }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_AUTHENTICATED'; payload: boolean }
    | { type: 'SET_USER'; payload: any | null };

// Context interface
interface ClosuresContextType {
    state: ClosuresState;
    fetchClosures: (bbox?: BoundingBox) => Promise<void>;
    createClosure: (data: CreateClosureData) => Promise<void>;
    updateClosure: (id: number, data: Partial<CreateClosureData>) => Promise<void>;
    deleteClosure: (id: number) => Promise<void>;
    selectClosure: (closure: Closure | null) => void;
    login: (username: string, password: string) => Promise<void>;
    register: (userData: { username: string; email: string; full_name: string; password: string }) => Promise<void>;
    logout: () => void;
    checkAuthStatus: () => boolean;
}

// Initial state
const initialState: ClosuresState = {
    closures: [],
    loading: false,
    error: null,
    selectedClosure: null,
    isAuthenticated: false,
    user: null,
};

// Reducer
const closuresReducer = (state: ClosuresState, action: ClosuresAction): ClosuresState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        case 'SET_CLOSURES':
            return { ...state, closures: action.payload, loading: false, error: null };

        case 'ADD_CLOSURE':
            return {
                ...state,
                closures: [action.payload, ...state.closures],
                loading: false,
                error: null
            };

        case 'UPDATE_CLOSURE':
            return {
                ...state,
                closures: state.closures.map(closure =>
                    closure.id === action.payload.id ? action.payload : closure
                ),
                selectedClosure: state.selectedClosure?.id === action.payload.id
                    ? action.payload
                    : state.selectedClosure,
                loading: false,
                error: null
            };

        case 'DELETE_CLOSURE':
            return {
                ...state,
                closures: state.closures.filter(closure => closure.id !== action.payload),
                selectedClosure: state.selectedClosure?.id === action.payload
                    ? null
                    : state.selectedClosure,
                loading: false,
                error: null
            };

        case 'SET_SELECTED_CLOSURE':
            return { ...state, selectedClosure: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };

        case 'SET_AUTHENTICATED':
            return { ...state, isAuthenticated: action.payload };

        case 'SET_USER':
            return { ...state, user: action.payload };

        default:
            return state;
    }
};

// Create context
const ClosuresContext = createContext<ClosuresContextType | undefined>(undefined);

// Provider component
interface ClosuresProviderProps {
    children: ReactNode;
}

export const ClosuresProvider: React.FC<ClosuresProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(closuresReducer, initialState);

    // Check authentication status on mount and listen for token expiration
    useEffect(() => {
        const checkAuth = () => {
            const hasValidToken = authApi.isTokenValid();
            const userData = authApi.getUserData();
            dispatch({ type: 'SET_AUTHENTICATED', payload: hasValidToken });
            dispatch({ type: 'SET_USER', payload: hasValidToken ? userData : null });
        };

        // Initial check
        checkAuth();

        // Listen for token expiration events
        const handleTokenExpired = () => {
            console.log('🔄 Token expired - logging out user');
            dispatch({ type: 'SET_AUTHENTICATED', payload: false });
            dispatch({ type: 'SET_USER', payload: null });
            dispatch({ type: 'SET_CLOSURES', payload: [] });
            toast.error('Your session has expired. Please log in again.');
        };

        window.addEventListener('auth:token-expired', handleTokenExpired);

        return () => {
            window.removeEventListener('auth:token-expired', handleTokenExpired);
        };
    }, []);

    const checkAuthStatus = useCallback((): boolean => {
        const hasValidToken = authApi.isTokenValid();
        const userData = authApi.getUserData();
        dispatch({ type: 'SET_AUTHENTICATED', payload: hasValidToken });
        dispatch({ type: 'SET_USER', payload: hasValidToken ? userData : null });
        return hasValidToken;
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await authApi.login(username, password);
            authApi.setToken(response.access_token);
            authApi.setUserData(response.user);
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            dispatch({ type: 'SET_USER', payload: response.user });
            dispatch({ type: 'SET_LOADING', payload: false });
            toast.success(`Welcome back, ${response.user.full_name}!`);
            console.log('✅ Login successful, user authenticated');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            dispatch({ type: 'SET_AUTHENTICATED', payload: false });
            dispatch({ type: 'SET_USER', payload: null });
            toast.error(errorMessage);
            console.error('❌ Login failed:', errorMessage);
        }
    }, []);

    const register = useCallback(async (userData: { username: string; email: string; full_name: string; password: string }) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const response = await authApi.register(userData);
            dispatch({ type: 'SET_LOADING', payload: false });
            toast.success(`Account created successfully! Welcome, ${response.full_name}!`);
            console.log('✅ Registration successful:', response.username);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            dispatch({ type: 'SET_LOADING', payload: false });

            if (error instanceof Error && error.message.includes('409')) {
                toast.error('Username or email already exists');
            } else if (error instanceof Error && error.message.includes('validation')) {
                toast.error('Please check your input data');
            } else {
                toast.error(errorMessage);
            }
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        authApi.clearToken();
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_CLOSURES', payload: [] });
        dispatch({ type: 'SET_SELECTED_CLOSURE', payload: null });
        toast.success('Logged out successfully');
        console.log('👋 User logged out');
    }, []);

    const fetchClosures = useCallback(async (bbox?: BoundingBox) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const closures = await closuresApi.getClosures(bbox);
            dispatch({ type: 'SET_CLOSURES', payload: closures });
            console.log(`📍 Fetched ${closures.length} closures`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch closures';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });

            if (!authApi.isTokenValid()) {
                toast.error('Authentication required. Using demo data.');
                console.log('📍 Using demo data due to auth issue');
            } else {
                toast.error(errorMessage);
                console.error('❌ Error fetching closures:', errorMessage);
            }
        }
    }, []);

    const createClosure = useCallback(async (data: CreateClosureData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            // Check authentication before attempting to create
            if (!authApi.isTokenValid()) {
                throw new Error('Authentication required. Please log in to create closures.');
            }

            console.log('📝 Attempting to create closure:', {
                type: data.closure_type,
                points: data.geometry.coordinates.length,
                auth: !!authApi.getToken()
            });

            const newClosure = await closuresApi.createClosure(data);
            dispatch({ type: 'ADD_CLOSURE', payload: newClosure });
            toast.success('Road closure reported successfully!');
            console.log('✅ Closure created successfully:', newClosure.id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create closure';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });

            if (error instanceof Error && (error.message.includes('401') || error.message.includes('Authentication'))) {
                toast.error('Authentication required. Please log in to create closures.');
                // Trigger logout to clear invalid session
                logout();
            } else if (error instanceof Error && error.message.includes('validation')) {
                toast.error('Please check your input data');
            } else {
                toast.error(errorMessage);
            }

            console.error('❌ Error creating closure:', errorMessage);
        }
    }, [logout]);

    const updateClosure = useCallback(async (id: number, data: Partial<CreateClosureData>) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            if (!authApi.isTokenValid()) {
                throw new Error('Authentication required. Please log in to update closures.');
            }

            const updatedClosure = await closuresApi.updateClosure(id, data);
            dispatch({ type: 'UPDATE_CLOSURE', payload: updatedClosure });
            toast.success('Closure updated successfully!');
            console.log('✅ Closure updated successfully:', id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update closure';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });

            if (error instanceof Error && (error.message.includes('401') || error.message.includes('Authentication'))) {
                toast.error('Authentication required. Please log in to update closures.');
                logout();
            } else {
                toast.error(errorMessage);
            }

            console.error('❌ Error updating closure:', errorMessage);
        }
    }, [logout]);

    const deleteClosure = useCallback(async (id: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            if (!authApi.isTokenValid()) {
                throw new Error('Authentication required. Please log in to delete closures.');
            }

            await closuresApi.deleteClosure(id);
            dispatch({ type: 'DELETE_CLOSURE', payload: id });
            toast.success('Closure deleted successfully!');
            console.log('✅ Closure deleted successfully:', id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete closure';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });

            if (error instanceof Error && (error.message.includes('401') || error.message.includes('Authentication'))) {
                toast.error('Authentication required. Please log in to delete closures.');
                logout();
            } else {
                toast.error(errorMessage);
            }

            console.error('❌ Error deleting closure:', errorMessage);
        }
    }, [logout]);

    const selectClosure = useCallback((closure: Closure | null) => {
        dispatch({ type: 'SET_SELECTED_CLOSURE', payload: closure });
    }, []);

    const value: ClosuresContextType = {
        state,
        fetchClosures,
        createClosure,
        updateClosure,
        deleteClosure,
        selectClosure,
        login,
        register,
        logout,
        checkAuthStatus,
    };

    return (
        <ClosuresContext.Provider value={value}>
            {children}
        </ClosuresContext.Provider>
    );
};

// Hook to use the context
export const useClosures = (): ClosuresContextType => {
    const context = useContext(ClosuresContext);
    if (!context) {
        throw new Error('useClosures must be used within a ClosuresProvider');
    }
    return context;
};