// services/mockApi.ts - Updated with bidirectional support
import {
    Closure,
    CreateClosureData,
    BoundingBox,
    ClosureStats
} from './api';

// In-memory storage for demo (resets on page refresh)
let closuresStorage: any[] = []; // Updated to include bidirectional field
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

// Initialize mock data with bidirectional field
const initializeMockData = () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    closuresStorage = [
        // Bidirectional closure example
        {
            id: "closure-001",
            geometry: {
                type: "LineString",
                coordinates: [
                    [-87.6298, 41.8781], // Chicago downtown
                    [-87.6280, 41.8770],
                    [-87.6260, 41.8755]
                ]
            },
            start_time: oneHourAgo.toISOString(),
            end_time: fourHoursFromNow.toISOString(),
            description: "Major construction - Both directions blocked on Michigan Avenue",
            reason: "construction",
            status: "active",
            submitter: "CDOT Construction Division",
            severity: "critical",
            created_at: oneHourAgo.toISOString(),
            updated_at: now.toISOString(),
            openlr: "CwRbWyNG9RpsCQCaAL4=",
            is_bidirectional: true
        },
        // Unidirectional closure example
        {
            id: "closure-002",
            geometry: {
                type: "LineString",
                coordinates: [
                    [-87.6590, 41.9100],
                    [-87.6580, 41.9090],
                    [-87.6570, 41.9080],
                    [-87.6560, 41.9070]
                ]
            },
            start_time: now.toISOString(),
            end_time: twoHoursFromNow.toISOString(),
            description: "Northbound lane closure for utility work on Lincoln Avenue",
            reason: "maintenance",
            status: "active",
            submitter: "ComEd Maintenance",
            severity: "medium",
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
            openlr: "CwRbWyNG9RpsCQCaAL5=",
            is_bidirectional: false
        },
        // Point closure (no direction)
        {
            id: "closure-003",
            geometry: {
                type: "Point",
                coordinates: [-87.6180, 41.8690] // South Loop
            },
            start_time: now.toISOString(),
            end_time: oneDayFromNow.toISOString(),
            description: "Intersection closure for water main repair",
            reason: "emergency",
            status: "active",
            submitter: "Chicago Water Management",
            severity: "high",
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
            openlr: "CwRbWyNG9RpsCQCaAL6=",
            is_bidirectional: undefined // Not applicable for points
        },
        // Another bidirectional example
        {
            id: "closure-004",
            geometry: {
                type: "LineString",
                coordinates: [
                    [-87.6244, 41.8756],
                    [-87.6200, 41.8742],
                    [-87.6180, 41.8738]
                ]
            },
            start_time: oneDayFromNow.toISOString(),
            end_time: new Date(oneDayFromNow.getTime() + 8 * 60 * 60 * 1000).toISOString(),
            description: "Street festival - Complete road closure both directions on State Street",
            reason: "event",
            status: "inactive",
            submitter: "Chicago Special Events",
            severity: "critical",
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
            openlr: "CwRbWyNG9RpsCQCbBM6=",
            is_bidirectional: true
        },
        // Unidirectional example with complex path
        {
            id: "closure-005",
            geometry: {
                type: "LineString",
                coordinates: [
                    [-87.6340, 41.8950], // Start point
                    [-87.6320, 41.8945], // Northeast direction
                    [-87.6300, 41.8940], // Continue northeast
                    [-87.6280, 41.8935], // End point
                    [-87.6260, 41.8930]  // Final segment
                ]
            },
            start_time: twoHoursFromNow.toISOString(),
            end_time: new Date(twoHoursFromNow.getTime() + 6 * 60 * 60 * 1000).toISOString(),
            description: "Eastbound lane closure for street resurfacing on North Clark Street",
            reason: "construction",
            status: "inactive",
            submitter: "Walsh Construction",
            severity: "medium",
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
            openlr: "CwRbWyNG9RpsCQCcCN7=",
            is_bidirectional: false
        }
    ];
};

// Initialize on load
initializeMockData();

export const mockClosuresApi = {
    // Get closures within a bounding box
    getClosures: async (bbox?: BoundingBox): Promise<any[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

        let filteredClosures = closuresStorage;

        if (bbox) {
            filteredClosures = closuresStorage.filter(closure => {
                if (closure.geometry.type === 'Point') {
                    const [lng, lat] = closure.geometry.coordinates as number[];
                    return lat >= bbox.south && lat <= bbox.north &&
                        lng >= bbox.west && lng <= bbox.east;
                } else if (closure.geometry.type === 'LineString') {
                    // Check if any point in the LineString is within bounds
                    const coordinates = closure.geometry.coordinates as number[][];
                    return coordinates.some(([lng, lat]) =>
                        lat >= bbox.south && lat <= bbox.north &&
                        lng >= bbox.west && lng <= bbox.east
                    );
                }
                return false;
            });
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
    getClosure: async (id: string): Promise<any> => {
        await new Promise(resolve => setTimeout(resolve, 300));

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
    createClosure: async (data: any): Promise<any> => {
        await new Promise(resolve => setTimeout(resolve, 600));

        const now = getCurrentTimestamp();
        const newClosure = {
            id: generateId(),
            geometry: data.geometry,
            start_time: data.start_time,
            end_time: data.end_time,
            description: data.description,
            reason: data.reason,
            status: determineStatus(data.start_time, data.end_time),
            submitter: data.submitter,
            severity: data.severity || 'medium',
            created_at: now,
            updated_at: now,
            openlr: `CwRbWyNG9RpsCQC${Math.random().toString(36).substr(2, 4)}=`,
            is_bidirectional: data.is_bidirectional
        };

        closuresStorage.unshift(newClosure); // Add to beginning
        return newClosure;
    },

    // Update a closure
    updateClosure: async (id: string, data: any): Promise<any> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const closureIndex = closuresStorage.findIndex(c => c.id === id);
        if (closureIndex === -1) {
            throw new Error(`Closure with ID ${id} not found`);
        }

        const existingClosure = closuresStorage[closureIndex];
        const updatedClosure = {
            ...existingClosure,
            ...data,
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
        await new Promise(resolve => setTimeout(resolve, 400));

        const closureIndex = closuresStorage.findIndex(c => c.id === id);
        if (closureIndex === -1) {
            throw new Error(`Closure with ID ${id} not found`);
        }

        closuresStorage.splice(closureIndex, 1);
    },

    // Get closure statistics
    getClosureStats: async (): Promise<ClosureStats> => {
        await new Promise(resolve => setTimeout(resolve, 400));

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

        // Calculate direction statistics
        const lineStringClosures = currentClosures.filter(c => c.geometry.type === 'LineString');
        const bidirectionalCount = lineStringClosures.filter(c => c.is_bidirectional === true).length;
        const unidirectionalCount = lineStringClosures.filter(c => c.is_bidirectional === false).length;

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
            totalDuration: Math.round(totalDuration * 10) / 10,
            // Add direction statistics
            byDirection: {
                bidirectional: bidirectionalCount,
                unidirectional: unidirectionalCount,
                point: currentClosures.filter(c => c.geometry.type === 'Point').length
            }
        };
    },

    // Reset data to initial state (useful for demo)
    resetData: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        initializeMockData();
        nextId = 1000;
    }
};