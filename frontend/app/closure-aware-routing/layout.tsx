import type { Metadata } from "next";

export const metadata: Metadata = {
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

export default function ClosureAwareRoutingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
