"use client"
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// Code Block Component
const CodeBlock = ({ code, language = 'json' }: { code: string, language?: string }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-sm text-gray-300 font-medium">{language}</span>
                <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-100">{code}</code>
            </pre>
        </div>
    );
};

export default CodeBlock;