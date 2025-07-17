"use client"
import React from 'react';
import { ClosuresProvider } from '@/context/ClosuresContext';
import Navbar from '@/components/Home/Navbar';
import Hero from '@/components/Home/Hero';
import Features from '@/components/Home/Features';
import CTASection from '@/components/Home/CTASection';
import Footer from '@/components/Home/Footer';

export default function HomePage() {
  return (
    <ClosuresProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <CTASection
          title="View Live Road Closures"
          description="Access real-time road closure information from the OpenStreetMap community"
          buttonText="View Closures"
          buttonLink="/closures"
          variant="primary"
        />
        <Features />
        <CTASection
          title="API Documentation"
          description="Integrate our road closures data into your applications with our comprehensive API"
          buttonText="View API Docs"
          buttonLink="http://localhost:8000/docs"
          variant="secondary"
          isExternal
        />
        <CTASection
          title="Contribute to the Project"
          description="Help us improve the OSM road closures system. Contribute code, report issues, or suggest features"
          buttonText="View on GitHub"
          buttonLink="https://github.com/Archit1706/temporary-road-closures"
          variant="tertiary"
          isExternal
        />
        <Footer />
      </div>
    </ClosuresProvider>
  );
}