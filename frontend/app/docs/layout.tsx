import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "OSM Road Closures - API Documentation",
    description: "A temporary road closures database and API for OpenStreetMap. Report and view real-time road closures with OpenLR integration. Built for Google Summer of Code 2025.",
    keywords: "OpenStreetMap, road closures, OSM, navigation, OpenLR, GSoC 2025, community reporting, API Documentation, API",
    authors: [{ name: "Archit Rathod" }],
    openGraph: {
        title: "OSM Road Closures - API Documentation",
        description: "A temporary road closures database and API for OpenStreetMap. Report and view real-time road closures with OpenLR integration. Built for Google Summer of Code 2025.",
        type: "website",
    },
};

export default function DocsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            {children}
        </div>
    );
}
