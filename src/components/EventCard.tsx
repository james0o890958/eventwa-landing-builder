import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Bookmark, BookmarkCheck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Event } from "@/data/mockEvents";
import { useBookmark } from "@/hooks/useBookmark";



type EventCardProps = {
  event: Event;
  index?: number;
  initialSaved?: boolean;
  onToggleSave?: (saved: boolean, eventId: string) => Promise<void> | void;
};

const getDisplayText = (value: unknown, fallback = "") => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return getDisplayText(
      record.name ?? record.title ?? record.label ?? record.slug ?? record.address ?? record.city,
      fallback,
    );
  }
  return fallback;
};

const EventCard = ({ event, index = 0, initialSaved, onToggleSave }: EventCardProps) => {
  const categoryLabel = getDisplayText(event.category, "Event");
  const titleLabel = getDisplayText(event.title, "Untitled event");
  const locationLabel = getDisplayText(event.location, "Location TBD");
  const timeLabel = getDisplayText(event.time);

  const { saved, toggleSave } = useBookmark(event.id, event);


  const isCancelled = (event as any).status === "cancelled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to={`/event/${event.id}`} className="group block">
        <div className={`overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-glow/10 ${isCancelled ? "opacity-75" : ""}`}>
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={event.image}
              alt={titleLabel}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${isCancelled ? "grayscale-[0.4]" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Top row: category badge + optional Cancelled badge + bookmark */}
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold capitalize text-foreground backdrop-blur-sm">
                {categoryLabel}
              </span>
              {isCancelled && (
                <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Cancelled
                </span>
              )}
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
                  // FIX: added optional chaining so undefined price doesn't crash
                  : `₦${event.price?.toLocaleString() ?? "0"}`}
              </span>
            </div>
          </div>

          <div className="p-4">
            <h3 className="mb-2 font-display text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {titleLabel}
            </h3>
            <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {new Date(event.date ?? event.start_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {timeLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="line-clamp-1">{locationLabel}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                {/* FIX: added optional chaining so undefined attendees doesn't crash */}
                {(event.attendees ?? event.attendees_count)?.toLocaleString() ?? "0"} attending
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;