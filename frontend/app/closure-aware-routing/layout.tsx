import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    // closure aware routing
    title: "Closure Aware Routing - Route planning that avoids temporary road closures",
    description: "A route planning tool that avoids temporary road closures. Built as a prototype to show how temporary road closures can be avoided using OpenLR and Valhalla API.",
    keywords: "OpenStreetMap, closure aware routing, OSM, navigation, OpenLR, GSoC 2025, community reporting",
    authors: [{ name: "Archit Rathod" }],
    openGraph: {
        title: "Closure Aware Routing",
        description: "Route planning that avoids temporary road closures",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
