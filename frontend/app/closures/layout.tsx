import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "OSM Road Closures - Community-driven Reporting Platform",
    description: "A temporary road closures database and API for OpenStreetMap. Report and view real-time road closures with OpenLR integration. Built for Google Summer of Code 2025.",
    keywords: "OpenStreetMap, road closures, OSM, navigation, OpenLR, GSoC 2025, community reporting",
    authors: [{ name: "Archit Rathod" }],
    openGraph: {
        title: "OSM Road Closures Platform",
        description: "Community-driven road closure reporting for OpenStreetMap",
        type: "website",
    },
};

export default function ClosuresLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
