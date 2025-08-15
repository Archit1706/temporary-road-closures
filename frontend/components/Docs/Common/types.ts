import { LucideIcon } from 'lucide-react';

// Common component props
export interface ComponentProps {
    className?: string;
    children?: React.ReactNode;
}

// Feature card types
export interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    iconColor?: string;
}

// Section header types
export interface SectionHeaderProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

// Info box types
export type InfoBoxType = 'info' | 'warning' | 'success' | 'error';

export interface InfoBoxProps {
    type: InfoBoxType;
    title: string;
    children: React.ReactNode;
    icon?: LucideIcon;
}

// Step card types
export interface StepCardProps {
    stepNumber: number;
    title: string;
    children: React.ReactNode;
}

// Tech stack item types
export interface TechStackItemProps {
    title: string;
    description: string;
    items: string[];
    bgColor?: string;
}

// Parameters for API endpoints
export interface Parameter {
    name: string;
    type: string;
    description: string;
    required?: boolean;
}

// Code example types
export interface CodeExample {
    title: string;
    code: string;
    language: string;
    description?: string;
}

// Documentation section types
export interface DocumentationSection {
    id: string;
    title: string;
    description?: string;
    component: React.ComponentType;
}

// Navigation types
export interface NavigationItem {
    id: string;
    title: string;
    href: string;
    icon?: LucideIcon;
    children?: NavigationItem[];
}

// Theme types
export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
}

// Generic API response types
export interface ApiResponse<T = any> {
    data: T;
    status: number;
    message?: string;
}

export interface PaginatedResponse<T = any> {
    items: T[];
    total: number;
    page: number;
    size: number;
    pages: number;
}

// Error types
export interface ApiError {
    message: string;
    code?: string;
    details?: any;
}

// User types (for examples)
export interface User {
    id: number;
    username: string;
    email: string;
    full_name: string;
    is_active: boolean;
    is_moderator: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at?: string;
}

// Geometry types (for examples)
export interface Point {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface LineString {
    type: 'LineString';
    coordinates: [number, number][];
}

export type Geometry = Point | LineString;

// Closure types (for examples)
export interface Closure {
    id: number;
    geometry: Geometry;
    description: string;
    closure_type: string;
    start_time: string;
    end_time: string;
    status: 'active' | 'expired' | 'cancelled' | 'planned';
    openlr_code?: string;
    submitter_id: number;
    source?: string;
    confidence_level: number;
    is_bidirectional: boolean;
    is_valid: boolean;
    duration_hours?: number;
    created_at: string;
    updated_at: string;
}

// Authentication types
export interface AuthToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    full_name: string;
}