import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserCheck, Search, Star, Calendar } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { attendeeMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockEvents } from "@/data/mockEvents";
import { organizerSlug } from "@/lib/utils";

const Following = () => {
  const organizers = Array.from(new Set(mockEvents.map((e) => e.organizer))).slice(0, 6);
  const [following, setFollowing] = useState<string[]>(organizers.slice(0, 4));
  const [query, setQuery] = useState("");

  const filtered = organizers.filter((o) => o.toLowerCase().includes(query.toLowerCase()));

  const toggle = (name: string) =>
    setFollowing((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  return (
    <DashboardLayout
      title="Organizers I Follow"
      subtitle="Stay updated with your favorite event organizers"
      menu={attendeeMenu}
    >
      <div className="mb-6 flex items-center gap-2 rounded-2xl border border-border/50 bg-card px-4 py-2 shadow-card">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search organizers..."
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((name, i) => {
          const isFollowing = following.includes(name);
          const eventCount = mockEvents.filter((e) => e.organizer === name).length;
          const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border/50 bg-card p-5 shadow-card"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/organizer/${organizerSlug(name)}`}
                    className="block truncate font-display font-semibold text-foreground hover:text-primary"
                  >
                    {name}
                  </Link>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {eventCount} events
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> 4.{5 + (i % 4)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => toggle(name)}
                variant={isFollowing ? "secondary" : "default"}
                className={`mt-4 w-full ${!isFollowing ? "gradient-primary text-primary-foreground" : ""}`}
                size="sm"
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" /> Following
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" /> Follow
                  </>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-border/50 bg-card py-16 text-center">
          <Users className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No organizers found</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Following;
