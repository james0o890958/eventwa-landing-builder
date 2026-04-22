import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Event } from "@/data/mockEvents";

function getSavedIds(): string[] {
  try {
    const stored = localStorage.getItem("savedEvents");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const EventCard = ({ event, index = 0 }: { event: Event; index?: number }) => {
  const [saved, setSaved] = useState(() => getSavedIds().includes(event.id));

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ids = getSavedIds();
    const next = saved
      ? ids.filter((id) => id !== event.id)
      : [...ids, event.id];
    localStorage.setItem("savedEvents", JSON.stringify(next));
    setSaved(!saved);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to={`/event/${event.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow/10">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Top row: category badge + bookmark */}
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold capitalize text-foreground backdrop-blur-sm">
                {event.category}
              </span>
            </div>

            <button
              onClick={toggleSave}
              aria-label={saved ? "Remove bookmark" : "Bookmark event"}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:scale-110 hover:bg-background"
            >
              {saved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {/* Price badge */}
            <div className="absolute bottom-3 right-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  event.price === 0
                    ? "bg-success text-success-foreground"
                    : "gradient-primary text-primary-foreground"
                }`}
              >
                {event.price === 0
                  ? "FREE"
                  : `₦${event.price.toLocaleString()}`}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="mb-2 font-display text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {new Date(event.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="line-clamp-1">{event.location}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                {event.attendees.toLocaleString()} attending
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
