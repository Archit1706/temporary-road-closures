// data/mockClosures.ts
import { Closure, ClosureStats } from '@/services/api';

// Generate realistic timestamps
const now = new Date();
const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);
const eightHoursFromNow = new Date(now.getTime() + 8 * 60 * 60 * 1000);
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

export const mockClosures: any[] = [
    // BIDIRECTIONAL EMERGENCY CLOSURE - Complete street blockage
    {
        id: "closure-001",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6298, 41.8781], // Chicago downtown - Michigan Ave
                [-87.6290, 41.8770], // South direction
                [-87.6282, 41.8759], // Continue south
                [-87.6274, 41.8748]  // End point
            ]
        },
        start_time: oneHourAgo.toISOString(),
        end_time: sixHoursFromNow.toISOString(),
        description: "Water main break - Complete street closure both directions on Michigan Avenue",
        reason: "emergency",
        status: "active",
        submitter: "Chicago Water Management",
        submitter_id: 1, // chicago_mapper user
        severity: "critical",
        created_at: oneHourAgo.toISOString(),
        updated_at: thirtyMinutesAgo.toISOString(),
        openlr: "CwRbWyNG9RpsCQCaAL4=",
        is_bidirectional: true,
        confidence_level: 9,
        source: "Chicago Water Department"
    },

    // UNIDIRECTIONAL CONSTRUCTION - Northbound only
    {
        id: "closure-002",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6590, 41.9100], // Start - Lincoln Ave
                [-87.6585, 41.9110], // Northeast direction
                [-87.6580, 41.9120], // Continue northeast
                [-87.6575, 41.9130], // Continue northeast
                [-87.6570, 41.9140]  // End point
            ]
        },
        start_time: twoHoursAgo.toISOString(),
        end_time: fourHoursFromNow.toISOString(),
        description: "Northbound lane closure for gas line repair on Lincoln Avenue",
        reason: "maintenance",
        status: "active",
        submitter: "Peoples Gas Emergency Response",
        submitter_id: 1, // chicago_mapper user
        severity: "medium",
        created_at: twoHoursAgo.toISOString(),
        updated_at: oneHourAgo.toISOString(),
        openlr: "CwRbWyNG9RpsCQCaAL5=",
        is_bidirectional: false,
        confidence_level: 8,
        source: "Peoples Gas"
    },

    // POINT CLOSURE - Intersection (no direction) - User 2 (different user) - cannot be edited by user 1
    {
        id: "closure-003",
        geometry: {
            type: "Point",
            coordinates: [-87.6180, 41.8690] // South Loop intersection
        },
        start_time: now.toISOString(),
        end_time: sixHoursFromNow.toISOString(),
        description: "Intersection closure for water main repair - all traffic redirected",
        reason: "emergency",
        status: "active",
        submitter: "Chicago Water Management",
        submitter_id: 2, // Different user
        severity: "high",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCaAL6=",
        is_bidirectional: undefined, // Not applicable for points
        confidence_level: 9,
        source: "Chicago Water Department"
    },

    // BIDIRECTIONAL EVENT CLOSURE - East-West street
    {
        id: "closure-004",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6244, 41.8756], // State Street - West to East
                [-87.6220, 41.8756], // Eastward direction
                [-87.6200, 41.8756], // Continue east
                [-87.6180, 41.8756], // Continue east
                [-87.6160, 41.8756]  // End point
            ]
        },
        start_time: tomorrow.toISOString(),
        end_time: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        description: "Street festival - Complete closure both directions on State Street",
        reason: "event",
        status: "inactive",
        submitter: "Chicago Special Events",
        submitter_id: 1, // chicago_mapper user
        severity: "critical",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCbBM6=",
        is_bidirectional: true,
        confidence_level: 10,
        source: "Chicago Mayor's Office"
    },

    // UNIDIRECTIONAL CONSTRUCTION - Diagonal direction (Southeast)
    {
        id: "closure-005",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6340, 41.8950], // Start point - Northwest
                [-87.6320, 41.8935], // Southeast direction
                [-87.6300, 41.8920], // Continue southeast
                [-87.6280, 41.8905], // Continue southeast
                [-87.6260, 41.8890]  // End point - Southeast
            ]
        },
        start_time: tomorrow.toISOString(),
        end_time: new Date(tomorrow.getTime() + 12 * 60 * 60 * 1000).toISOString(),
        description: "Southeastbound lane closure for sewer line replacement on North Clark Street",
        reason: "construction",
        status: "inactive",
        submitter: "Walsh Construction",
        submitter_id: 3, // Different user
        severity: "medium",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCcCN7=",
        is_bidirectional: false,
        confidence_level: 7,
        source: "Walsh Construction Company"
    },

    // BIDIRECTIONAL ACCIDENT - North-South direction
    {
        id: "closure-006",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6450, 41.8850], // West Loop - North point
                [-87.6450, 41.8830], // South direction
                [-87.6450, 41.8810], // Continue south
                [-87.6450, 41.8790]  // End point - South
            ]
        },
        start_time: thirtyMinutesAgo.toISOString(),
        end_time: twoHoursFromNow.toISOString(),
        description: "Multi-vehicle accident - Both directions blocked on Halsted Street",
        reason: "accident",
        status: "active",
        submitter: "Chicago Police Traffic Division",
        submitter_id: 2, // Different user
        severity: "high",
        created_at: thirtyMinutesAgo.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCeEP1=",
        is_bidirectional: true,
        confidence_level: 10,
        source: "CPD Traffic Division"
    },

    // POINT CLOSURE - Navy Pier entrance - User 1 (chicago_mapper) - can be edited
    {
        id: "closure-007",
        geometry: {
            type: "Point",
            coordinates: [-87.6067, 41.8857] // Navy Pier area
        },
        start_time: twoHoursFromNow.toISOString(),
        end_time: new Date(twoHoursFromNow.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        description: "Special event setup - Navy Pier entrance temporarily closed",
        reason: "event",
        status: "inactive",
        submitter: "Navy Pier Event Management",
        submitter_id: 1, // chicago_mapper user - can be edited
        severity: "medium",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCjJT2=",
        is_bidirectional: undefined, // Not applicable for points
        confidence_level: 8,
        source: "Navy Pier Special Events"
    },

    // UNIDIRECTIONAL MAINTENANCE - Westbound only
    {
        id: "closure-008",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6100, 41.8790], // Start - East
                [-87.6130, 41.8790], // Westward direction
                [-87.6160, 41.8790], // Continue west
                [-87.6190, 41.8790]  // End point - West
            ]
        },
        start_time: oneHourFromNow.toISOString(),
        end_time: sixHoursFromNow.toISOString(),
        description: "Westbound lane closure for street cleaning and maintenance",
        reason: "maintenance",
        status: "inactive",
        submitter: "Streets & Sanitation",
        submitter_id: 2, // Different user
        severity: "low",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCdDO9=",
        is_bidirectional: false,
        confidence_level: 6,
        source: "Chicago Streets & Sanitation"
    },

    // POINT CLOSURE - Downtown accident - User 1 (chicago_mapper) - can be edited
    {
        id: "closure-009",
        geometry: {
            type: "Point",
            coordinates: [-87.6244, 41.8756] // Downtown intersection
        },
        start_time: thirtyMinutesAgo.toISOString(),
        end_time: oneHourFromNow.toISOString(),
        description: "Vehicle accident blocking intersection - emergency response in progress",
        reason: "accident",
        status: "active",
        submitter: "Chicago Police District 1",
        submitter_id: 1, // chicago_mapper user - can be edited
        severity: "critical",
        created_at: thirtyMinutesAgo.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCkKU3=",
        is_bidirectional: undefined, // Not applicable for points
        confidence_level: 10,
        source: "CPD Emergency Dispatch"
    },

    // BIDIRECTIONAL WEATHER CLOSURE - Complex curved path
    {
        id: "closure-010",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6400, 41.9100], // Start point
                [-87.6390, 41.9090], // Slight curve southeast
                [-87.6385, 41.9075], // Continue curve
                [-87.6390, 41.9060], // Curve back slightly
                [-87.6400, 41.9045]  // End point
            ]
        },
        start_time: now.toISOString(),
        end_time: eightHoursFromNow.toISOString(),
        description: "Ice removal operations - Both directions affected on curved section of Armitage Avenue",
        reason: "weather",
        status: "active",
        submitter: "CDOT Snow Operations",
        submitter_id: 2, // Different user
        severity: "medium",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCeEP0=",
        is_bidirectional: true,
        confidence_level: 8,
        source: "Chicago DOT"
    },

    // POINT CLOSURE - Building entrance - User 1 (chicago_mapper) - can be edited
    {
        id: "closure-011",
        geometry: {
            type: "Point",
            coordinates: [-87.6298, 41.8902] // Willis Tower area
        },
        start_time: fourHoursFromNow.toISOString(),
        end_time: new Date(fourHoursFromNow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        description: "Building maintenance - Willis Tower loading dock entrance temporarily closed",
        reason: "maintenance",
        status: "inactive",
        submitter: "Willis Tower Management",
        submitter_id: 1, // chicago_mapper user - can be edited
        severity: "low",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQClLV4=",
        is_bidirectional: undefined, // Not applicable for points
        confidence_level: 7,
        source: "Willis Tower Facility Management"
    },

    // UNIDIRECTIONAL EVENT - Marathon route (Northeast direction)
    {
        id: "closure-012",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6270, 41.8825], // Grant Park - Southwest
                [-87.6250, 41.8835], // Northeast direction
                [-87.6230, 41.8845], // Continue northeast
                [-87.6210, 41.8855], // Continue northeast
                [-87.6190, 41.8865]  // End point - Northeast
            ]
        },
        start_time: twoDaysFromNow.toISOString(),
        end_time: new Date(twoDaysFromNow.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        description: "Chicago Marathon route - Northeastbound closure in Grant Park area",
        reason: "event",
        status: "inactive",
        submitter: "Chicago Marathon Organizers",
        submitter_id: 3, // Different user
        severity: "critical",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCcCN8=",
        is_bidirectional: false,
        confidence_level: 10,
        source: "Chicago Marathon"
    },

    // POINT CLOSURE - Emergency services - User 2 (different user) - cannot be edited by user 1
    {
        id: "closure-013",
        geometry: {
            type: "Point",
            coordinates: [-87.6390, 41.8830] // River North area
        },
        start_time: oneHourAgo.toISOString(),
        end_time: twoHoursFromNow.toISOString(),
        description: "Gas leak investigation - Building entrance and sidewalk area closed",
        reason: "emergency",
        status: "active",
        submitter: "Peoples Gas Emergency",
        submitter_id: 2, // Different user
        severity: "high",
        created_at: oneHourAgo.toISOString(),
        updated_at: thirtyMinutesAgo.toISOString(),
        openlr: "CwRbWyNG9RpsCQCmMW5=",
        is_bidirectional: undefined, // Not applicable for points
        confidence_level: 9,
        source: "Peoples Gas Emergency Response"
    },

    // BIDIRECTIONAL CONSTRUCTION - Bridge work
    {
        id: "closure-014",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6320, 41.8880], // Bridge approach - West
                [-87.6300, 41.8880], // Cross bridge - East direction
                [-87.6280, 41.8880], // Continue east
                [-87.6260, 41.8880]  // End point - East
            ]
        },
        start_time: new Date(tomorrow.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(tomorrow.getTime() + 18 * 60 * 60 * 1000).toISOString(),
        description: "Bridge inspection and maintenance - Both directions affected on Wells Street Bridge",
        reason: "maintenance",
        status: "inactive",
        submitter: "Chicago Bridge Engineering",
        submitter_id: 2, // Different user
        severity: "high",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQChHS1=",
        is_bidirectional: true,
        confidence_level: 8,
        source: "Chicago DOT Bridge Division"
    }
];

// Calculate comprehensive statistics including direction data and point closures
const calculateStats = (): ClosureStats => {
    const currentTime = now;

    const active = mockClosures.filter(c => {
        const start = new Date(c.start_time);
        const end = new Date(c.end_time);
        return currentTime >= start && currentTime <= end;
    }).length;

    const upcoming = mockClosures.filter(c => {
        const start = new Date(c.start_time);
        return start > currentTime;
    }).length;

    const expired = mockClosures.filter(c => {
        const end = new Date(c.end_time);
        return end < currentTime;
    }).length;

    const byReason = mockClosures.reduce((acc, closure) => {
        acc[closure.reason] = (acc[closure.reason] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const bySeverity = mockClosures.reduce((acc, closure) => {
        const severity = closure.severity || 'medium';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Calculate geometry type statistics
    const pointClosures = mockClosures.filter(c => c.geometry.type === 'Point').length;
    const lineStringClosures = mockClosures.filter(c => c.geometry.type === 'LineString');
    const bidirectionalCount = lineStringClosures.filter(c => c.is_bidirectional === true).length;
    const unidirectionalCount = lineStringClosures.filter(c => c.is_bidirectional === false).length;

    // Calculate durations
    const durations = mockClosures.map(closure => {
        const start = new Date(closure.start_time);
        const end = new Date(closure.end_time);
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
    });

    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
    const averageDuration = durations.length > 0 ? totalDuration / durations.length : 0;

    return {
        total: mockClosures.length,
        active,
        upcoming,
        expired,
        byClosureType: byReason,
        byStatus: bySeverity,
        byTimeOfDay: {
            morning: Math.floor(mockClosures.length * 0.25),
            afternoon: Math.floor(mockClosures.length * 0.35),
            evening: Math.floor(mockClosures.length * 0.25),
            night: Math.floor(mockClosures.length * 0.15)
        },
        averageDuration: Math.round(averageDuration * 10) / 10,
        totalDuration: Math.round(totalDuration * 10) / 10,
        byDirection: {
            bidirectional: bidirectionalCount,
            unidirectional: unidirectionalCount,
            point: pointClosures // Point closures don't have direction
        }
    };
};

export const mockClosureStats: ClosureStats = calculateStats();

// Helper function to filter closures by bounding box
export const filterClosuresByBounds = (
    closures: any[],
    bbox: { north: number; south: number; east: number; west: number }
): any[] => {
    return closures.filter(closure => {
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
};

// Simulate API delay with some randomness for realism
export const simulateApiDelay = (ms: number = 800): Promise<void> => {
    const randomDelay = ms + Math.random() * 400; // Add 0-400ms random delay
    return new Promise(resolve => setTimeout(resolve, randomDelay));
};