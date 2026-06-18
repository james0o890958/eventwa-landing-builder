import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Search, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import OrganizerLink from "@/components/OrganizerLink";

interface Organizer {
  id: string | number;
  name: string;
  events?: any[];
  logo?: string;
  bio?: string;
}

const Following = () => {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("access_token") || "";

  useEffect(() => {
    const fetchFollowing = async () => {
      setIsLoading(true);
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("user-following", undefined, token);
        if (response?.organizers) {
          setOrganizers(response.organizers);
        }
      } catch (error) {
        console.error("Failed to load following organizers", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowing();
  }, [token]);

  const handleUnfollow = async (organizerId: string | number) => {
    if (!token) return;

    try {
      await api.delete(`user-follow/${organizerId}`, token);
      setOrganizers((prev) => prev.filter((organizer) => organizer.id !== organizerId));
    } catch (error) {
      console.error("Failed to unfollow organizer", error);
    }
  };

  const filtered = organizers.filter((o) => o.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
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
        {filtered.map((organizer, i) => {
          const eventCount = organizer.events?.length ?? 0;
          const initials = organizer.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
          return (
            <motion.div
              key={organizer.id}
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
                  <OrganizerLink
                    organizerName={organizer.name}
                    className="block truncate font-display font-semibold text-foreground hover:text-primary"
                  />
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
                onClick={() => handleUnfollow(organizer.id)}
                variant="secondary"
                className="mt-4 w-full"
                size="sm"
              >
                <UserCheck className="mr-2 h-4 w-4" /> Following
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
    </div>
  );
};

export default Following;
