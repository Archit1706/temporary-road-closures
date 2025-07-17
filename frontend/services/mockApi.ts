// services/mockApi.ts
import {
    Closure,
    CreateClosureData,
    BoundingBox,
    ClosureStats
} from './api';
import {
    mockClosures,
    mockClosureStats,
    filterClosuresByBounds,
    simulateApiDelay
} from '../data/mockClosures';

// In-memory storage for demo (resets on page refresh)
let closuresStorage: Closure[] = [...mockClosures];
let nextId = 1000;

// Generate a unique ID for new closures
const generateId = (): string => {
    return `closure-${(++nextId).toString().padStart(3, '0')}`;
};

// Generate current timestamp
const getCurrentTimestamp = (): string => {
    return new Date().toISOString();
};

// Determine closure status based on timestamps
const determineStatus = (startTime: string, endTime: string): 'active' | 'inactive' => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now >= start && now <= end) {
        return 'active';
    }
    return 'inactive';
};

export const mockClosuresApi = {
    // Get closures within a bounding box
    getClosures: async (bbox?: BoundingBox): Promise<Closure[]> => {
        await simulateApiDelay();

        let filteredClosures = closuresStorage;

        if (bbox) {
            filteredClosures = filterClosuresByBounds(closuresStorage, bbox);
        }

        // Update status based on current time
        filteredClosures = filteredClosures.map(closure => ({
            ...closure,
            status: determineStatus(closure.start_time, closure.end_time)
        }));

        // Sort by created_at (newest first)
        return filteredClosures.sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    },

    // Get a specific closure by ID
    getClosure: async (id: string): Promise<Closure> => {
        await simulateApiDelay(300);

        const closure = closuresStorage.find(c => c.id === id);
        if (!closure) {
            throw new Error(`Closure with ID ${id} not found`);
        }

        return {
            ...closure,
            status: determineStatus(closure.start_time, closure.end_time)
        };
    },

    // Create a new closure
    createClosure: async (data: CreateClosureData): Promise<Closure> => {
        await simulateApiDelay(600);

        const now = getCurrentTimestamp();
        const newClosure: Closure = {
            id: generateId(),
            geometry: data.geometry,
            start_time: data.start_time,
            end_time: data.end_time,
            description: data.description,
            reason: data.reason,
            status: determineStatus(data.start_time, data.end_time),
            submitter: data.submitter,
            severity: data.severity as 'low' | 'medium' | 'high' | 'critical',
            created_at: now,
            updated_at: now,
            // Generate a mock OpenLR string
            openlr: `CwRbWyNG9RpsCQC${Math.random().toString(36).substr(2, 4)}=`
        };

        closuresStorage.unshift(newClosure); // Add to beginning
        return newClosure;
    },

    // Update a closure
    updateClosure: async (id: string, data: Partial<CreateClosureData>): Promise<Closure> => {
        await simulateApiDelay(500);

        const closureIndex = closuresStorage.findIndex(c => c.id === id);
        if (closureIndex === -1) {
            throw new Error(`Closure with ID ${id} not found`);
        }

        const existingClosure = closuresStorage[closureIndex];
        const updatedClosure: Closure = {
            ...existingClosure,
            ...data,
            severity: data.severity as 'low' | 'medium' | 'high' | 'critical' | undefined,
            id: existingClosure.id, // Ensure ID doesn't change
            created_at: existingClosure.created_at, // Preserve creation time
            updated_at: getCurrentTimestamp(),
            status: data.start_time && data.end_time
                ? determineStatus(data.start_time, data.end_time)
                : determineStatus(existingClosure.start_time, existingClosure.end_time)
        };

        closuresStorage[closureIndex] = updatedClosure;
        return updatedClosure;
    },

    // Delete a closure
    deleteClosure: async (id: string): Promise<void> => {
        await simulateApiDelay(400);

        const closureIndex = closuresStorage.findIndex(c => c.id === id);
        if (closureIndex === -1) {
            throw new Error(`Closure with ID ${id} not found`);
        }

        closuresStorage.splice(closureIndex, 1);
    },

    // Get closure statistics
    getClosureStats: async (): Promise<ClosureStats> => {
        await simulateApiDelay(400);

        const now = new Date();
        const currentClosures = closuresStorage;

        // Calculate real-time statistics
        const active = currentClosures.filter(c => {
            const start = new Date(c.start_time);
            const end = new Date(c.end_time);
            return now >= start && now <= end;
        }).length;

        const upcoming = currentClosures.filter(c => {
            const start = new Date(c.start_time);
            return start > now;
        }).length;

        const expired = currentClosures.filter(c => {
            const end = new Date(c.end_time);
            return end < now;
        }).length;

        const byReason = currentClosures.reduce((acc, closure) => {
            acc[closure.reason] = (acc[closure.reason] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const bySeverity = currentClosures.reduce((acc, closure) => {
            const severity = closure.severity || 'medium';
            acc[severity] = (acc[severity] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Calculate average duration
        const durations = currentClosures.map(closure => {
            const start = new Date(closure.start_time);
            const end = new Date(closure.end_time);
            return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
        });

        const averageDuration = durations.length > 0
            ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length
            : 0;

        const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);

        return {
            total: currentClosures.length,
            active,
            upcoming,
            expired,
            byReason,
            bySeverity,
            byTimeOfDay: {
                morning: Math.floor(currentClosures.length * 0.25),
                afternoon: Math.floor(currentClosures.length * 0.35),
                evening: Math.floor(currentClosures.length * 0.3),
                night: Math.floor(currentClosures.length * 0.1)
            },
            averageDuration: Math.round(averageDuration * 10) / 10,
            totalDuration: Math.round(totalDuration * 10) / 10
        };
    },

    // Reset data to initial state (useful for demo)
    resetData: async (): Promise<void> => {
        await simulateApiDelay(200);
        closuresStorage = [...mockClosures];
        nextId = 1000;
    }
};