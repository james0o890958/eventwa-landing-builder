import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Search, Mail, Phone, MessageSquare, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api, getFullAvatarUrl } from "@/lib/api";
import { toast } from "sonner";

interface Follower {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

const OrganizerFollowers = () => {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token") || "";

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("organizer/followers", undefined, token);
        if (response?.followers) {
          setFollowers(response.followers);
        } else if (response?.message) {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Failed to load followers:", error);
        toast.error("Failed to load followers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [token]);

  const filteredFollowers = followers.filter(
    (f) =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.email.toLowerCase().includes(query.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  return (
    <DashboardLayout
      title="My Followers"
      subtitle="Interact with users who follow your organizer profile"
      menu={organizerMenu}
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex items-center gap-2 rounded-2xl border border-border/50 bg-card px-4 py-2 shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search followers by name or email..."
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredFollowers.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-border/50 bg-card py-16 text-center shadow-card">
            <Users className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              No followers found
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {query ? "Try modifying your search query." : "You don't have any followers yet."}
            </p>
          </div>
        ) : (
          /* Followers Grid */
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFollowers.map((follower, i) => {
              const initials = getInitials(follower.name);
              return (
                <motion.div
                  key={follower.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border/50 bg-card p-5 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12 border border-border/40 shadow-sm shrink-0">
                        <AvatarImage src={getFullAvatarUrl(follower.avatar)} />
                        <AvatarFallback className="gradient-primary text-primary-foreground font-bold text-sm">
                          {initials || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-display font-semibold text-foreground text-sm">
                          {follower.name}
                        </h4>
                        <div className="mt-2 space-y-1.5">
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span>{follower.email}</span>
                          </p>
                          {follower.phone && (
                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              <span>{follower.phone}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate(`/dashboard/messages?user=${follower.id}`)}
                    className="mt-5 w-full gradient-primary text-primary-foreground shadow-glow gap-2"
                    size="sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerFollowers;
