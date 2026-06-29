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

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("Victoria Island, Lagos");

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        selectedLocation={selectedLocation} 
        onLocationSelect={setSelectedLocation} 
      />
      <div>
        <HeroCarousel />
        <CategoryBrowser />
        <TrendingEvents events={displayEvents} />
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
