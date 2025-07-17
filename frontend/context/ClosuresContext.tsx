"use client"
import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { Closure, CreateClosureData, BoundingBox, closuresApi, authApi } from '@/services/api';
import toast from 'react-hot-toast';

// State interface
interface ClosuresState {
    closures: Closure[];
    loading: boolean;
    error: string | null;
    selectedClosure: Closure | null;
    isAuthenticated: boolean;
    user: any | null; // User data from login response
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
    logout: () => void;
    checkAuthStatus: () => boolean;
}

// Initial state
const initialState: ClosuresState = {
    closures: [],
    loading: false,
    error: null,
    selectedClosure: null,
    isAuthenticated: false, // Will be set properly on client-side
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

    // Check authentication status on mount (client-side only)
    React.useEffect(() => {
        const hasToken = !!authApi.getToken();
        const userData = authApi.getUserData();
        dispatch({ type: 'SET_AUTHENTICATED', payload: hasToken });
        dispatch({ type: 'SET_USER', payload: userData });
    }, []);

    const checkAuthStatus = useCallback((): boolean => {
        const hasToken = !!authApi.getToken();
        const userData = authApi.getUserData();
        dispatch({ type: 'SET_AUTHENTICATED', payload: hasToken });
        dispatch({ type: 'SET_USER', payload: userData });
        return hasToken;
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await authApi.login(username, password);
            authApi.setToken(response.access_token);
            authApi.setUserData(response.user);
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            dispatch({ type: 'SET_USER', payload: response.user });
            dispatch({ type: 'SET_LOADING', payload: false });
            toast.success(`Welcome back, ${response.user.full_name}!`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            dispatch({ type: 'SET_AUTHENTICATED', payload: false });
            dispatch({ type: 'SET_USER', payload: null });
            toast.error(errorMessage);
        }
    }, []);

    const logout = useCallback(() => {
        authApi.clearToken();
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_CLOSURES', payload: [] });
        dispatch({ type: 'SET_SELECTED_CLOSURE', payload: null });
        toast.success('Logged out successfully');
    }, []);

    const fetchClosures = useCallback(async (bbox?: BoundingBox) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const closures = await closuresApi.getClosures(bbox);
            dispatch({ type: 'SET_CLOSURES', payload: closures });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch closures';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });

            // Show different messages based on authentication status
            if (!authApi.getToken()) {
                toast.error('Authentication required. Using demo data.');
            } else {
                toast.error(errorMessage);
            }
        }
    }, []);

    const createClosure = useCallback(async (data: CreateClosureData) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const newClosure = await closuresApi.createClosure(data);
            dispatch({ type: 'ADD_CLOSURE', payload: newClosure });
            toast.success('Road closure reported successfully!');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create closure';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });

            // Provide more specific error messages
            if (error instanceof Error && error.message.includes('401')) {
                toast.error('Authentication required to create closures');
            } else if (error instanceof Error && error.message.includes('validation')) {
                toast.error('Please check your input data');
            } else {
                toast.error(errorMessage);
            }
        }
    }, []);

    const updateClosure = useCallback(async (id: number, data: Partial<CreateClosureData>) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const updatedClosure = await closuresApi.updateClosure(id, data);
            dispatch({ type: 'UPDATE_CLOSURE', payload: updatedClosure });
            toast.success('Closure updated successfully!');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update closure';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            toast.error(errorMessage);
        }
    }, []);

    const deleteClosure = useCallback(async (id: number) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            await closuresApi.deleteClosure(id);
            dispatch({ type: 'DELETE_CLOSURE', payload: id });
            toast.success('Closure deleted successfully!');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete closure';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            toast.error(errorMessage);
        }
    }, []);

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