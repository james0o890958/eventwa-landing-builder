import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import { api } from "@/lib/api";

interface TrendingEventsProps {
  events?: any[];
}

const TrendingEvents = ({ events: propEvents }: TrendingEventsProps) => {
  const [apiEvents, setApiEvents] = useState<any[]>([]);

  useEffect(() => {
    if (propEvents) return;
    api.get("public/events")
      .then((res: any) => {
        const list = Array.isArray(res) ? res : (res?.events || res?.data || []);
        if (list && list.length > 0) setApiEvents(list);
      })
      .catch((err) => console.error("Failed to load trending events:", err));
  }, [propEvents]);

  const activeEvents = propEvents || apiEvents;

  const trending = useMemo(() => 
    [...activeEvents].sort((a, b) => (b.views || b.attendees || 0) - (a.views || a.attendees || 0)).slice(0, 6),
    [activeEvents]
  );
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <h2 className="font-display text-3xl font-bold text-foreground">
                Trending Now
              </h2>
            </div>
            <p className="text-muted-foreground">
              Events everyone is talking about
            </p>
          </div>
          <Link
            to="/explore"
            className="hidden text-sm font-medium text-primary hover:underline sm:block"
          >
            See all →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((event, i) => (
            <div key={event.id} className="relative">
              {/* Trending rank badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="absolute -left-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground shadow-glow pointer-events-none"
              >
                {i + 1}
              </motion.div>

              {/* Flame badge for top 3 */}
              {i < 3 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                  className="absolute right-3 top-12 z-20 flex items-center gap-1 rounded-full bg-orange-500/90 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm pointer-events-none"
                >
                  <Flame className="h-3 w-3" />
                  Hot
                </motion.div>
              )}

              <EventCard event={event} index={i} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/explore"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all trending events →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingEvents;
