import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Event } from "@/data/mockEvents";

/**
 * Normalises a raw backend event object (from the Laravel API) into the
 * frontend Event interface so every consumer stays type-safe.
 */
export function normaliseEvent(be: any): Event {
  // Resolve location string from the locations[] array or a plain string field
  let location = "Location TBD";
  if (be.locations && Array.isArray(be.locations) && be.locations.length > 0) {
    const loc = be.locations[0];
    location = loc.address || loc.name || loc.city || "Location TBD";
  } else if (typeof be.location === "string") {
    location = be.location;
  } else if (be.location && typeof be.location === "object") {
    location = be.location.address || be.location.name || be.location.city || "Location TBD";
  }

  // Resolve category
  let category: Event["category"] = "social";
  if (be.category) {
    const raw =
      typeof be.category === "string"
        ? be.category.toLowerCase()
        : (be.category.name || be.category.slug || "social").toLowerCase();
    const valid: Event["category"][] = [
      "sports", "movies", "music", "religious", "conferences",
      "social", "festivals", "gaming", "exhibitions",
    ];
    category = valid.includes(raw as Event["category"])
      ? (raw as Event["category"])
      : "social";
  }

  // Resolve time string from start_date
  const timeStr = be.start_date
    ? new Date(be.start_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : be.time || "";

  return {
    id: be.id?.toString() ?? "",
    title: be.title || "Untitled Event",
    description: be.description || "",
    date: be.start_date || be.date || new Date().toISOString(),
    start_date: be.start_date,
    time: timeStr,
    location,
    image:
      be.image_url ||
      be.image ||
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
    price: parseFloat(be.price) || 0,
    organizer: be.organizer
      ? be.organizer.organization_name || be.organizer.name || "Unknown Organizer"
      : "Unknown Organizer",
    attendees: be.capacity || be.attendees_count || be.attendees || 0,
    attendees_count: be.capacity || be.attendees_count || be.attendees || 0,
    category,
    featured: be.is_sponsored ?? false,
  };
}

/**
 * Fetches sponsored events from GET /public/sponsored-events.
 */
export function useSponsored() {
  return useQuery<Event[]>({
    queryKey: ["sponsored-events"],
    queryFn: async () => {
      try {
        const res = await api.get("public/sponsored-events");
        const raw: any[] = res?.events ?? [];
        return raw.map(normaliseEvent);
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,   // 5 min — matches server cache TTL
    gcTime: 10 * 60 * 1000,     // keep in cache for 10 min
    retry: 1,
  });
}
