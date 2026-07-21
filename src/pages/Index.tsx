import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryBrowser from "@/components/CategoryBrowser";
import EventsSection from "@/components/EventsSection";
import EventsNearYou from "@/components/EventsNearYou";
import TrendingEvents from "@/components/TrendingEvents";
import PopularOrganizers from "@/components/PopularOrganizers";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { mockEvents } from "@/data/mockEvents";
import { useSponsored, normaliseEvent } from "@/hooks/useSponsored";
import { api } from "@/lib/api";

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("Victoria Island, Lagos");
  const [publicEvents, setPublicEvents] = useState<any[]>([]);

  // Real sponsored / most-viewed events from the API
  const { data: sponsoredEvents = [] } = useSponsored();

  useEffect(() => {
    api.get("public/events")
      .then((res: any) => {
        const raw = res?.events || res?.data || (Array.isArray(res) ? res : []);
        if (raw && raw.length > 0) {
          setPublicEvents(raw.map(normaliseEvent));
        }
      })
      .catch((err) => console.error("Failed to load public events on Index page:", err));
  }, []);

  const allEvents = publicEvents.length > 0 ? publicEvents : mockEvents;

  const filteredEvents = useMemo(() => {
    if (!selectedLocation) return allEvents;
    return allEvents.filter((event) =>
      (event.location || "").toLowerCase().includes(selectedLocation.toLowerCase())
    );
  }, [selectedLocation, allEvents]);

  const recommended = useMemo(() =>
    (filteredEvents.length > 0 ? filteredEvents : allEvents).filter((e) => !e.featured).slice(0, 6),
    [filteredEvents, allEvents]
  );

  // Trending: sponsored events first, filled up with public events if needed
  const trendingEvents = useMemo(() => {
    if (sponsoredEvents.length >= 6) return sponsoredEvents.slice(0, 6);
    const sponsoredIds = new Set(sponsoredEvents.map((e) => e.id));
    const fill = [...allEvents]
      .filter((e) => !sponsoredIds.has(e.id))
      .sort((a, b) => (b.attendees || 0) - (a.attendees || 0))
      .slice(0, 6 - sponsoredEvents.length);
    return [...sponsoredEvents, ...fill];
  }, [sponsoredEvents, allEvents]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        selectedLocation={selectedLocation}
        onLocationSelect={setSelectedLocation}
      />
      <div>
        <HeroCarousel />
        <CategoryBrowser />
        <TrendingEvents events={trendingEvents} />
        <EventsSection
          title={selectedLocation ? `Recommended in ${selectedLocation}` : "Recommended for You"}
          subtitle="Handpicked events you'll love"
          events={recommended}
        />
        <div className="border-t border-border/30" />
        <EventsNearYou
          events={allEvents}
          city={selectedLocation}
          onCityChange={(city) => setSelectedLocation(city || "Lagos")}
        />
        <div className="border-t border-border/30" />
        <PopularOrganizers />
        <div className="border-t border-border/30" />
        <Newsletter />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
