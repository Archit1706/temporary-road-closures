import React from 'react';
import Link from 'next/link';
import {
    Construction,
    Github,
    ExternalLink,
    Heart,
    Code2,
    Users,
    Mail,
    Globe
} from 'lucide-react';

const Footer: React.FC = () => {
    const quickLinks = [
        { href: '/', label: 'Home' },
        { href: '/closures', label: 'View Closures' },
        { href: 'http://localhost:8000/docs', label: 'API Documentation', external: true },
        { href: 'https://github.com/Archit1706/temporary-road-closures', label: 'GitHub Repository', external: true }
    ];

    const projectInfo = [
        { label: 'Project', value: 'Google Summer of Code 2025' },
        { label: 'Organization', value: 'OpenStreetMap' },
        { label: 'Student', value: 'Archit Rathod' },
        { label: 'Mentor', value: 'Simon Poole' },
        { label: 'Mentor', value: 'Ian Wagner' }
    ];

    const technologies = [
        'Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL',
        'PostGIS', 'OpenLR', 'Leaflet', 'Tailwind CSS'
    ];

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                                <Construction className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">
                                    OSM Road Closures
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Community Platform
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            A temporary road closures database and API for OpenStreetMap,
                            enabling real-time navigation updates for the community.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/Archit1706/temporary-road-closures"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Github className="w-6 h-6" />
                            </a>
                            <a
                                href="http://localhost:8000/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Code2 className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-white transition-colors flex items-center group"
                                        >
                                            {link.label}
                                            <ExternalLink className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-gray-300 hover:text-white transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Project Information */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Project Info</h4>
                        <div className="space-y-3">
                            {projectInfo.map((info, index) => (
                                <div key={index} className="flex flex-col">
                                    <span className="text-sm text-gray-400">{info.label}</span>
                                    <span className="text-gray-300">{info.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Technologies */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Built With</h4>
                        <div className="flex flex-wrap gap-2">
                            {technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Acknowledgements Section */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
                            <Heart className="w-5 h-5 text-red-500 mr-2" />
                            Acknowledgements
                        </h4>
                        <div className="max-w-4xl mx-auto text-gray-300 leading-relaxed">
                            <p className="mb-4">
                                This project is made possible through the support of <strong>Google Summer of Code 2025</strong>
                                and the incredible <strong>OpenStreetMap community</strong>. Special thanks to all contributors,
                                testers, and community members who have provided feedback and guidance.
                            </p>
                            <p>
                                We acknowledge the foundational work of OSM contributors worldwide and the open-source
                                ecosystem that makes projects like this possible.
                            </p>
                        </div>
                    </div>

                    {/* Recognition Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="text-center p-4 bg-gray-800 rounded-lg">
                            <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                            <h5 className="text-white font-semibold mb-2">OpenStreetMap</h5>
                            <p className="text-gray-400 text-sm">
                                For providing the platform and community that makes this project valuable
                            </p>
                        </div>
                        <div className="text-center p-4 bg-gray-800 rounded-lg">
                            <Globe className="w-8 h-8 text-green-500 mx-auto mb-3" />
                            <h5 className="text-white font-semibold mb-2">Google Summer of Code</h5>
                            <p className="text-gray-400 text-sm">
                                For supporting open source development and student participation
                            </p>
                        </div>
                        <div className="text-center p-4 bg-gray-800 rounded-lg">
                            <Code2 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                            <h5 className="text-white font-semibold mb-2">Open Source Community</h5>
                            <p className="text-gray-400 text-sm">
                                For the amazing tools and libraries that power this application
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm text-center md:text-left">
                            <p>
                                © 2025 OSM Road Closures Project.
                                Open source under MIT License.
                            </p>
                            <p className="mt-1">
                                Built with ❤️ for the OpenStreetMap community
                            </p>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                            <a
                                href="https://www.openstreetmap.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors flex items-center"
                            >
                                OpenStreetMap
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                            <a
                                href="https://summerofcode.withgoogle.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors flex items-center"
                            >
                                GSoC 2025
                                <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                            <span className="text-gray-400">
                                Made in Chicago
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;