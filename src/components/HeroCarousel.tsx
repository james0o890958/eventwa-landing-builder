import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockEvents } from "@/data/mockEvents";
import { Link } from "react-router-dom";

const featured = mockEvents.filter((e) => e.featured);

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goNext = () => setCurrent((p) => (p + 1) % featured.length);
  const goPrev = () =>
    setCurrent((p) => (p - 1 + featured.length) % featured.length);

  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is dominant and long enough
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const event = featured[current];

  return (
    <section
      className="relative h-[85vh] min-h-[500px] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={event.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container relative mx-auto flex h-full items-end px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={event.id + "-content"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl"
          >
            <span className="mb-3 inline-block rounded-full gradient-primary px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              {event.category}
            </span>
            <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {event.title}
            </h1>
            <p className="mb-6 max-w-lg text-base text-secondary-foreground/80 line-clamp-2">
              {event.description}
            </p>
            <div className="mb-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-primary" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                {event.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" />
                {event.attendees.toLocaleString()} attending
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to={`/event/${event.id}`}>
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-base px-8"
                >
                  {event.price === 0
                    ? "Join Free"
                    : `Get Tickets · ₦${event.price.toLocaleString()}`}
                </Button>
              </Link>
              <Link to={`/event/${event.id}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/50 text-foreground hover:bg-secondary"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2">
        <button
          onClick={goPrev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-1.5 px-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? "w-8 bg-primary" : "w-1.5 bg-muted-foreground/40"}`}
            />
          ))}
        </div>
        <button
          onClick={goNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-secondary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
};

export default HeroCarousel;
