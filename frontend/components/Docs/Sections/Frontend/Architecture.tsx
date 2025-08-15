import React from 'react';
import { Code, Palette, MapPin as MapIcon, Layout, Layers, RefreshCw, Shield, Zap, Heart } from 'lucide-react';
import { FeatureCard, TechStackItem, InfoBox } from '../../Common';
import CodeBlock from '../../CodeBlock';

const Architecture: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Architecture & Technical Stack</h1>
                <p className="text-lg text-gray-600">
                    Detailed overview of the frontend architecture, technology choices, and implementation details
                    for the OSM Road Closures reporting application.
                </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack Overview</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={Code}
                        title="Frontend Framework"
                        description="Next.js 15 with TypeScript and App Router"
                        iconColor="text-blue-600"
                    />
                    <FeatureCard
                        icon={Palette}
                        title="Styling"
                        description="Tailwind CSS v4 with responsive design"
                        iconColor="text-green-600"
                    />
                    <FeatureCard
                        icon={MapIcon}
                        title="Mapping"
                        description="Leaflet.js with React-Leaflet integration"
                        iconColor="text-red-600"
                    />
                </div>
            </div>

            <div className="space-y-8">
                {/* Core Architecture */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Layout className="w-6 h-6 text-purple-600" />
                        <span>Application Architecture</span>
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Next.js App Router Structure</h3>
                            <CodeBlock
                                code={`frontend/
├── app/                      # Next.js 15 App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── closures/           # Main application
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── docs/               # Documentation
│   ├── login/              # Authentication
│   └── register/           # User registration
├── components/             # React components
│   ├── Auth/               # Authentication components
│   ├── Layout/             # Layout components
│   ├── Map/                # Map-related components
│   ├── Forms/              # Form components
│   ├── Docs/               # Documentation components
│   └── Demo/               # Demo/debug components
├── context/                # React Context providers
├── services/               # API clients and utilities
├── data/                   # Static/mock data
└── public/                 # Static assets`}
                                language="text"
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Component Architecture</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TechStackItem
                                    title="Layout Components"
                                    description=""
                                    items={[
                                        "Header: Navigation and authentication",
                                        "Sidebar: Closures list and statistics",
                                        "Layout: Main layout wrapper",
                                        "StatsDashboard: Analytics modal"
                                    ]}
                                    bgColor="bg-blue-50 border border-blue-200"
                                />
                                <TechStackItem
                                    title="Feature Components"
                                    description=""
                                    items={[
                                        "MapComponent: Interactive Leaflet map",
                                        "ClosureForm: Multi-step reporting form",
                                        "EditClosureForm: Edit existing closures",
                                        "DemoControlPanel: Debug interface"
                                    ]}
                                    bgColor="bg-green-50 border border-green-200"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">State Management Pattern</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <CodeBlock
                                    code={`// React Context + useReducer pattern
interface ClosuresState {
  closures: Closure[];
  selectedClosure: Closure | null;
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  editingClosure: Closure | null;
}

// Actions for state management
type ClosuresAction = 
  | { type: 'SET_CLOSURES'; payload: Closure[] }
  | { type: 'ADD_CLOSURE'; payload: Closure }
  | { type: 'UPDATE_CLOSURE'; payload: Closure }
  | { type: 'DELETE_CLOSURE'; payload: number }
  | { type: 'SELECT_CLOSURE'; payload: Closure }
  | { type: 'SET_LOADING'; payload: boolean };`}
                                    language="typescript"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technology Stack Details */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Layers className="w-6 h-6 text-indigo-600" />
                        <span>Technology Stack Details</span>
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Core Framework</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TechStackItem
                                    title="Next.js 15"
                                    description=""
                                    items={[
                                        "App Router for modern routing",
                                        "Server-side rendering (SSR)",
                                        "Automatic code splitting",
                                        "Built-in image optimization",
                                        "TypeScript support"
                                    ]}
                                    bgColor="bg-blue-50 border border-blue-200"
                                />
                                <TechStackItem
                                    title="TypeScript"
                                    description=""
                                    items={[
                                        "Strict type checking",
                                        "Interface definitions for all APIs",
                                        "Enhanced IDE support",
                                        "Runtime error prevention",
                                        "Better code documentation"
                                    ]}
                                    bgColor="bg-purple-50 border border-purple-200"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Styling and UI</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <TechStackItem
                                    title="Tailwind CSS v4"
                                    description=""
                                    items={[
                                        "Utility-first styling",
                                        "Responsive design system",
                                        "Dark mode support ready",
                                        "Custom component classes"
                                    ]}
                                    bgColor="bg-cyan-50 border border-cyan-200"
                                />
                                <TechStackItem
                                    title="Lucide React"
                                    description=""
                                    items={[
                                        "Consistent icon system",
                                        "SVG-based icons",
                                        "Tree-shakeable imports",
                                        "Customizable styling"
                                    ]}
                                    bgColor="bg-green-50 border border-green-200"
                                />
                                <TechStackItem
                                    title="React Hot Toast"
                                    description=""
                                    items={[
                                        "User notifications",
                                        "Success/error messages",
                                        "Customizable styling",
                                        "Auto-dismiss timers"
                                    ]}
                                    bgColor="bg-orange-50 border border-orange-200"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Mapping and Geospatial</h3>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="font-medium text-red-900 mb-3">Leaflet.js + React-Leaflet</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="font-medium text-red-800 text-sm mb-1">Core Features:</h5>
                                        <ul className="space-y-1 text-red-700 text-sm">
                                            <li>• Interactive map interface</li>
                                            <li>• OpenStreetMap tile layers</li>
                                            <li>• Custom markers and polylines</li>
                                            <li>• Popup and tooltip system</li>
                                            <li>• Event handling for user interactions</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-red-800 text-sm mb-1">Integration:</h5>
                                        <ul className="space-y-1 text-red-700 text-sm">
                                            <li>• React component wrappers</li>
                                            <li>• TypeScript type definitions</li>
                                            <li>• Server-side rendering compatibility</li>
                                            <li>• Dynamic import for client-only loading</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Form Management</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TechStackItem
                                    title="React Hook Form"
                                    description=""
                                    items={[
                                        "Performant form handling",
                                        "Built-in validation",
                                        "TypeScript integration",
                                        "Minimal re-renders",
                                        "Custom validation rules"
                                    ]}
                                    bgColor="bg-emerald-50 border border-emerald-200"
                                />
                                <TechStackItem
                                    title="Multi-step Forms"
                                    description=""
                                    items={[
                                        "Progressive validation",
                                        "Step navigation",
                                        "Form state persistence",
                                        "Error boundary handling",
                                        "Mobile-optimized UX"
                                    ]}
                                    bgColor="bg-violet-50 border border-violet-200"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Management</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TechStackItem
                                    title="API Integration"
                                    description=""
                                    items={[
                                        "Axios for HTTP requests",
                                        "Request/response interceptors",
                                        "Error handling and retries",
                                        "Token management",
                                        "API abstraction layer"
                                    ]}
                                    bgColor="bg-blue-50 border border-blue-200"
                                />
                                <TechStackItem
                                    title="Date Handling"
                                    description=""
                                    items={[
                                        "date-fns for date operations",
                                        "Timezone-aware processing",
                                        "Relative time formatting",
                                        "Duration calculations",
                                        "Locale support"
                                    ]}
                                    bgColor="bg-teal-50 border border-teal-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Reporting Workflow */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <RefreshCw className="w-6 h-6 text-green-600" />
                        <span>Live Reporting Workflow</span>
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Real-time Data Flow</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <CodeBlock
                                    code={`// Closure reporting workflow
1. User Authentication
   ├── JWT token validation
   ├── User permissions check
   └── Backend connectivity status

2. Location Selection
   ├── Interactive map point selection
   ├── Geometry type determination (Point/LineString)
   ├── Valhalla route calculation (for LineString)
   └── Coordinate validation

3. Form Submission
   ├── Multi-step form validation
   ├── Data transformation and formatting
   ├── OpenLR encoding request (backend)
   └── Database persistence

4. Real-time Updates
   ├── Closure status calculation
   ├── Map visualization update
   ├── Sidebar statistics refresh
   └── User notification`}
                                    language="text"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">API Integration Architecture</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <TechStackItem
                                    title="Backend Communication"
                                    description=""
                                    items={[
                                        "RESTful API endpoints",
                                        "JWT token authentication",
                                        "Request/response validation",
                                        "Error handling and retry logic",
                                        "Automatic token refresh"
                                    ]}
                                    bgColor="bg-green-50 border border-green-200"
                                />
                                <TechStackItem
                                    title="Valhalla Integration"
                                    description=""
                                    items={[
                                        "Route calculation for road segments",
                                        "Automatic path optimization",
                                        "Multiple waypoint support",
                                        "Distance and duration estimation",
                                        "Fallback to direct line on failure"
                                    ]}
                                    bgColor="bg-blue-50 border border-blue-200"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">State Management Flow</h3>
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <CodeBlock
                                    code={`// React Context state management
const ClosuresContext = createContext();

// Reducer for complex state updates
function closuresReducer(state, action) {
  switch (action.type) {
    case 'SET_CLOSURES':
      return { ...state, closures: action.payload };
    case 'ADD_CLOSURE':
      return { 
        ...state, 
        closures: [...state.closures, action.payload] 
      };
    case 'UPDATE_CLOSURE':
      return {
        ...state,
        closures: state.closures.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      };
    // ... more actions
  }
}

// API integration with state updates
const createClosure = async (data) => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const closure = await closuresApi.create(data);
    dispatch({ type: 'ADD_CLOSURE', payload: closure });
    toast.success('Closure created successfully');
  } catch (error) {
    toast.error('Failed to create closure');
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};`}
                                    language="typescript"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Optimizations</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <TechStackItem
                                    title="Map Performance"
                                    description=""
                                    items={[
                                        "Dynamic layer management",
                                        "Bounds-based data fetching",
                                        "Efficient marker clustering",
                                        "Debounced map events"
                                    ]}
                                    bgColor="bg-yellow-50 border border-yellow-200"
                                />
                                <TechStackItem
                                    title="Component Loading"
                                    description=""
                                    items={[
                                        "Dynamic imports for heavy components",
                                        "Lazy loading of map component",
                                        "Code splitting by route",
                                        "Progressive enhancement"
                                    ]}
                                    bgColor="bg-pink-50 border border-pink-200"
                                />
                                <TechStackItem
                                    title="Data Caching"
                                    description=""
                                    items={[
                                        "In-memory closure caching",
                                        "API response optimization",
                                        "Efficient re-rendering patterns",
                                        "Selective component updates"
                                    ]}
                                    bgColor="bg-indigo-50 border border-indigo-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security and Data Handling */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Shield className="w-6 h-6 text-red-600" />
                        <span>Security and Data Handling</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Security Measures</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• JWT token secure storage and validation</li>
                                <li>• CORS policy compliance</li>
                                <li>• Input validation and sanitization</li>
                                <li>• XSS prevention measures</li>
                                <li>• Environment variable protection</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Privacy</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• No persistent storage in demo mode</li>
                                <li>• Minimal data collection</li>
                                <li>• Location data anonymization</li>
                                <li>• User consent for data processing</li>
                                <li>• GDPR compliance ready</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Future Enhancements */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                        <Zap className="w-6 h-6 text-yellow-600" />
                        <span>Future Enhancements</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Planned Features</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Real-time collaboration and live updates</li>
                                <li>• Progressive Web App (PWA) capabilities</li>
                                <li>• Offline mode with sync capabilities</li>
                                <li>• Advanced filtering and search features</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Integration Roadmap</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• OsmAnd mobile app integration</li>
                                <li>• Community moderation tools</li>
                                <li>• Additional map provider support</li>
                                <li>• Enhanced analytics and reporting</li>
                            </ul>
                        </div>
                    </div>

                    <InfoBox type="warning" title="Community Contribution" icon={Heart}>
                        <p>
                            This frontend application is designed to be community-driven and open for contributions.
                            The modular architecture and comprehensive documentation make it easy for developers to
                            extend functionality and add new features that benefit the broader OSM ecosystem.
                        </p>
                    </InfoBox>
                </div>
            </div>
        </div>
    );
};

export default Architecture;