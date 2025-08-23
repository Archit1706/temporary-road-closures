"use client"
import React, { useEffect } from 'react';
import { Construction } from 'lucide-react';

// Backend sections
import {
    Introduction,
    GettingStarted,
    Authentication,
    Closures,
    Users,
    OpenLR,
    Health,
    Deployment,
} from './Sections/Backend';

// Frontend sections
import FrontendIntroduction from './Sections/Frontend/Introduction';
import FrontendUsage from './Sections/Frontend/Usage';
import FrontendSetup from './Sections/Frontend/Setup';
import FrontendFeatures from './Sections/Frontend/Features';
import FrontendArchitecture from './Sections/Frontend/Architecture';

// Closure Routing sections
import ClosureRoutingIntroduction from './Sections/ClosureAwareRouting/Introduction';
import ClosureRoutingUsage from './Sections/ClosureAwareRouting/Usage';
import TransportationModesAndClosures from './Sections/ClosureAwareRouting/TransportationModesAndClosures';
import TechnicalArchitecture from './Sections/ClosureAwareRouting/TechnicalArchitecture';

// Contribute and Acknowledgements sections
import Contribute from './Sections/Contribute';
import Acknowledgements from './Sections/Acknowledgements';

// Section mapping
const sectionComponents = {
    // Backend sections
    'introduction': Introduction,
    'getting-started': GettingStarted,
    'authentication': Authentication,
    'closures': Closures,
    'users': Users,
    'openlr': OpenLR,
    'health': Health,
    'deployment': Deployment,
    'contribute': Contribute,
    'acknowledgements': Acknowledgements,

    // Frontend sections
    'frontend-intro': FrontendIntroduction,
    'frontend-usage': FrontendUsage,
    'frontend-setup': FrontendSetup,
    'frontend-features': FrontendFeatures,
    'frontend-architecture': FrontendArchitecture,

    // Closure Routing sections
    'closure-routing-intro': ClosureRoutingIntroduction,
    'closure-routing-usage': ClosureRoutingUsage,
    'closure-routing-modes': TransportationModesAndClosures,
    'closure-routing-technical': TechnicalArchitecture,
} as const;

type SectionKey = keyof typeof sectionComponents;

interface DocsContentProps {
    activeSection: string;
}

const DocsContent: React.FC<DocsContentProps> = ({ activeSection }) => {
    const SectionComponent = sectionComponents[activeSection as SectionKey];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeSection]);

    if (SectionComponent) {
        return (
            <div className="flex-1 md:ml-80 p-6 max-w-5xl">
                <SectionComponent />
            </div>
        );
    }

    // Fallback for unknown sections
    return (
        <div className="flex-1 md:ml-80 p-6 max-w-5xl">
            <div className="text-center py-12">
                <Construction className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                <p className="text-gray-600">This section is under development.</p>
            </div>
        </div>
    );
};

export default DocsContent;