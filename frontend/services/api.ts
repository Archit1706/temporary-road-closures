// services/api.ts - Updated with proper edit support
import axios from 'axios';
import { mockClosuresApi } from './mockApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || false;

// Create axios instance for real API
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
    // Get token from localStorage (only in browser)
    if (typeof window !== 'undefined') {
        const token = authApi.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Auth token added to request:', token.substring(0, 20) + '...');
        } else {
            console.warn('⚠️ No auth token found for API request');
        }
    }
    return config;
}, (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
});

// Add response interceptor for auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('🚫 401 Unauthorized - Token may be expired');
            // Clear invalid token
            if (typeof window !== 'undefined') {
                authApi.clearToken();
                // Dispatch custom event to notify components
                window.dispatchEvent(new CustomEvent('auth:token-expired'));
            }
        }
        return Promise.reject(error);
    }
);

// Updated types to match backend API with bidirectional support
export interface Closure {
    id: number;
    geometry: {
        type: 'LineString' | 'Point';
        coordinates: number[][];
    };
    start_time: string;
    end_time: string;
    description: string;
    closure_type: 'construction' | 'accident' | 'event' | 'maintenance' | 'weather' | 'emergency' | 'other';
    status: 'active' | 'inactive' | 'expired';
    source: string;
    confidence_level: number;
    submitter_id: number;
    created_at: string;
    updated_at: string;
    openlr_code?: string;
    is_valid: boolean;
    duration_hours: number;
    is_bidirectional?: boolean;
}

export interface CreateClosureData {
    geometry: {
        type: 'LineString' | 'Point';
        coordinates: number[][] | number[];
    };
    start_time: string;
    end_time: string;
    description: string;
    closure_type: 'construction' | 'accident' | 'event' | 'maintenance' | 'weather' | 'emergency' | 'other';
    source: string;
    confidence_level: number;
    is_bidirectional?: boolean;
}

export interface UpdateClosureData {
    geometry?: {
        type: 'LineString' | 'Point';
        coordinates: number[][];
    };
    start_time?: string;
    end_time?: string;
    description?: string;
    closure_type?: 'construction' | 'accident' | 'event' | 'maintenance' | 'weather' | 'emergency' | 'other';
    status?: 'active' | 'inactive' | 'expired';
    source?: string;
    confidence_level?: number;
    is_bidirectional?: boolean;
}

export interface BoundingBox {
    north: number;
    south: number;
    east: number;
    west: number;
}

export interface ClosureStats {
    total: number;
    active: number;
    upcoming: number;
    expired: number;
    byClosureType: Record<string, number>;
    byStatus: Record<string, number>;
    byTimeOfDay: Record<string, number>;
    averageDuration: number;
    totalDuration: number;
    byDirection?: {
        bidirectional: number;
        unidirectional: number;
        point: number;
    };
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

// Helper function to calculate bearing between two points (in degrees)
export const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    // Convert to radians
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const deltaLng = (lng2 - lng1) * Math.PI / 180;

    const y = Math.sin(deltaLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLng);

    let bearing = Math.atan2(y, x) * 180 / Math.PI;

    // Normalize to 0-360 degrees
    bearing = (bearing + 360) % 360;

    return bearing;
};

export const calculateSimpleDirection = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const deltaLat = lat2 - lat1;  // Positive = North, Negative = South
    const deltaLng = lng2 - lng1;  // Positive = East, Negative = West

    // Calculate angle from coordinate differences
    let angle = Math.atan2(deltaLng, deltaLat) * 180 / Math.PI;

    // Convert to compass bearing (0° = North, 90° = East, 180° = South, 270° = West)
    let bearing = (90 - angle) % 360;
    if (bearing < 0) bearing += 360;

    return bearing;
};

// Helper function to get direction label from bearing
export const getDirectionFromBearing = (bearing: number): string => {
    // Normalize bearing to 0-360
    bearing = ((bearing % 360) + 360) % 360;

    if (bearing >= 337.5 || bearing < 22.5) return 'N';
    if (bearing >= 22.5 && bearing < 67.5) return 'NE';
    if (bearing >= 67.5 && bearing < 112.5) return 'E';
    if (bearing >= 112.5 && bearing < 157.5) return 'SE';
    if (bearing >= 157.5 && bearing < 202.5) return 'S';
    if (bearing >= 202.5 && bearing < 247.5) return 'SW';
    if (bearing >= 247.5 && bearing < 292.5) return 'W';
    if (bearing >= 292.5 && bearing < 337.5) return 'NW';
    return 'N';
};

// Helper function to get arrow Unicode character for direction
export const getDirectionArrow = (bearing: number): string => {
    // Normalize bearing to 0-360
    bearing = ((bearing % 360) + 360) % 360;

    if (bearing >= 337.5 || bearing < 22.5) return '↑'; // North
    if (bearing >= 22.5 && bearing < 67.5) return '↗'; // Northeast
    if (bearing >= 67.5 && bearing < 112.5) return '→'; // East
    if (bearing >= 112.5 && bearing < 157.5) return '↘'; // Southeast
    if (bearing >= 157.5 && bearing < 202.5) return '↓'; // South
    if (bearing >= 202.5 && bearing < 247.5) return '↙'; // Southwest
    if (bearing >= 247.5 && bearing < 292.5) return '←'; // West
    if (bearing >= 292.5 && bearing < 337.5) return '↖'; // Northwest
    return '↑';
};

// Helper function to get direction description for a LineString
export const getClosureDirection = (closure: Closure): string => {
    if (closure.geometry.type === 'Point') {
        return 'Point closure';
    }

    if (closure.is_bidirectional) {
        return 'Bidirectional';
    }

    // Calculate overall direction for LineString
    const coordinates = closure.geometry.coordinates;
    if (coordinates.length >= 2) {
        const [startLng, startLat] = coordinates[0];
        const [endLng, endLat] = coordinates[coordinates.length - 1];
        const bearing = calculateBearing(startLat, startLng, endLat, endLng);
        const direction = getDirectionFromBearing(bearing);
        return `${direction}bound`;
    }

    return 'Unidirectional';
};

export const debugDirections = () => {
    console.log('=== Direction Debug Tests ===');

    // Test horizontal movement (East - left to right)
    const eastBearing = calculateSimpleDirection(41.8781, -87.6298, 41.8781, -87.6280);
    console.log('East (left→right):', eastBearing, '→', getDirectionArrow(eastBearing));

    // Test horizontal movement (West - right to left)
    const westBearing = calculateSimpleDirection(41.8781, -87.6280, 41.8781, -87.6298);
    console.log('West (right→left):', westBearing, '→', getDirectionArrow(westBearing));

    // Test vertical movement (South - top to bottom)
    const southBearing = calculateSimpleDirection(41.8781, -87.6298, 41.8760, -87.6298);
    console.log('South (top→bottom):', southBearing, '→', getDirectionArrow(southBearing));

    // Test vertical movement (North - bottom to top)
    const northBearing = calculateSimpleDirection(41.8760, -87.6298, 41.8781, -87.6298);
    console.log('North (bottom→top):', northBearing, '→', getDirectionArrow(northBearing));

    console.log('=== End Debug Tests ===');
};

export const getDirectionArrowFromCoords = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const deltaLat = lat2 - lat1;  // Positive = North, Negative = South
    const deltaLng = lng2 - lng1;  // Positive = East, Negative = West

    // Determine primary direction based on larger delta
    const absLat = Math.abs(deltaLat);
    const absLng = Math.abs(deltaLng);

    // If movement is primarily horizontal
    if (absLng > absLat * 1.5) {
        if (deltaLng > 0) return '→'; // East (left to right)
        else return '←'; // West (right to left)
    }
    // If movement is primarily vertical
    else if (absLat > absLng * 1.5) {
        if (deltaLat > 0) return '↑'; // North (bottom to top)
        else return '↓'; // South (top to bottom)
    }
    // Diagonal movement
    else {
        if (deltaLat > 0 && deltaLng > 0) return '↗'; // Northeast
        if (deltaLat > 0 && deltaLng < 0) return '↖'; // Northwest
        if (deltaLat < 0 && deltaLng > 0) return '↘'; // Southeast
        if (deltaLat < 0 && deltaLng < 0) return '↙'; // Southwest
    }

    return '→'; // Default fallback
};

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
        username: string;
        email: string;
        full_name: string;
        id: number;
        is_active: boolean;
        is_moderator: boolean;
        is_verified: boolean;
        last_login_at: string;
        created_at: string;
    };
}

interface RegisterRequest {
    email: string;
    full_name: string;
    password: string;
    username: string;
}

interface RegisterResponse {
    username: string;
    email: string;
    full_name: string;
    id: number;
    is_active: boolean;
    is_moderator: boolean;
    is_verified: boolean;
    last_login_at: string;
    created_at: string;
}

// Authentication functions
export const authApi = {
    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const response = await api.post('/api/v1/auth/register', userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    login: async (username: string, password: string): Promise<LoginResponse> => {
        try {
            // Create form data for OAuth2 login
            const formData = new URLSearchParams();
            formData.append('grant_type', '');
            formData.append('username', username);
            formData.append('password', password);
            formData.append('scope', '');
            formData.append('client_id', '');
            formData.append('client_secret', '');

            const response = await api.post('/api/v1/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });
            console.log('✅ Login successful, token received');
            return response.data;
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    },

    setToken: (token: string) => {
        if (isBrowser) {
            localStorage.setItem('auth_token', token);
            console.log('💾 Token stored in localStorage');
        }
    },

    getToken: (): string | null => {
        if (isBrowser) {
            const token = localStorage.getItem('auth_token');
            if (token) {
                console.log('🔍 Token retrieved from localStorage:', token.substring(0, 20) + '...');
            } else {
                console.log('❌ No token found in localStorage');
            }
            return token;
        }
        return null;
    },

    clearToken: () => {
        if (isBrowser) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            console.log('🗑️ Token and user data cleared from localStorage');
        }
    },

    setUserData: (user: LoginResponse['user']) => {
        if (isBrowser) {
            localStorage.setItem('user_data', JSON.stringify(user));
            console.log('💾 User data stored:', user.username);
        }
    },

    getUserData: (): LoginResponse['user'] | null => {
        if (isBrowser) {
            const userData = localStorage.getItem('user_data');
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    },

    // Check if token is expired (basic check)
    isTokenValid: (): boolean => {
        const token = authApi.getToken();
        if (!token) {
            console.log('❌ No token found');
            return false;
        }

        try {
            // Basic JWT payload check (not secure, just for UX)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            const isValid = payload.exp > now;

            if (!isValid) {
                console.warn('🕐 Token has expired at:', new Date(payload.exp * 1000));
                authApi.clearToken();
            } else {
                console.log('✅ Token is valid, expires at:', new Date(payload.exp * 1000));
            }

            return isValid;
        } catch (error) {
            console.error('❌ Error checking token validity:', error);
            authApi.clearToken();
            return false;
        }
    }
};

// Real API functions
const realApi = {
    // get all the closures with pagination
    getClosuresWithPagination: async (bbox?: BoundingBox, page: number = 1, size: number = 50): Promise<PaginatedResponse<Closure>> => {
        try {
            const params: any = {
                valid_only: false,
                page,
                size
            };

            const response = await api.get('/api/v1/closures/', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching closures:', error);
            throw error;
        }
    },

    // get all the closures
    getClosures: async (bbox?: BoundingBox): Promise<PaginatedResponse<Closure>> => {
        try {
            const params: any = {
                valid_only: false,
                bbox: bbox ? `${bbox.west},${bbox.south},${bbox.east},${bbox.north}` : undefined,
                page: 1,
                size: 1000 // get all the closures
            };

            const response = await api.get('/api/v1/closures/', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching closures:', error);
            throw error;
        }
    },

    getClosure: async (id: number): Promise<Closure> => {
        try {
            console.log(`🔍 Fetching closure with ID: ${id}`);
            const response = await api.get(`/api/v1/closures/${id}`);
            console.log('✅ Closure fetched successfully:', response.data.id);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching closure:', error);
            if (error.response?.status === 404) {
                throw new Error(`Closure with ID ${id} not found`);
            }
            throw error;
        }
    },

    createClosure: async (data: CreateClosureData): Promise<Closure> => {
        try {
            console.log('📤 Creating closure with data:', JSON.stringify(data, null, 2));

            // Check token before making request
            if (!authApi.isTokenValid()) {
                throw new Error('Authentication token is missing or expired. Please log in again.');
            }

            const response = await api.post('/api/v1/closures/', data);
            console.log('✅ Closure created successfully:', response.data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                console.error('🚫 Authentication failed - token may be expired');
                throw new Error('Authentication failed. Please log in again.');
            }
            console.error('❌ Error creating closure:', error);
            throw error;
        }
    },

    updateClosure: async (id: number, data: UpdateClosureData): Promise<Closure> => {
        try {
            console.log(`📝 Updating closure ${id} with data:`, JSON.stringify(data, null, 2));

            if (!authApi.isTokenValid()) {
                throw new Error('Authentication token is missing or expired. Please log in again.');
            }

            const response = await api.put(`/api/v1/closures/${id}`, data);
            console.log('✅ Closure updated successfully:', response.data);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                console.error('🚫 Authentication failed - token may be expired');
                throw new Error('Authentication failed. Please log in again.');
            }
            if (error.response?.status === 403) {
                throw new Error('You do not have permission to edit this closure.');
            }
            if (error.response?.status === 404) {
                throw new Error(`Closure with ID ${id} not found.`);
            }
            console.error('❌ Error updating closure:', error);
            throw error;
        }
    },

    deleteClosure: async (id: number): Promise<void> => {
        try {
            if (!authApi.isTokenValid()) {
                throw new Error('Authentication token is missing or expired. Please log in again.');
            }

            await api.delete(`/api/v1/closures/${id}`);
            console.log('✅ Closure deleted successfully:', id);
        } catch (error) {
            console.error('❌ Error deleting closure:', error);
            throw error;
        }
    },

    getClosureStats: async (): Promise<ClosureStats> => {
        try {
            const response = await api.get('/api/v1/closures/stats');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching closure stats:', error);
            const closuresResponse = await realApi.getClosures();
            return calculateStatsFromClosures(closuresResponse.items);
        }
    }
};

// Helper function to calculate stats from closures if no dedicated endpoint
function calculateStatsFromClosures(closures: Closure[]): ClosureStats {
    const now = new Date();

    const active = closures.filter(c => c.status === 'active').length;
    const expired = closures.filter(c => c.status === 'expired').length;
    const upcoming = closures.filter(c => {
        const start = new Date(c.start_time);
        return start > now;
    }).length;

    const byClosureType = closures.reduce((acc, closure) => {
        acc[closure.closure_type] = (acc[closure.closure_type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const byStatus = closures.reduce((acc, closure) => {
        acc[closure.status] = (acc[closure.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Calculate direction statistics
    const lineStringClosures = closures.filter(c => c.geometry.type === 'LineString');
    const bidirectionalCount = lineStringClosures.filter(c => c.is_bidirectional === true).length;
    const unidirectionalCount = lineStringClosures.filter(c => c.is_bidirectional === false).length;
    const pointCount = closures.filter(c => c.geometry.type === 'Point').length;

    const totalDuration = closures.reduce((sum, closure) => sum + closure.duration_hours, 0);
    const averageDuration = closures.length > 0 ? totalDuration / closures.length : 0;

    return {
        total: closures.length,
        active,
        upcoming,
        expired,
        byClosureType,
        byStatus,
        byTimeOfDay: {
            morning: Math.floor(closures.length * 0.25),
            afternoon: Math.floor(closures.length * 0.35),
            evening: Math.floor(closures.length * 0.25),
            night: Math.floor(closures.length * 0.15)
        },
        averageDuration: Math.round(averageDuration * 10) / 10,
        totalDuration: Math.round(totalDuration * 10) / 10,
        byDirection: {
            bidirectional: bidirectionalCount,
            unidirectional: unidirectionalCount,
            point: pointCount
        }
    };
}

// Auto-detect if backend is available
let useRealApi = !USE_MOCK_API;
let backendAvailable: boolean | null = null;

const checkBackendAvailability = async (): Promise<boolean> => {
    if (backendAvailable !== null) {
        return backendAvailable;
    }

    // Skip backend check during SSR
    if (!isBrowser) {
        backendAvailable = false;
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(5000)
        });
        backendAvailable = response.ok;
        console.log('🏥 Backend health check:', backendAvailable ? 'Available' : 'Unavailable');
    } catch (error) {
        console.log('🏥 Backend not available, using mock data for demo');
        backendAvailable = false;
    }

    useRealApi = backendAvailable && !USE_MOCK_API;
    return backendAvailable;
};

// Main API object that switches between real and mock
export const closuresApi = {
    getClosures: async (bbox?: BoundingBox, page: number = 1, size: number = 50): Promise<Closure[]> => {
        const shouldUseMock = USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.isTokenValid();

        if (shouldUseMock) {
            console.log('📍 Using mock data for closures');
            const mockResponse = await mockClosuresApi.getClosures(bbox);
            return mockResponse.map(convertMockToBackendFormat);
        }

        const response = await realApi.getClosures(bbox, page, size);
        return response.items;
    },

    getClosure: async (id: number): Promise<Closure> => {
        const shouldUseMock = USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.isTokenValid();

        if (shouldUseMock) {
            const mockResponse = await mockClosuresApi.getClosure(id.toString());
            return convertMockToBackendFormat(mockResponse);
        }
        return realApi.getClosure(id);
    },

    createClosure: async (data: CreateClosureData): Promise<Closure> => {
        const shouldUseMock = USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.isTokenValid();

        if (shouldUseMock) {
            console.log('📝 Creating closure with mock API');
            const mockData = convertBackendToMockFormat(data);
            const mockResponse = await mockClosuresApi.createClosure(mockData);
            return convertMockToBackendFormat(mockResponse);
        }

        console.log('📝 Creating closure with real API');
        return realApi.createClosure(data);
    },

    updateClosure: async (id: number, data: UpdateClosureData): Promise<Closure> => {
        const shouldUseMock = USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.isTokenValid();

        if (shouldUseMock) {
            console.log('📝 Updating closure with mock API');
            const mockData = convertBackendToMockFormat(data as CreateClosureData);
            const mockResponse = await mockClosuresApi.updateClosure(id.toString(), mockData);
            return convertMockToBackendFormat(mockResponse);
        }

        console.log('📝 Updating closure with real API');
        return realApi.updateClosure(id, data);
    },

    deleteClosure: async (id: number): Promise<void> => {
        const shouldUseMock = USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.isTokenValid();

        if (shouldUseMock) {
            return mockClosuresApi.deleteClosure(id.toString());
        }
        return realApi.deleteClosure(id);
    },

    getClosureStats: async (): Promise<ClosureStats> => {
        const shouldUseMock = USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.isTokenValid();

        if (shouldUseMock) {
            console.log('📊 Using mock data for statistics');
            const mockStats = await mockClosuresApi.getClosureStats();
            return convertMockStatsToBackendFormat(mockStats);
        }
        return realApi.getClosureStats();
    },

    // Utility functions for demo
    isUsingMockData: (): boolean => {
        return USE_MOCK_API || !useRealApi || !authApi.isTokenValid();
    },

    resetMockData: async (): Promise<void> => {
        if (USE_MOCK_API || !useRealApi) {
            return mockClosuresApi.resetData();
        }
        throw new Error('Reset is only available when using mock data');
    },

    getApiStatus: (): {
        usingMock: boolean;
        backendUrl: string;
        forceMock: boolean;
        backendAvailable: boolean | null;
        hasAuthToken: boolean;
        tokenValid: boolean;
    } => {
        const hasToken = !!authApi.getToken();
        const tokenValid = authApi.isTokenValid();

        return {
            usingMock: USE_MOCK_API || !useRealApi || !tokenValid,
            backendUrl: API_BASE_URL,
            forceMock: USE_MOCK_API,
            backendAvailable,
            hasAuthToken: hasToken,
            tokenValid
        };
    }
};

// Conversion functions between mock and backend formats
function convertMockToBackendFormat(mockClosure: any): Closure {
    let coordinates: number[][];

    if (mockClosure.geometry.type === 'Point') {
        if (Array.isArray(mockClosure.geometry.coordinates[0])) {
            coordinates = mockClosure.geometry.coordinates;
        } else {
            coordinates = [mockClosure.geometry.coordinates];
        }
    } else {
        coordinates = mockClosure.geometry.coordinates;
    }

    return {
        id: parseInt(mockClosure.id.replace('closure-', '')),
        geometry: {
            type: mockClosure.geometry.type,
            coordinates: coordinates
        },
        start_time: mockClosure.start_time,
        end_time: mockClosure.end_time,
        description: mockClosure.description,
        closure_type: mockClosure.reason,
        status: mockClosure.status,
        source: mockClosure.submitter,
        confidence_level: 9,
        submitter_id: 1,
        created_at: mockClosure.created_at,
        updated_at: mockClosure.updated_at,
        openlr_code: mockClosure.openlr,
        is_valid: true,
        duration_hours: Math.round((new Date(mockClosure.end_time).getTime() - new Date(mockClosure.start_time).getTime()) / (1000 * 60 * 60)),
        is_bidirectional: mockClosure.is_bidirectional // Add bidirectional field
    };
}

function convertBackendToMockFormat(backendData: any): any {
    let coordinates;

    if (backendData.geometry?.type === 'Point') {
        if (Array.isArray(backendData.geometry.coordinates[0])) {
            coordinates = backendData.geometry.coordinates[0];
        } else {
            coordinates = backendData.geometry.coordinates;
        }
    } else if (backendData.geometry?.type === 'LineString') {
        coordinates = backendData.geometry.coordinates;
    }

    return {
        geometry: backendData.geometry ? {
            type: backendData.geometry.type,
            coordinates: coordinates
        } : undefined,
        start_time: backendData.start_time,
        end_time: backendData.end_time,
        description: backendData.description,
        reason: backendData.closure_type,
        submitter: backendData.source,
        severity: 'medium',
        is_bidirectional: backendData.is_bidirectional // Add bidirectional field
    };
}

function convertMockStatsToBackendFormat(mockStats: any): ClosureStats {
    return {
        total: mockStats.total,
        active: mockStats.active,
        upcoming: mockStats.upcoming,
        expired: mockStats.expired,
        byClosureType: mockStats.byReason,
        byStatus: {
            active: mockStats.active,
            inactive: mockStats.expired,
            expired: mockStats.expired
        },
        byTimeOfDay: mockStats.byTimeOfDay,
        averageDuration: mockStats.averageDuration,
        totalDuration: mockStats.totalDuration,
        // Add direction statistics
        byDirection: mockStats.byDirection || {
            bidirectional: 0,
            unidirectional: 0,
            point: 0
        }
    };
}

export { realApi };
export default api;