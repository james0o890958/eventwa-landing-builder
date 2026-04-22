import { useState, useMemo } from "react";
import { MapPin, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import type { Event } from "@/data/mockEvents";

const NIGERIAN_CITIES: { name: string; lat: number; lng: number }[] = [
  { name: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Abuja", lat: 9.0579, lng: 7.4951 },
  { name: "Port Harcourt", lat: 4.8156, lng: 7.0498 },
  { name: "Calabar", lat: 4.9517, lng: 8.322 },
  { name: "Ibadan", lat: 7.3776, lng: 3.947 },
  { name: "Owerri", lat: 5.485, lng: 7.0352 },
  { name: "Aba", lat: 5.1066, lng: 7.3667 },
  { name: "Osogbo", lat: 7.7827, lng: 4.5418 },
  { name: "Ota", lat: 6.6918, lng: 3.2335 },
  { name: "Lekki", lat: 6.4698, lng: 3.5852 },
];

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNearestCity(lat: number, lng: number) {
  let nearest = NIGERIAN_CITIES[0];
  let minDist = Infinity;
  for (const city of NIGERIAN_CITIES) {
    const d = haversineDistance(lat, lng, city.lat, city.lng);
    if (d < minDist) {
      minDist = d;
      nearest = city;
    }
  }
  return nearest.name;
}

function filterEventsByCity(events: Event[], city: string) {
  return events.filter((e) =>
    e.location.toLowerCase().includes(city.toLowerCase()),
  );
}

function isToday(dateStr: string) {
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

function isThisWeekend(dateStr: string) {
  const eventDate = new Date(dateStr);
  const today = new Date();
  const day = today.getDay(); // 0 Sun, 6 Sat
  const daysUntilSat = day === 6 ? 0 : 6 - day;
  const daysUntilSun = day === 0 ? 0 : 7 - day;
  const sat = new Date(today);
  sat.setDate(today.getDate() + daysUntilSat);
  sat.setHours(0, 0, 0, 0);
  const sun = new Date(today);
  sun.setDate(today.getDate() + daysUntilSun);
  sun.setHours(23, 59, 59, 999);
  return eventDate >= sat && eventDate <= sun;
}

type FilterTab = "all" | "for-you" | "today" | "this-weekend";

const ALL_CITIES = ["All", ...NIGERIAN_CITIES.map((c) => c.name)];

const TABS: { id: FilterTab; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "🗂️" },
  { id: "for-you", label: "For You", emoji: "✨" },
  { id: "today", label: "Today", emoji: "📅" },
  { id: "this-weekend", label: "This Weekend", emoji: "🎉" },
];

interface EventsNearYouProps {
  events: Event[];
}

const EventsNearYou = ({ events }: EventsNearYouProps) => {
  const [city, setCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Stable "For You" list — random subset, computed once
  const forYouEvents = useMemo(
    () => [...events].sort(() => Math.random() - 0.5).slice(0, 6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detected = getNearestCity(
          pos.coords.latitude,
          pos.coords.longitude,
        );
        setCity(detected);
        setLoading(false);
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      },
      { timeout: 10000 },
    );
  };

  const selectCity = (c: string) => {
    setCity(c === "All" ? null : c);
    setShowDropdown(false);
    setError(null);
  };

  // Step 1: city filter
  const cityFiltered = city ? filterEventsByCity(events, city) : events;

  // Step 2: tab filter
  let tabFiltered: Event[];
  if (activeTab === "for-you") {
    tabFiltered = city ? filterEventsByCity(forYouEvents, city) : forYouEvents;
  } else if (activeTab === "today") {
    tabFiltered = cityFiltered.filter((e) => isToday(e.date));
  } else if (activeTab === "this-weekend") {
    tabFiltered = cityFiltered.filter((e) => isThisWeekend(e.date));
  } else {
    tabFiltered = cityFiltered;
  }

  const displayed =
    tabFiltered.length > 0 ? tabFiltered.slice(0, 6) : events.slice(0, 6);
  const isEmpty = tabFiltered.length === 0;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 font-display text-3xl font-bold text-foreground">
          Events Near You
        </h2>
        <p className="mb-6 text-muted-foreground">
          Discover what's happening around you
        </p>

        {/* Location bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-3 backdrop-blur-sm">
          <MapPin className="h-5 w-5 text-primary shrink-0" />

          {city ? (
            <span className="text-sm font-medium text-foreground">
              Showing events in <span className="text-primary">{city}</span>
            </span>
          ) : error ? (
            <span className="text-sm text-destructive">{error}</span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Enable location to see events near you
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={requestLocation}
              disabled={loading}
              className="text-xs"
            >
              {loading ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <MapPin className="mr-1 h-3 w-3" />
              )}
              {city ? "Update" : "Use my location"}
            </Button>

            {/* Manual city selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-xs"
              >
                Choose city
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
              {showDropdown && (
                <div className="absolute right-0 top-full z-50 mt-1 max-h-48 w-40 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
                  {ALL_CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => selectCity(c)}
                      className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                        (c === "All" && !city) || c === city
                          ? "font-semibold text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "gradient-primary text-white shadow-glow"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Empty state for time-based tabs */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="mb-3 text-5xl">
              {activeTab === "today" ? "📅" : "🎉"}
            </span>
            <p className="font-display text-lg font-semibold text-foreground">
              {activeTab === "today"
                ? "No events today"
                : "No events this weekend"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {city
                ? `Nothing scheduled in ${city} right now.`
                : "Nothing scheduled right now."}{" "}
              Try the{" "}
              <button
                onClick={() => setActiveTab("all")}
                className="text-primary underline"
              >
                All
              </button>{" "}
              tab to see upcoming events.
            </p>
          </div>
        ) : (
          <>
            {tabFiltered.length === 0 && city && activeTab === "all" && (
              <p className="mb-6 text-sm text-muted-foreground">
                No events found in {city}. Showing all events instead.
              </p>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayed.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EventsNearYou;
