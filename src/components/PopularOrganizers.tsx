import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockEvents } from "@/data/mockEvents";
import { organizerSlug } from "@/lib/utils";

interface OrganizerInfo {
  name: string;
  initials: string;
  eventCount: number;
  totalAttendees: number;
  colorClass: string;
}

const GRADIENT_COLORS = [
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-green-500 to-emerald-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-emerald-600",
];

function deriveOrganizers(): OrganizerInfo[] {
  const map: Record<string, { eventCount: number; totalAttendees: number }> = {};

  for (const event of mockEvents) {
    if (!map[event.organizer]) {
      map[event.organizer] = { eventCount: 0, totalAttendees: 0 };
    }
    map[event.organizer].eventCount += 1;
    map[event.organizer].totalAttendees += event.attendees;
  }

  return Object.entries(map)
    .map(([name, stats], i) => ({
      name,
      initials: name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase(),
      eventCount: stats.eventCount,
      totalAttendees: stats.totalAttendees,
      colorClass: GRADIENT_COLORS[i % GRADIENT_COLORS.length],
    }))
    .sort((a, b) => b.totalAttendees - a.totalAttendees)
    .slice(0, 6);
}

const topOrganizers = deriveOrganizers();

const PopularOrganizers = () => {
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  const toggleFollow = (name: string) => {
    setFollowed((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 font-display text-3xl font-bold text-foreground">
          Popular Organizers
        </h2>
        <p className="mb-10 text-muted-foreground">
          Follow the people behind Nigeria's best events
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topOrganizers.map((org, i) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-card transition-colors hover:border-primary/30"
            >
              <Link
                to={`/organizer/${organizerSlug(org.name)}`}
                className="flex min-w-0 flex-1 items-center gap-4 text-left transition hover:text-primary"
              >
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${org.colorClass} text-sm font-bold text-white`}
                  >
                    {org.initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                <p className="truncate font-display font-semibold text-foreground">
                  {org.name}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary" />
                    {org.eventCount} event{org.eventCount !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-primary" />
                    {org.totalAttendees >= 1000
                      ? `${(org.totalAttendees / 1000).toFixed(0)}K`
                      : org.totalAttendees.toLocaleString()}{" "}
                    attendees
                  </span>
                </div>
              </div>
              </Link>

              <Button
                size="sm"
                onClick={() => toggleFollow(org.name)}
                className={
                  followed[org.name]
                    ? "bg-secondary text-foreground hover:bg-secondary/80"
                    : "gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                }
              >
                {followed[org.name] ? "Following" : "Follow"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularOrganizers;
