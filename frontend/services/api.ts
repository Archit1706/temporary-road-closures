// services/api.ts
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
        }
    }
    return config;
});

// Updated types to match backend API
export interface Closure {
    id: number;
    geometry: {
        type: 'LineString' | 'Point';
        coordinates: number[][]; // Backend always returns array of coordinate pairs
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
}

export interface CreateClosureData {
    geometry: {
        type: 'LineString' | 'Point';
        coordinates: number[][];
    };
    start_time: string;
    end_time: string;
    description: string;
    closure_type: 'construction' | 'accident' | 'event' | 'maintenance' | 'weather' | 'emergency' | 'other';
    source: string;
    confidence_level: number;
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
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

// Updated types to match your backend response
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

// Authentication functions
export const authApi = {
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
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    setToken: (token: string) => {
        if (isBrowser) {
            localStorage.setItem('auth_token', token);
        }
    },

    getToken: (): string | null => {
        if (isBrowser) {
            return localStorage.getItem('auth_token');
        }
        return null;
    },

    clearToken: () => {
        if (isBrowser) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        }
    },

    setUserData: (user: LoginResponse['user']) => {
        if (isBrowser) {
            localStorage.setItem('user_data', JSON.stringify(user));
        }
    },

    getUserData: (): LoginResponse['user'] | null => {
        if (isBrowser) {
            const userData = localStorage.getItem('user_data');
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    }
};

// Real API functions
const realApi = {
    getClosures: async (bbox?: BoundingBox, page: number = 1, size: number = 50): Promise<PaginatedResponse<Closure>> => {
        try {
            const params: any = {
                valid_only: false,
                page,
                size
            };

            // Note: Backend doesn't seem to support bbox filtering yet
            // You might need to add this to the backend API
            if (bbox) {
                // params.bbox = `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`;
            }

            const response = await api.get('/api/v1/closures/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching closures:', error);
            throw error;
        }
    },

    getClosure: async (id: number): Promise<Closure> => {
        try {
            const response = await api.get(`/api/v1/closures/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching closure:', error);
            throw error;
        }
    },

    createClosure: async (data: CreateClosureData): Promise<Closure> => {
        try {
            const response = await api.post('/api/v1/closures/', data);
            return response.data;
        } catch (error) {
            console.error('Error creating closure:', error);
            throw error;
        }
    },

    updateClosure: async (id: number, data: Partial<CreateClosureData>): Promise<Closure> => {
        try {
            const response = await api.put(`/api/v1/closures/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating closure:', error);
            throw error;
        }
    },

    deleteClosure: async (id: number): Promise<void> => {
        try {
            await api.delete(`/api/v1/closures/${id}`);
        } catch (error) {
            console.error('Error deleting closure:', error);
            throw error;
        }
    },

    getClosureStats: async (): Promise<ClosureStats> => {
        try {
            // This endpoint might not exist yet, you may need to implement it
            const response = await api.get('/api/v1/closures/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching closure stats:', error);
            // Return calculated stats from closures if stats endpoint doesn't exist
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
        totalDuration: Math.round(totalDuration * 10) / 10
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
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        backendAvailable = response.ok;
    } catch (error) {
        console.log('Backend not available, using mock data for demo');
        backendAvailable = false;
    }

    useRealApi = backendAvailable && !USE_MOCK_API && !!authApi.getToken();
    return backendAvailable;
};

// Main API object that switches between real and mock
export const closuresApi = {
    getClosures: async (bbox?: BoundingBox, page: number = 1, size: number = 50): Promise<Closure[]> => {
        if (USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.getToken()) {
            console.log('📍 Using mock data for closures');
            // Convert mock API response to match new format
            const mockResponse = await mockClosuresApi.getClosures(bbox);
            return mockResponse.map(convertMockToBackendFormat);
        }

        const response = await realApi.getClosures(bbox, page, size);
        return response.items;
    },

    getClosure: async (id: number): Promise<Closure> => {
        if (USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.getToken()) {
            const mockResponse = await mockClosuresApi.getClosure(id.toString());
            return convertMockToBackendFormat(mockResponse);
        }
        return realApi.getClosure(id);
    },

    createClosure: async (data: CreateClosureData): Promise<Closure> => {
        if (USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.getToken()) {
            console.log('📝 Creating closure with mock API');
            const mockData = convertBackendToMockFormat(data);
            const mockResponse = await mockClosuresApi.createClosure(mockData);
            return convertMockToBackendFormat(mockResponse);
        }
        return realApi.createClosure(data);
    },

    updateClosure: async (id: number, data: Partial<CreateClosureData>): Promise<Closure> => {
        if (USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.getToken()) {
            const mockData = convertBackendToMockFormat(data as CreateClosureData);
            const mockResponse = await mockClosuresApi.updateClosure(id.toString(), mockData);
            return convertMockToBackendFormat(mockResponse);
        }
        return realApi.updateClosure(id, data);
    },

    deleteClosure: async (id: number): Promise<void> => {
        if (USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.getToken()) {
            return mockClosuresApi.deleteClosure(id.toString());
        }
        return realApi.deleteClosure(id);
    },

    getClosureStats: async (): Promise<ClosureStats> => {
        if (USE_MOCK_API || !(await checkBackendAvailability()) || !authApi.getToken()) {
            console.log('📊 Using mock data for statistics');
            const mockStats = await mockClosuresApi.getClosureStats();
            return convertMockStatsToBackendFormat(mockStats);
        }
        return realApi.getClosureStats();
    },

    // Utility functions for demo
    isUsingMockData: (): boolean => {
        return USE_MOCK_API || !useRealApi || !authApi.getToken();
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
    } => {
        return {
            usingMock: USE_MOCK_API || !useRealApi || !authApi.getToken(),
            backendUrl: API_BASE_URL,
            forceMock: USE_MOCK_API,
            backendAvailable,
            hasAuthToken: !!authApi.getToken()
        };
    }
};

// Conversion functions between mock and backend formats
function convertMockToBackendFormat(mockClosure: any): Closure {
    // Ensure coordinates are in the correct format for backend
    let coordinates: number[][];

    if (mockClosure.geometry.type === 'Point') {
        // Convert Point coordinates from [lng, lat] to [[lng, lat]]
        if (Array.isArray(mockClosure.geometry.coordinates[0])) {
            // Already in correct format
            coordinates = mockClosure.geometry.coordinates;
        } else {
            // Convert from [lng, lat] to [[lng, lat]]
            coordinates = [mockClosure.geometry.coordinates];
        }
    } else {
        // LineString coordinates should already be [[lng, lat], [lng, lat], ...]
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
        duration_hours: Math.round((new Date(mockClosure.end_time).getTime() - new Date(mockClosure.start_time).getTime()) / (1000 * 60 * 60))
    };
}

function convertBackendToMockFormat(backendData: any): any {
    // Convert coordinates back to mock format if needed
    let coordinates;

    if (backendData.geometry.type === 'Point') {
        // Convert from [[lng, lat]] to [lng, lat] for mock format
        if (Array.isArray(backendData.geometry.coordinates[0])) {
            coordinates = backendData.geometry.coordinates[0];
        } else {
            coordinates = backendData.geometry.coordinates;
        }
    } else {
        // LineString coordinates stay the same
        coordinates = backendData.geometry.coordinates;
    }

    return {
        geometry: {
            type: backendData.geometry.type,
            coordinates: coordinates
        },
        start_time: backendData.start_time,
        end_time: backendData.end_time,
        description: backendData.description,
        reason: backendData.closure_type,
        submitter: backendData.source,
        severity: 'medium', // Default since backend doesn't have this
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
        totalDuration: mockStats.totalDuration
    };
}

export { authApi };
export default api;