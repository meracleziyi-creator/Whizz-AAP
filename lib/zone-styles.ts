import type { Zone } from "@/lib/asthma-store"

export const ZONE_STYLES: Record<
  Zone,
  { badge: string; dot: string; label: string; ring: string }
> = {
  green: {
    badge: "bg-zone-green text-zone-green-foreground",
    dot: "bg-zone-green",
    label: "Green",
    ring: "ring-zone-green",
  },
  yellow: {
    badge: "bg-zone-yellow text-zone-yellow-foreground",
    dot: "bg-zone-yellow",
    label: "Yellow",
    ring: "ring-zone-yellow",
  },
  red: {
    badge: "bg-zone-red text-zone-red-foreground",
    dot: "bg-zone-red",
    label: "Red",
    ring: "ring-zone-red",
  },
}
