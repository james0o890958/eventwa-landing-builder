import { useState, useMemo } from "react";
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
import { useSponsored } from "@/hooks/useSponsored";

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("Victoria Island, Lagos");

  // Real sponsored / most-viewed events from the API
  const { data: sponsoredEvents = [] } = useSponsored();

  const filteredEvents = useMemo(() => {
    if (!selectedLocation) return mockEvents;
    return mockEvents.filter((event) =>
      event.location.toLowerCase().includes(selectedLocation.toLowerCase())
    );
  }, [selectedLocation]);

  const recommended = useMemo(() =>
    filteredEvents.filter((e) => !e.featured).slice(0, 6),
    [filteredEvents]
  );

  const displayEvents = filteredEvents.length > 0 ? filteredEvents : mockEvents;

  // Trending: sponsored events first, filled up with mock events if needed
  const trendingEvents = useMemo(() => {
    if (sponsoredEvents.length >= 6) return sponsoredEvents.slice(0, 6);
    const sponsoredIds = new Set(sponsoredEvents.map((e) => e.id));
    const mockFill = [...mockEvents]
      .filter((e) => !sponsoredIds.has(e.id))
      .sort((a, b) => b.attendees - a.attendees)
      .slice(0, 6 - sponsoredEvents.length);
    return [...sponsoredEvents, ...mockFill];
  }, [sponsoredEvents]);

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
          events={mockEvents}
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
