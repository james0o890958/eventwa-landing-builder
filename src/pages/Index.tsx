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
  const recommended = mockEvents.filter((e) => !e.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroCarousel />
      <CategoryBrowser />
      <TrendingEvents />
      <EventsSection
        title="Recommended for You"
        subtitle="Handpicked events you'll love"
        events={recommended}
      />
      <div className="border-t border-border/30" />
      <EventsNearYou events={mockEvents} />
      <div className="border-t border-border/30" />
      <PopularOrganizers />
      <div className="border-t border-border/30" />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
