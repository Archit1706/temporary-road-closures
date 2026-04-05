import { type Closure } from "@/services/api";

export type TransportationMode = "auto" | "bicycle" | "pedestrian";

type ClosureType = Closure["closure_type"];
type TransportMode = Closure["transport_mode"];

const transportModeMap: Record<TransportMode, TransportationMode[]> = {
  all: ["auto", "bicycle", "pedestrian"],
  car: ["auto"],
  hgv: ["auto"],
  bicycle: ["bicycle"],
  foot: ["pedestrian"],
  motorcycle: ["auto"],
  bus: ["auto"],
  emergency: ["auto"],
};

export const closureTypeEffects: Record<ClosureType, TransportationMode[]> = {
  construction: ["auto", "bicycle"],
  accident: ["auto", "bicycle"],
  event: ["auto"],
  maintenance: ["auto", "bicycle"],
  weather: ["auto", "bicycle", "pedestrian"],
  emergency: ["auto", "bicycle", "pedestrian"],
  other: ["auto", "bicycle", "pedestrian"],
  sidewalk_repair: ["pedestrian"],
  bike_lane_closure: ["bicycle"],
  bridge_closure: ["auto", "bicycle", "pedestrian"],
  tunnel_closure: ["auto", "bicycle", "pedestrian"],
};

export function doesClosureAffectMode(
  closure: Closure,
  mode: TransportationMode
): boolean {
  const affectedByType =
    closureTypeEffects[closure.closure_type] ?? transportModeMap.all;
  const affectedByTransport =
    transportModeMap[closure.transport_mode] ?? transportModeMap.all;

  return (
    affectedByType.includes(mode) &&
    affectedByTransport.includes(mode) &&
    closure.status === "active"
  );
}
