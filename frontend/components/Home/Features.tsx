import React from 'react';
import {
    MapPin,
    Zap,
    Globe,
    Shield,
    Users,
    Code2,
    Navigation,
    Clock,
    CheckCircle,
    Smartphone
} from 'lucide-react';

const Features: React.FC = () => {
    const mainFeatures = [
        {
            icon: MapPin,
            title: "OpenLR Integration",
            description: "Universal location referencing standard ensures compatibility across different map systems and navigation apps.",
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            icon: Zap,
            title: "Real-time Updates",
            description: "Instant synchronization means road closures are available to the community within seconds of reporting.",
            color: "text-yellow-600",
            bgColor: "bg-yellow-100"
        },
        {
            icon: Globe,
            title: "OpenStreetMap Integration",
            description: "Built specifically for the OSM ecosystem, complementing existing map data with dynamic closure information.",
            color: "text-green-600",
            bgColor: "bg-green-100"
        },
        {
            icon: Shield,
            title: "Validated Data",
            description: "Community moderation and confidence scoring ensure reliable, high-quality closure information.",
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        }
    ];

    const technicalFeatures = [
        {
            icon: Code2,
            title: "RESTful API",
            description: "Full-featured API for integration with navigation apps and other services",
            details: ["GET /closures", "POST /closures", "OpenAPI documentation"]
        },
        {
            icon: Navigation,
            title: "OsmAnd Ready",
            description: "Direct integration with popular OSM navigation applications",
            details: ["Plugin architecture", "Live routing updates", "Offline support"]
        },
        {
            icon: Users,
            title: "Community Driven",
            description: "Powered by OSM contributors and local community members",
            details: ["Easy reporting", "Moderation tools", "Verification system"]
        },
        {
            icon: Clock,
            title: "Temporal Data",
            description: "Smart handling of time-based closures and scheduled events",
            details: ["Start/end times", "Recurring events", "Historic data"]
        }
    ];

    const integrationPartners = [
        {
            name: "OsmAnd",
            description: "Mobile navigation app",
            status: "In Development"
        },
        {
            name: "OSRM",
            description: "Routing engine",
            status: "Planned"
        },
        {
            name: "GraphHopper",
            description: "Routing service",
            status: "Planned"
        },
        {
            name: "Leaflet Routing",
            description: "Web routing",
            status: "Compatible"
        }
    ];

    return (
        <section className="py-20 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* GSoC Banner */}
                <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">
                        Google Summer of Code 2026
                    </h3>
                    <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                        This project was initially developed as part of GSoC 2026 by Archit Rathod,
                        and is being further refined durich this years GSoC.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Mentor: Simon Poole</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Mentor: David Haberthuer</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Code2 className="w-5 h-5" />
                            <span>Student: Venetis Charalampidis</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;