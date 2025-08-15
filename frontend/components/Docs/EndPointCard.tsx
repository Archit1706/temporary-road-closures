"use client"
import React from 'react';
import CodeBlock from './CodeBlock';

// Endpoint Component
const EndPointCard = ({ method, path, description, requestBody, responseBody, parameters }: {
    method: string,
    path: string,
    description: string,
    requestBody?: string,
    responseBody?: string,
    parameters?: { name: string, type: string, description: string, required?: boolean }[]
}) => {
    const getMethodColor = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET': return 'bg-green-100 text-green-800';
            case 'POST': return 'bg-blue-100 text-blue-800';
            case 'PUT': return 'bg-yellow-100 text-yellow-800';
            case 'DELETE': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMethodColor(method)}`}>
                        {method.toUpperCase()}
                    </span>
                    <code className="text-lg font-mono text-gray-900">{path}</code>
                </div>
                <p className="text-gray-600">{description}</p>
            </div>

            <div className="p-6 space-y-6">
                {parameters && parameters.length > 0 && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Parameters</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-2 pr-4 text-sm font-medium text-gray-900">Name</th>
                                        <th className="text-left py-2 pr-4 text-sm font-medium text-gray-900">Type</th>
                                        <th className="text-left py-2 pr-4 text-sm font-medium text-gray-900">Required</th>
                                        <th className="text-left py-2 text-sm font-medium text-gray-900">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parameters.map((param, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-2 pr-4 text-sm font-mono text-gray-900">{param.name}</td>
                                            <td className="py-2 pr-4 text-sm text-gray-600">{param.type}</td>
                                            <td className="py-2 pr-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs ${param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {param.required ? 'Required' : 'Optional'}
                                                </span>
                                            </td>
                                            <td className="py-2 text-sm text-gray-600">{param.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {requestBody && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Request Body</h4>
                        <CodeBlock code={requestBody} />
                    </div>
                )}

                {responseBody && (
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Response</h4>
                        <CodeBlock code={responseBody} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EndPointCard;