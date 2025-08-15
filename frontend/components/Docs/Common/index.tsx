import React from 'react';
import { LucideIcon } from 'lucide-react';

// Types for EndPointCard parameters
export interface Parameter {
    name: string;
    type: string;
    description: string;
    required?: boolean;
}

// Feature card component used in intro sections
interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    iconColor?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
    icon: Icon,
    title,
    description,
    iconColor = "text-blue-600"
}) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
        <Icon className={`w-8 h-8 ${iconColor} mb-3`} />
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
    </div>
);

// Section header with gradient background
interface SectionHeaderProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, children }) => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-xl text-gray-600 mb-6">{description}</p>
        {children}
    </div>
);

// Info box component
interface InfoBoxProps {
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    children: React.ReactNode;
    icon?: LucideIcon;
}

export const InfoBox: React.FC<InfoBoxProps> = ({ type, title, children, icon: Icon }) => {
    const styles = {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800"
    };

    const contentStyles = {
        info: "text-blue-700",
        warning: "text-yellow-700",
        success: "text-green-700",
        error: "text-red-700"
    };

    return (
        <div className={`${styles[type]} border rounded-lg p-6`}>
            <div className="flex items-start space-x-3">
                {Icon && <Icon className="w-6 h-6 mt-1" />}
                <div>
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <div className={contentStyles[type]}>{children}</div>
                </div>
            </div>
        </div>
    );
};

// Step card for tutorials
interface StepCardProps {
    stepNumber: number;
    title: string;
    children: React.ReactNode;
}

export const StepCard: React.FC<StepCardProps> = ({ stepNumber, title, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {stepNumber}
            </span>
            <span>{title}</span>
        </h2>
        {children}
    </div>
);

// Tech stack grid
interface TechStackItemProps {
    title: string;
    description: string;
    items: string[];
    bgColor?: string;
}

export const TechStackItem: React.FC<TechStackItemProps> = ({
    title,
    description,
    items,
    bgColor = "bg-gray-50"
}) => (
    <div className={`${bgColor} rounded-lg p-4`}>
        <h4 className="font-medium text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm mb-3">{description}</p>
        <ul className="text-sm text-gray-600 space-y-1">
            {items.map((item, index) => (
                <li key={index}>• {item}</li>
            ))}
        </ul>
    </div>
);