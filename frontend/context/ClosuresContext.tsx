"use client"
import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { Closure, CreateClosureData, UpdateClosureData, BoundingBox, closuresApi, authApi } from '@/services/api';
import toast from 'react-hot-toast';

// State interface
interface ClosuresState {
    closures: Closure[];
    loading: boolean;
    error: string | null;
    selectedClosure: Closure | null;
    isAuthenticated: boolean;
    user: any | null;
    editingClosure: Closure | null;
    editLoading: boolean;
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
    | { type: 'SET_USER'; payload: any | null }
    | { type: 'SET_EDITING_CLOSURE'; payload: Closure | null }
    | { type: 'SET_EDIT_LOADING'; payload: boolean };

// Context interface
interface ClosuresContextType {
    state: ClosuresState;
    fetchClosures: (bbox?: BoundingBox) => Promise<void>;
    createClosure: (data: CreateClosureData) => Promise<void>;
    updateClosure: (id: number, data: UpdateClosureData) => Promise<void>;
    deleteClosure: (id: number) => Promise<void>;
    selectClosure: (closure: Closure | null) => void;
    login: (username: string, password: string) => Promise<void>;
    register: (userData: { username: string; email: string; full_name: string; password: string }) => Promise<void>;
    logout: () => void;
    checkAuthStatus: () => boolean;
    startEditingClosure: (closureId: number) => Promise<void>;
    stopEditingClosure: () => void;
    canEditClosure: (closure: Closure) => boolean;
}

// Initial state
const initialState: ClosuresState = {
    closures: [],
    loading: false,
    error: null,
    selectedClosure: null,
    isAuthenticated: false,
    user: null,
    editingClosure: null,
    editLoading: false,
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
                editingClosure: state.editingClosure?.id === action.payload.id
                    ? action.payload
                    : state.editingClosure,
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
                editingClosure: state.editingClosure?.id === action.payload
                    ? null
                    : state.editingClosure,
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

        case 'SET_EDITING_CLOSURE':
            return { ...state, editingClosure: action.payload };

        case 'SET_EDIT_LOADING':
            return { ...state, editLoading: action.payload };

        default:
            return state;
    }
};

// Helper function to parse error messages
const parseErrorMessage = (error: any): string => {
    // Check for response data with detail field (FastAPI standard)
    if (error?.response?.data?.detail) {
        if (typeof error.response.data.detail === 'string') {
            return error.response.data.detail;
        }
        if (Array.isArray(error.response.data.detail)) {
            return error.response.data.detail.map((e: any) => e.msg).join(', ');
        }
    }

    // Check for response data with message field (custom format)
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    // Check for error object with message
    if (error?.message) {
        return error.message;
    }

    return 'An unexpected error occurred';
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

            if (hasValidToken && userData) {
                console.log('✅ User authenticated:', userData.username);
            }
        };

        // Check for OAuth callback token in URL
        const handleOAuthCallback = async () => {
            if (typeof window === 'undefined') return;

            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            const expiresIn = urlParams.get('expires_in');

            if (token) {
                console.log('🔐 OAuth token detected in URL, processing...');

                try {
                    // Store the token
                    authApi.setToken(token);

                    // Fetch user data
                    const userData = await authApi.getCurrentUser();
                    authApi.setUserData(userData);

                    // Update state
                    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
                    dispatch({ type: 'SET_USER', payload: userData });

                    // Show success message
                    toast.success(`Welcome, ${userData.full_name || userData.username}! 🎉`, {
                        duration: 4000,
                        icon: '👋'
                    });

                    console.log('✅ OAuth login successful:', userData.username);

                    // Clean up URL by removing token parameters
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, document.title, newUrl);
                } catch (error) {
                    console.error('❌ Failed to process OAuth token:', error);
                    authApi.clearToken();
                    toast.error('Failed to complete OAuth login. Please try again.', {
                        icon: '❌',
                        duration: 4000
                    });
                }

                return; // Don't run normal auth check if we're processing OAuth
            }

            // Normal authentication check
            checkAuth();
        };

        // Handle OAuth callback or normal auth check
        handleOAuthCallback();

        // Listen for token expiration events
        const handleTokenExpired = () => {
            console.log('🔄 Token expired - logging out user');
            dispatch({ type: 'SET_AUTHENTICATED', payload: false });
            dispatch({ type: 'SET_USER', payload: null });
            dispatch({ type: 'SET_CLOSURES', payload: [] });
            toast.error('Your session has expired. Please log in again.', {
                icon: '🔐',
                duration: 5000
            });
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
            console.log('🔐 Attempting login for user:', username);
            const response = await authApi.login(username, password);
            authApi.setToken(response.access_token);
            authApi.setUserData(response.user);
            dispatch({ type: 'SET_AUTHENTICATED', payload: true });
            dispatch({ type: 'SET_USER', payload: response.user });
            dispatch({ type: 'SET_LOADING', payload: false });

            toast.success(`Welcome back, ${response.user.full_name}! 👋`, {
                duration: 3000,
                icon: '🎉'
            });
            console.log('✅ Login successful, user authenticated:', response.user.username);
        } catch (error: any) {
            const errorMessage = parseErrorMessage(error);
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            dispatch({ type: 'SET_AUTHENTICATED', payload: false });
            dispatch({ type: 'SET_USER', payload: null });

            console.error('❌ Login failed:', errorMessage);
            throw error; // Re-throw to let the component handle specific errors
        }
    }, []);

    const register = useCallback(async (userData: { username: string; email: string; full_name: string; password: string }) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            console.log('📝 Attempting registration for user:', userData.username);
            const response = await authApi.register(userData);
            dispatch({ type: 'SET_LOADING', payload: false });

            console.log('✅ Registration successful:', response.username);
        } catch (error: any) {
            const errorMessage = parseErrorMessage(error);
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            dispatch({ type: 'SET_LOADING', payload: false });

            console.error('❌ Registration failed:', errorMessage);
            console.error('Full error:', error);

            // Re-throw error with properly formatted message
            const formattedError = new Error(errorMessage);
            (formattedError as any).response = error.response;
            (formattedError as any).status = error.response?.status || error.status_code;
            throw formattedError;
        }
    }, []);

    const logout = useCallback(() => {
        authApi.clearToken();
        dispatch({ type: 'SET_AUTHENTICATED', payload: false });
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_CLOSURES', payload: [] });
        dispatch({ type: 'SET_SELECTED_CLOSURE', payload: null });
        dispatch({ type: 'SET_EDITING_CLOSURE', payload: null });

        toast.success('Logged out successfully. See you next time! 👋', {
            icon: '✅',
            duration: 3000
        });
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
            const errorMessage = parseErrorMessage(error);
            dispatch({ type: 'SET_ERROR', payload: errorMessage });

            if (!authApi.isTokenValid()) {
                toast.error('Authentication required. Using demo data.', {
                    icon: '🔐',
                    duration: 4000
                });
                console.log('📍 Using demo data due to auth issue');
            } else {
                toast.error(`Failed to load closures: ${errorMessage}`, {
                    icon: '❌',
                    duration: 4000
                });
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

            toast.success('Road closure reported successfully! ✅', {
                icon: '🛣️',
                duration: 4000
            });
            console.log('✅ Closure created successfully:', newClosure.id);
        } catch (error) {
            const errorMessage = parseErrorMessage(error);
            dispatch({ type: 'SET_ERROR', payload: errorMessage });

            if (error instanceof Error && (error.message.includes('401') || error.message.includes('Authentication'))) {
                toast.error('Please log in to create closures.', {
                    icon: '🔐',
                    duration: 5000
                });
                logout();
            } else if (error instanceof Error && error.message.includes('validation')) {
                toast.error('Please check your input data and try again.', {
                    icon: '⚠️',
                    duration: 4000
                });
            } else {
                toast.error(`Failed to create closure: ${errorMessage}`, {
                    icon: '❌',
                    duration: 4000
                });
            }

            console.error('❌ Error creating closure:', errorMessage);
            throw error;
        }
    }, [logout]);

    const updateClosure = useCallback(async (id: number, data: UpdateClosureData) => {
        dispatch({ type: 'SET_EDIT_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            if (!authApi.isTokenValid()) {
                throw new Error('Authentication required. Please log in to update closures.');
            }

            console.log('📝 Attempting to update closure:', {
                id,
                updates: Object.keys(data),
                auth: !!authApi.getToken()
            });

            const updatedClosure = await closuresApi.updateClosure(id, data);
            dispatch({ type: 'UPDATE_CLOSURE', payload: updatedClosure });
            dispatch({ type: 'SET_EDIT_LOADING', payload: false });

            toast.success('Closure updated successfully! ✅', {
                icon: '📝',
                duration: 3000
            });
            console.log('✅ Closure updated successfully:', id);
        } catch (error) {
            const errorMessage = parseErrorMessage(error);
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            dispatch({ type: 'SET_EDIT_LOADING', payload: false });

            if (error instanceof Error && (error.message.includes('401') || error.message.includes('Authentication'))) {
                toast.error('Please log in to update closures.', {
                    icon: '🔐',
                    duration: 5000
                });
                logout();
            } else if (error instanceof Error && error.message.includes('403')) {
                toast.error('You do not have permission to edit this closure.', {
                    icon: '🚫',
                    duration: 4000
                });
            } else if (error instanceof Error && error.message.includes('404')) {
                toast.error('Closure not found. It may have been deleted.', {
                    icon: '❓',
                    duration: 4000
                });
            } else {
                toast.error(`Failed to update closure: ${errorMessage}`, {
                    icon: '❌',
                    duration: 4000
                });
            }

            console.error('❌ Error updating closure:', errorMessage);
            throw error;
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

            toast.success('Closure deleted successfully! 🗑️', {
                icon: '✅',
                duration: 3000
            });
            console.log('✅ Closure deleted successfully:', id);
        } catch (error) {
            const errorMessage = parseErrorMessage(error);
            dispatch({ type: 'SET_ERROR', payload: errorMessage });

            if (error instanceof Error && (error.message.includes('401') || error.message.includes('Authentication'))) {
                toast.error('Please log in to delete closures.', {
                    icon: '🔐',
                    duration: 5000
                });
                logout();
            } else {
                toast.error(`Failed to delete closure: ${errorMessage}`, {
                    icon: '❌',
                    duration: 4000
                });
            }

            console.error('❌ Error deleting closure:', errorMessage);
            throw error;
        }
    }, [logout]);

    const selectClosure = useCallback((closure: Closure | null) => {
        dispatch({ type: 'SET_SELECTED_CLOSURE', payload: closure });
    }, []);

    const startEditingClosure = useCallback(async (closureId: number) => {
        dispatch({ type: 'SET_EDIT_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            console.log('🔄 Starting to edit closure:', closureId);
            const closure = await closuresApi.getClosure(closureId);
            dispatch({ type: 'SET_EDITING_CLOSURE', payload: closure });
            dispatch({ type: 'SET_EDIT_LOADING', payload: false });
            console.log('✅ Closure loaded for editing:', closure.id);
        } catch (error) {
            const errorMessage = parseErrorMessage(error);
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            dispatch({ type: 'SET_EDIT_LOADING', payload: false });

            toast.error(`Failed to load closure: ${errorMessage}`, {
                icon: '❌',
                duration: 4000
            });
            console.error('❌ Error loading closure for editing:', errorMessage);
        }
    }, []);

    const stopEditingClosure = useCallback(() => {
        dispatch({ type: 'SET_EDITING_CLOSURE', payload: null });
        console.log('🔄 Stopped editing closure');
    }, []);

    const canEditClosure = useCallback((closure: Closure): boolean => {
        if (!state.isAuthenticated || !state.user) {
            return false;
        }

        // Users can edit their own closures or moderators can edit any closure
        return closure.submitter_id === state.user.id || state.user.is_moderator;
    }, [state.isAuthenticated, state.user]);

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
        startEditingClosure,
        stopEditingClosure,
        canEditClosure,
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