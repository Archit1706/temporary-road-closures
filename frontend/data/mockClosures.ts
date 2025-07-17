// data/mockClosures.ts
import { Closure, ClosureStats } from '@/services/api';

// Generate realistic timestamps
const now = new Date();
const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
const twelvehHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60 * 1000);
const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);
const sixHoursFromNow = new Date(now.getTime() + 6 * 60 * 60 * 1000);
const eightHoursFromNow = new Date(now.getTime() + 8 * 60 * 60 * 1000);
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

export const mockClosures: Closure[] = [
    // EMERGENCY CLOSURES
    {
        id: "closure-001",
        geometry: {
            type: "Point",
            coordinates: [-87.6298, 41.8781] // Chicago downtown
        },
        start_time: oneHourAgo.toISOString(),
        end_time: sixHoursFromNow.toISOString(),
        description: "Water main break on Michigan Avenue - Emergency repair crews on site",
        reason: "emergency",
        status: "active",
        submitter: "Chicago Water Management",
        severity: "critical",
        created_at: oneHourAgo.toISOString(),
        updated_at: thirtyMinutesAgo.toISOString(),
        openlr: "CwRbWyNG9RpsCQCaAL4="
    },
    {
        id: "closure-002",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6590, 41.9100],
                [-87.6580, 41.9090],
                [-87.6570, 41.9080]
            ]
        },
        start_time: twoHoursAgo.toISOString(),
        end_time: fourHoursFromNow.toISOString(),
        description: "Gas leak emergency - Evacuating nearby buildings on Lincoln Avenue",
        reason: "emergency",
        status: "active",
        submitter: "Peoples Gas Emergency Response",
        severity: "critical",
        created_at: twoHoursAgo.toISOString(),
        updated_at: oneHourAgo.toISOString(),
        openlr: "CwRbWyNG9RpsCQCaAL5="
    },
    {
        id: "closure-003",
        geometry: {
            type: "Point",
            coordinates: [-87.6180, 41.8690] // South Loop
        },
        start_time: fourHoursAgo.toISOString(),
        end_time: thirtyMinutesAgo.toISOString(),
        description: "Fire department emergency response - Building fire contained",
        reason: "emergency",
        status: "inactive",
        submitter: "Chicago Fire Department",
        severity: "high",
        created_at: fourHoursAgo.toISOString(),
        updated_at: thirtyMinutesAgo.toISOString()
    },

    // CONSTRUCTION CLOSURES
    {
        id: "closure-004",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6244, 41.8756],
                [-87.6200, 41.8742],
                [-87.6180, 41.8738],
                [-87.6160, 41.8734]
            ]
        },
        start_time: twoDaysAgo.toISOString(),
        end_time: twoHoursFromNow.toISOString(),
        description: "Road construction - Lane closure on State Street for new bike lane installation",
        reason: "construction",
        status: "active",
        submitter: "CDOT Construction Division",
        severity: "medium",
        created_at: twoDaysAgo.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCbBM6="
    },
    {
        id: "closure-005",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6340, 41.8950],
                [-87.6320, 41.8945],
                [-87.6300, 41.8940],
                [-87.6280, 41.8935]
            ]
        },
        start_time: tomorrow.toISOString(),
        end_time: oneWeekFromNow.toISOString(),
        description: "Major construction project - Complete street reconstruction on North Clark Street",
        reason: "construction",
        status: "inactive",
        submitter: "Walsh Construction",
        severity: "critical",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCcCN7="
    },
    {
        id: "closure-006",
        geometry: {
            type: "Point",
            coordinates: [-87.6280, 41.8620] // Near McCormick Place
        },
        start_time: threeDaysFromNow.toISOString(),
        end_time: twoWeeksFromNow.toISOString(),
        description: "Bridge reconstruction - Temporary bridge installation on 31st Street",
        reason: "construction",
        status: "inactive",
        submitter: "Chicago Bridge & Iron",
        severity: "high",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCdDO8="
    },

    // ACCIDENT CLOSURES
    {
        id: "closure-007",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6340, 41.8850],
                [-87.6320, 41.8845],
                [-87.6300, 41.8840]
            ]
        },
        start_time: twoDaysAgo.toISOString(),
        end_time: oneHourAgo.toISOString(),
        description: "Multi-vehicle collision cleared - All lanes reopened on Lake Shore Drive",
        reason: "accident",
        status: "inactive",
        submitter: "Chicago Police Traffic Division",
        severity: "high",
        created_at: twoDaysAgo.toISOString(),
        updated_at: oneHourAgo.toISOString()
    },
    {
        id: "closure-008",
        geometry: {
            type: "Point",
            coordinates: [-87.6450, 41.8750] // West Loop
        },
        start_time: thirtyMinutesAgo.toISOString(),
        end_time: twoHoursFromNow.toISOString(),
        description: "Vehicle accident - Tow truck removing disabled vehicle from intersection",
        reason: "accident",
        status: "active",
        submitter: "CPD District 1",
        severity: "medium",
        created_at: thirtyMinutesAgo.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCeEP1="
    },
    {
        id: "closure-009",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6700, 41.9200],
                [-87.6680, 41.9190],
                [-87.6660, 41.9180]
            ]
        },
        start_time: sixHoursAgo.toISOString(),
        end_time: twoHoursAgo.toISOString(),
        description: "Truck rollover incident cleared - Traffic restored on Fullerton Parkway",
        reason: "accident",
        status: "inactive",
        submitter: "Illinois State Police",
        severity: "critical",
        created_at: sixHoursAgo.toISOString(),
        updated_at: twoHoursAgo.toISOString()
    },

    // EVENT CLOSURES
    {
        id: "closure-010",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6270, 41.8825], // Grant Park area
                [-87.6250, 41.8820],
                [-87.6230, 41.8815],
                [-87.6210, 41.8810]
            ]
        },
        start_time: tomorrow.toISOString(),
        end_time: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        description: "Chicago Marathon 2025 - Complete road closure in Grant Park and downtown area",
        reason: "event",
        status: "inactive",
        submitter: "Chicago Marathon Organizers",
        severity: "critical",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCcCN8="
    },
    {
        id: "closure-011",
        geometry: {
            type: "Point",
            coordinates: [-87.6240, 41.8900] // Near Navy Pier
        },
        start_time: twoDaysFromNow.toISOString(),
        end_time: new Date(twoDaysFromNow.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        description: "Street festival setup - Taste of Chicago preparation on Lower Wacker",
        reason: "event",
        status: "inactive",
        submitter: "Chicago Special Events",
        severity: "medium",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCfFQ9="
    },
    {
        id: "closure-012",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6240, 41.8780],
                [-87.6220, 41.8775],
                [-87.6200, 41.8770]
            ]
        },
        start_time: oneWeekFromNow.toISOString(),
        end_time: new Date(oneWeekFromNow.getTime() + 12 * 60 * 60 * 1000).toISOString(),
        description: "Bulls parade route - Victory celebration planned for Michigan Avenue",
        reason: "event",
        status: "inactive",
        submitter: "City of Chicago Events",
        severity: "high",
        created_at: now.toISOString(),
        updated_at: now.toISOString()
    },

    // MAINTENANCE CLOSURES
    {
        id: "closure-013",
        geometry: {
            type: "Point",
            coordinates: [-87.6400, 41.8790] // West Loop
        },
        start_time: now.toISOString(),
        end_time: twoHoursFromNow.toISOString(),
        description: "Utility maintenance - Scheduled gas line inspection on Randolph Street",
        reason: "maintenance",
        status: "active",
        submitter: "Peoples Gas Maintenance",
        severity: "low",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCdDO9="
    },
    {
        id: "closure-014",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6100, 41.8650],
                [-87.6080, 41.8645],
                [-87.6060, 41.8640]
            ]
        },
        start_time: tomorrow.toISOString(),
        end_time: new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        description: "Street cleaning and pothole repair - Lane restrictions on Cermak Road",
        reason: "maintenance",
        status: "inactive",
        submitter: "Streets & Sanitation",
        severity: "low",
        created_at: now.toISOString(),
        updated_at: now.toISOString()
    },
    {
        id: "closure-015",
        geometry: {
            type: "Point",
            coordinates: [-87.6320, 41.8600] // Chinatown area
        },
        start_time: twoDaysFromNow.toISOString(),
        end_time: new Date(twoDaysFromNow.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        description: "Sewer line maintenance - Scheduled cleaning and inspection",
        reason: "maintenance",
        status: "inactive",
        submitter: "Water Reclamation District",
        severity: "medium",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCgGR0="
    },
    {
        id: "closure-016",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6800, 41.9000],
                [-87.6780, 41.8995],
                [-87.6760, 41.8990]
            ]
        },
        start_time: oneHourFromNow.toISOString(),
        end_time: sixHoursFromNow.toISOString(),
        description: "Traffic signal maintenance - Upgrading intersection controllers on North Avenue",
        reason: "maintenance",
        status: "active",
        submitter: "CDOT Signal Division",
        severity: "medium",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQChHS1="
    },

    // WEATHER CLOSURES
    {
        id: "closure-017",
        geometry: {
            type: "Point",
            coordinates: [-87.6150, 41.8700] // South Loop
        },
        start_time: thirtyMinutesAgo.toISOString(),
        end_time: oneHourFromNow.toISOString(),
        description: "Ice removal operations - Salting trucks active on Roosevelt Road",
        reason: "weather",
        status: "active",
        submitter: "CDOT Snow Operations",
        severity: "medium",
        created_at: thirtyMinutesAgo.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCeEP0="
    },
    {
        id: "closure-018",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6400, 41.9100],
                [-87.6380, 41.9095],
                [-87.6360, 41.9090],
                [-87.6340, 41.9085]
            ]
        },
        start_time: oneDayAgo.toISOString(),
        end_time: fourHoursAgo.toISOString(),
        description: "Snow removal completed - All lanes cleared on Armitage Avenue",
        reason: "weather",
        status: "inactive",
        submitter: "Chicago Snow Command",
        severity: "high",
        created_at: oneDayAgo.toISOString(),
        updated_at: fourHoursAgo.toISOString()
    },
    {
        id: "closure-019",
        geometry: {
            type: "Point",
            coordinates: [-87.6500, 41.8500] // Bridgeport area
        },
        start_time: threeDaysAgo.toISOString(),
        end_time: oneDayAgo.toISOString(),
        description: "Flooding cleared - Drainage pumps removed from 35th Street underpass",
        reason: "weather",
        status: "inactive",
        submitter: "Chicago Emergency Management",
        severity: "critical",
        created_at: threeDaysAgo.toISOString(),
        updated_at: oneDayAgo.toISOString()
    },

    // ADDITIONAL VARIETY CLOSURES
    {
        id: "closure-020",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6500, 41.8800],
                [-87.6480, 41.8805],
                [-87.6460, 41.8810],
                [-87.6440, 41.8815]
            ]
        },
        start_time: threeDaysFromNow.toISOString(),
        end_time: new Date(threeDaysFromNow.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: "Bridge inspection and maintenance - Periodic safety check on Harrison Street Bridge",
        reason: "maintenance",
        status: "inactive",
        submitter: "Chicago Bridge Engineering",
        severity: "high",
        created_at: now.toISOString(),
        updated_at: now.toISOString()
    },
    {
        id: "closure-021",
        geometry: {
            type: "Point",
            coordinates: [-87.6150, 41.8550] // Near IIT
        },
        start_time: oneWeekAgo.toISOString(),
        end_time: twelvehHoursAgo.toISOString(),
        description: "Utility work completed - New fiber optic cables installed",
        reason: "construction",
        status: "inactive",
        submitter: "ComEd Infrastructure",
        severity: "low",
        created_at: oneWeekAgo.toISOString(),
        updated_at: twelvehHoursAgo.toISOString()
    },
    {
        id: "closure-022",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6200, 41.8950],
                [-87.6180, 41.8945],
                [-87.6160, 41.8940]
            ]
        },
        start_time: fourHoursFromNow.toISOString(),
        end_time: eightHoursFromNow.toISOString(),
        description: "Film production - Movie shoot requiring temporary street closure on North Wells",
        reason: "event",
        status: "inactive",
        submitter: "Chicago Film Office",
        severity: "medium",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCiIT2="
    },
    {
        id: "closure-023",
        geometry: {
            type: "Point",
            coordinates: [-87.6350, 41.8650] // UIC area
        },
        start_time: tomorrow.toISOString(),
        end_time: new Date(tomorrow.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        description: "University event - Graduation ceremony traffic management",
        reason: "event",
        status: "inactive",
        submitter: "UIC Campus Safety",
        severity: "low",
        created_at: now.toISOString(),
        updated_at: now.toISOString()
    },
    {
        id: "closure-024",
        geometry: {
            type: "LineString",
            coordinates: [
                [-87.6750, 41.8750],
                [-87.6730, 41.8745],
                [-87.6710, 41.8740]
            ]
        },
        start_time: oneHourAgo.toISOString(),
        end_time: fourHoursFromNow.toISOString(),
        description: "Power outage response - ComEd crews working on electrical infrastructure",
        reason: "emergency",
        status: "active",
        submitter: "ComEd Emergency Response",
        severity: "high",
        created_at: oneHourAgo.toISOString(),
        updated_at: thirtyMinutesAgo.toISOString(),
        openlr: "CwRbWyNG9RpsCQCjJU3="
    },
    {
        id: "closure-025",
        geometry: {
            type: "Point",
            coordinates: [-87.6420, 41.8880] // River North
        },
        start_time: twoHoursFromNow.toISOString(),
        end_time: sixHoursFromNow.toISOString(),
        description: "Building demolition - Controlled implosion safety perimeter on Ontario Street",
        reason: "construction",
        status: "inactive",
        submitter: "Controlled Demolition Inc",
        severity: "critical",
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        openlr: "CwRbWyNG9RpsCQCkKV4="
    }
];

// Calculate comprehensive statistics based on the expanded sample data
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
        byReason,
        bySeverity,
        byTimeOfDay: {
            morning: Math.floor(mockClosures.length * 0.25),
            afternoon: Math.floor(mockClosures.length * 0.35),
            evening: Math.floor(mockClosures.length * 0.25),
            night: Math.floor(mockClosures.length * 0.15)
        },
        averageDuration: Math.round(averageDuration * 10) / 10,
        totalDuration: Math.round(totalDuration * 10) / 10
    };
};

export const mockClosureStats: ClosureStats = calculateStats();

// Helper function to filter closures by bounding box
export const filterClosuresByBounds = (
    closures: Closure[],
    bbox: { north: number; south: number; east: number; west: number }
): Closure[] => {
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