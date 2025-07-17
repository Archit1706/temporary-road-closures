import React from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Github, BookOpen } from 'lucide-react';

interface CTASectionProps {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    variant: 'primary' | 'secondary' | 'tertiary';
    isExternal?: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({
    title,
    description,
    buttonText,
    buttonLink,
    variant,
    isExternal = false
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    sectionBg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
                    textColor: 'text-white',
                    descColor: 'text-blue-100',
                    buttonBg: 'bg-white text-blue-600 hover:bg-blue-50',
                    icon: ArrowRight,
                    decorationColor: 'bg-blue-400'
                };
            case 'secondary':
                return {
                    sectionBg: 'bg-gray-50',
                    textColor: 'text-gray-900',
                    descColor: 'text-gray-600',
                    buttonBg: 'bg-blue-600 text-white hover:bg-blue-700',
                    icon: BookOpen,
                    decorationColor: 'bg-blue-200'
                };
            case 'tertiary':
                return {
                    sectionBg: 'bg-gradient-to-r from-gray-900 to-gray-800',
                    textColor: 'text-white',
                    descColor: 'text-gray-300',
                    buttonBg: 'bg-green-600 text-white hover:bg-green-700',
                    icon: Github,
                    decorationColor: 'bg-gray-600'
                };
            default:
                return {
                    sectionBg: 'bg-blue-600',
                    textColor: 'text-white',
                    descColor: 'text-blue-100',
                    buttonBg: 'bg-white text-blue-600 hover:bg-blue-50',
                    icon: ArrowRight,
                    decorationColor: 'bg-blue-400'
                };
        }
    };

    const styles = getVariantStyles();
    const Icon = styles.icon;

    const ButtonComponent = isExternal ? 'a' : Link;
    const buttonProps = isExternal
        ? { href: buttonLink, target: '_blank', rel: 'noopener noreferrer' }
        : { href: buttonLink };

    return (
        <section className={`relative py-16 lg:py-20 ${styles.sectionBg} overflow-hidden`}>
            {/* Background Decorations */}
            <div className="absolute inset-0">
                <div className={`absolute top-10 left-10 w-20 h-20 ${styles.decorationColor} rounded-full opacity-20 animate-pulse`}></div>
                <div className={`absolute bottom-10 right-10 w-32 h-32 ${styles.decorationColor} rounded-full opacity-10 animate-bounce`}></div>
                <div className={`absolute top-1/2 left-1/4 w-16 h-16 ${styles.decorationColor} rounded-full opacity-15 animate-pulse`} style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${styles.textColor} mb-6`}>
                    {title}
                </h2>

                <p className={`text-lg sm:text-xl ${styles.descColor} mb-8 max-w-2xl mx-auto leading-relaxed`}>
                    {description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <ButtonComponent
                        {...buttonProps}
                        className={`
                            inline-flex items-center px-8 py-4 rounded-lg font-semibold transition-all duration-300
                            ${styles.buttonBg} shadow-lg hover:shadow-xl transform hover:scale-105 group
                        `}
                    >
                        <Icon className="mr-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        {buttonText}
                        {isExternal && (
                            <ExternalLink className="ml-2 w-4 h-4" />
                        )}
                    </ButtonComponent>
                </div>

                {/* Additional Context for Different Variants */}
                {variant === 'primary' && (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-white">25+</div>
                            <div className="text-blue-200 text-sm">Sample Closures</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-white">Real-time</div>
                            <div className="text-blue-200 text-sm">Updates</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-2xl font-bold text-white">Chicago</div>
                            <div className="text-blue-200 text-sm">Demo Area</div>
                        </div>
                    </div>
                )}

                {variant === 'secondary' && (
                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            OpenAPI 3.0
                        </span>
                        <span className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            RESTful endpoints
                        </span>
                        <span className="flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            FastAPI powered
                        </span>
                    </div>
                )}

                {variant === 'tertiary' && (
                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-full text-gray-300 text-sm">
                            <Github className="w-4 h-4 mr-2" />
                            Open Source • MIT License • GSoC 2025
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CTASection;