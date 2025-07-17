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
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Powerful Features for the
                        <span className="text-blue-600 block">OSM Community</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        A comprehensive solution for temporary road closure management,
                        built with modern web technologies and OpenStreetMap standards.
                    </p>
                </div>

                {/* Main Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {mainFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`
                                    inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4
                                    ${feature.bgColor} group-hover:scale-110 transition-transform duration-300
                                `}>
                                    <Icon className={`w-6 h-6 ${feature.color}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Technical Features */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            Technical Excellence
                        </h3>
                        <p className="text-lg text-gray-600">
                            Built with modern technologies and industry best practices
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {technicalFeatures.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                                >
                                    <Icon className="w-8 h-8 text-gray-700 mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                        {feature.title}
                                    </h4>
                                    <p className="text-gray-600 mb-4">
                                        {feature.description}
                                    </p>
                                    <ul className="space-y-1">
                                        {feature.details.map((detail, detailIndex) => (
                                            <li key={detailIndex} className="flex items-center text-sm text-gray-500">
                                                <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Integration Status */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            Integration Ecosystem
                        </h3>
                        <p className="text-lg text-gray-600">
                            Designed for seamless integration with existing OSM tools and services
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {integrationPartners.map((partner, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Smartphone className="w-6 h-6 text-blue-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    {partner.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    {partner.description}
                                </p>
                                <span className={`
                                    inline-block px-3 py-1 rounded-full text-xs font-medium
                                    ${partner.status === 'In Development'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : partner.status === 'Compatible'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }
                                `}>
                                    {partner.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* GSoC Banner */}
                <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">
                        Google Summer of Code 2025
                    </h3>
                    <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                        This project is being developed as part of GSoC 2025 with OpenStreetMap,
                        focusing on building robust infrastructure for the OSM community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Mentor: Simon Poole</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Code2 className="w-5 h-5" />
                            <span>Student: Archit Rathod</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;