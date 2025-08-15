import React from 'react';
import { Zap, ExternalLink } from 'lucide-react';
import { InfoBox, StepCard } from '../../Common';
import CodeBlock from '../../CodeBlock';

const GettingStarted: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Getting Started</h1>
                <p className="text-lg text-gray-600">
                    Quick guide to start using the OSM Road Closures API.
                </p>
            </div>

            <InfoBox type="warning" title="Quick Start" icon={Zap}>
                <p>
                    The API is currently running in development mode. For production deployment,
                    follow the deployment guide.
                </p>
            </InfoBox>

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Base URL</h2>
                    <CodeBlock code="http://localhost:8000/api/v1" language="text" />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Documentation</h2>
                    <p className="text-gray-600 mb-4">
                        The API provides interactive documentation using Swagger UI:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Swagger UI</h3>
                            <p className="text-sm text-gray-600 mb-3">Interactive API explorer with authentication</p>
                            <a
                                href="http://localhost:8000/api/v1/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700"
                            >
                                <span>Open Swagger UI</span>
                                <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">OpenAPI Schema</h3>
                            <p className="text-sm text-gray-600 mb-3">Machine-readable API specification</p>
                            <a
                                href="http://localhost:8000/api/v1/openapi.json"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-700"
                            >
                                <span>View Schema</span>
                                <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
                    <p className="text-gray-600 mb-4">
                        The API supports multiple authentication methods:
                    </p>

                    <div className="space-y-4">
                        <StepCard stepNumber={1} title="Register an Account">
                            <CodeBlock
                                code={`curl -X POST "http://localhost:8000/api/v1/auth/register" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "your_username",
    "email": "your@email.com",
    "password": "SecurePass123",
    "full_name": "Your Full Name"
  }'`}
                                language="bash"
                            />
                        </StepCard>

                        <StepCard stepNumber={2} title="Login to Get Token">
                            <CodeBlock
                                code={`curl -X POST "http://localhost:8000/api/v1/auth/login" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "username=your_username&password=SecurePass123"`}
                                language="bash"
                            />
                        </StepCard>

                        <StepCard stepNumber={3} title="Use Token in Requests">
                            <CodeBlock
                                code={`curl -X GET "http://localhost:8000/api/v1/auth/me" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}
                                language="bash"
                            />
                        </StepCard>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Example: Create a Closure</h2>
                    <CodeBlock
                        code={`curl -X POST "http://localhost:8000/api/v1/closures/" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "geometry": {
      "type": "LineString",
      "coordinates": [[-87.6298, 41.8781], [-87.6290, 41.8785]]
    },
    "description": "Water main repair blocking eastbound traffic",
    "closure_type": "construction",
    "start_time": "2025-07-09T08:00:00Z",
    "end_time": "2025-07-09T18:00:00Z",
    "source": "City of Chicago",
    "confidence_level": 9,
    "is_bidirectional": false
  }'`}
                        language="bash"
                    />
                </div>
            </div>
        </div>
    );
};

export default GettingStarted;