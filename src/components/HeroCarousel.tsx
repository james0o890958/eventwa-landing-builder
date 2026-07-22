import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Users,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSponsored } from "@/hooks/useSponsored";
import { Link } from "react-router-dom";

const HeroCarousel = () => {
  const { data: events = [], isLoading } = useSponsored();
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Reset to first slide when event list changes (e.g. after fetch)
  useEffect(() => {
    setCurrent(0);
  }, [events.length]);

  const goNext = () =>
    setCurrent((p) => (p + 1) % Math.max(events.length, 1));
  const goPrev = () =>
    setCurrent((p) => (p - 1 + Math.max(events.length, 1)) % Math.max(events.length, 1));

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [events.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className="relative h-[85vh] min-h-[500px] w-full overflow-hidden bg-secondary/30">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-background/80 via-secondary/40 to-secondary/20" />
        <div className="container relative mx-auto flex h-full items-end px-4 pb-20">
          <div className="max-w-2xl space-y-4">
            <div className="h-6 w-28 rounded-full bg-secondary animate-pulse" />
            <div className="h-14 w-3/4 rounded-xl bg-secondary animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-secondary/70 animate-pulse" />
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-36 rounded-full bg-secondary animate-pulse" />
              <div className="h-12 w-28 rounded-full bg-secondary animate-pulse" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="h-10 w-10 text-muted-foreground/30 animate-spin" />
        </div>
      </section>
    );
  }

  // ── No events guard (should never happen due to fallback, but just in case) ─
  if (events.length === 0) return null;

  const event = events[Math.min(current, events.length - 1)];

  return (
    <section
      className="relative h-[65vh] sm:h-[75vh] md:h-[85vh] min-h-[420px] sm:min-h-[500px] w-full max-w-full overflow-hidden"
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
          className="absolute inset-0 max-w-full"
        >
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover max-w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="container relative mx-auto flex h-full items-end px-4 sm:px-6 pb-20 sm:pb-20 max-w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={event.id + "-content"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl w-full"
          >
            <span className="mb-2 sm:mb-3 inline-block rounded-full gradient-primary px-3 sm:px-4 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              {event.category}
            </span>
            <h1 className="mb-2 sm:mb-4 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground line-clamp-2">
              {event.title}
            </h1>
            <p className="mb-4 sm:mb-6 max-w-lg text-xs sm:text-base text-secondary-foreground/80 line-clamp-2">
              {event.description}
            </p>
            <div className="mb-4 sm:mb-8 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5 truncate max-w-[180px] sm:max-w-none">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
                {(event.attendees ?? 0).toLocaleString()} attending
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to={`/event/${event.id}`}>
                <Button
                  size="lg"
                  className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-xs sm:text-base px-5 sm:px-8 h-10 sm:h-11"
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
                  className="border-border/50 text-foreground hover:bg-secondary text-xs sm:text-base px-4 sm:px-6 h-10 sm:h-11"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls — fitting 100% perfectly within mobile bounds */}
      {events.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:right-6 flex items-center justify-between sm:justify-end gap-2 max-w-full z-20 pointer-events-auto">
          <button
            onClick={goPrev}
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground backdrop-blur-md transition-colors hover:bg-secondary shrink-0 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <div className="flex gap-1.5 px-2 items-center">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-6 sm:w-8 bg-primary" : "w-1.5 bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-border/50 bg-background/80 text-foreground backdrop-blur-md transition-colors hover:bg-secondary shrink-0 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
