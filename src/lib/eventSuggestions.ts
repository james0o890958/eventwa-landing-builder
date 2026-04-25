import type { Event } from "@/data/mockEvents";

export interface SuggestionOptions {
  allEvents: Event[];
  savedEventIds: string[];
  excludeEventIds?: string[];
  userLocation?: string;
  maxSuggestions?: number;
}

const normalize = (value: string | undefined) => value?.toLowerCase().trim() ?? "";

const shuffleEvents = (events: Event[]) => {
  const items = [...events];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};

const getTrendingEvents = (events: Event[], limit: number) =>
  [...events].sort((a, b) => b.attendees - a.attendees).slice(0, limit);

const getSimilarEvents = (
  events: Event[],
  savedCategories: Set<string>,
  limit: number
) =>
  [...events]
    .filter((event) => savedCategories.has(event.category))
    .sort((a, b) => b.attendees - a.attendees)
    .slice(0, limit);

const getLocationMatches = (
  events: Event[],
  userLocation: string,
  limit: number
) => {
  const query = normalize(userLocation);
  return [...events]
    .filter((event) => normalize(event.location).includes(query))
    .sort((a, b) => b.attendees - a.attendees)
    .slice(0, limit);
};

export const generateEventSuggestions = ({
  allEvents,
  savedEventIds,
  excludeEventIds = [],
  userLocation,
  maxSuggestions = 6,
}: SuggestionOptions): Event[] => {
  const excluded = new Set<string>([...excludeEventIds, ...savedEventIds]);
  const availableEvents = allEvents.filter((event) => !excluded.has(event.id));

  const savedCategorySet = new Set(
    allEvents
      .filter((event) => savedEventIds.includes(event.id))
      .map((event) => event.category)
  );

  const selected: Event[] = [];
  const selectedIds = new Set<string>();

  const addEvents = (events: Event[]) => {
    for (const event of events) {
      if (selected.length >= maxSuggestions) break;
      if (!selectedIds.has(event.id)) {
        selected.push(event);
        selectedIds.add(event.id);
      }
    }
  };

  addEvents(getTrendingEvents(availableEvents, 2));

  if (savedCategorySet.size > 0) {
    const remaining = availableEvents.filter((event) => !selectedIds.has(event.id));
    addEvents(getSimilarEvents(remaining, savedCategorySet, 2));
  }

  if (userLocation) {
    const remaining = availableEvents.filter((event) => !selectedIds.has(event.id));
    addEvents(getLocationMatches(remaining, userLocation, 1));
  }

  const remaining = availableEvents.filter((event) => !selectedIds.has(event.id));
  addEvents(shuffleEvents(remaining));

  return selected.slice(0, maxSuggestions);
};
