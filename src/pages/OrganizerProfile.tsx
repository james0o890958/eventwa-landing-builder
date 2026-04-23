import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  MapPin,
  Star,
  ArrowLeft,
  ExternalLink,
  MessageCircle,
  UserPlus,
  UserCheck,
  Check,
  Building2,
  Instagram,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { mockEvents } from "@/data/mockEvents";
import { useAuth } from "@/contexts/AuthContext";
import { organizerSlug } from "@/lib/utils";

interface SocialLinks {
  instagram?: string;
  twitter?: string;
}

const getOrganizers = () => {
  const organizerMap: Record<string, { events: typeof mockEvents; totalEvents: number; totalAttendees: number }> = {};

  for (const event of mockEvents) {
    if (!organizerMap[event.organizer]) {
      organizerMap[event.organizer] = { events: [], totalEvents: 0, totalAttendees: 0 };
    }
    organizerMap[event.organizer].events.push(event);
    organizerMap[event.organizer].totalEvents += 1;
    organizerMap[event.organizer].totalAttendees += event.attendees;
  }

  const colors = [
    "from-pink-500 to-rose-600",
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-green-500 to-emerald-600",
    "from-amber-500 to-orange-600",
    "from-teal-500 to-emerald-600",
    "from-indigo-500 to-blue-600",
    "from-red-500 to-pink-600",
  ];

  return Object.entries(organizerMap).map(([name, data], index) => ({
    id: organizerSlug(name),
    name,
    initials: name
      .split(" ")
      .slice(0, 3)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 3),
    bio: "Professional event organizer bringing amazing experiences to Nigeria.",
    location: "Nigeria",
    totalEvents: data.totalEvents,
    totalAttendees: data.totalAttendees,
    rating: 4.5 + Math.random() * 0.5,
    reviews: Math.floor(Math.random() * 100) + 10,
    color: colors[index % colors.length],
    verified: data.totalEvents > 5,
    website: "" as string,
    socialLinks: {} as SocialLinks,
  }));
};

const ORGANIZERS = getOrganizers();

const OrganizerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const organizer = ORGANIZERS.find((o) => o.id === id) || ORGANIZERS[0];
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("upcoming");
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate(`/auth?redirect=/organizer/${id}`, { replace: true });
    }
  }, [session, authLoading, navigate, id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (authLoading || !session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full gradient-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const today = new Date("2026-04-21");

  const upcomingEvents = mockEvents.filter(
    (e) => new Date(e.date) >= today && e.organizer === organizer.name,
  );
  const pastEvents = mockEvents.filter(
    (e) => new Date(e.date) < today && e.organizer === organizer.name,
  );

  const toggleFollow = () => {
    setFollowing(!following);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24">
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${organizer.color}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative -mt-20"
          >
            <Link
              to="/organizers"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to organizers
            </Link>

            <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-5">
                <div className="relative">
                  <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${organizer.color} text-4xl font-bold text-white`}
                    >
                      {organizer.initials}
                    </AvatarFallback>
                  </Avatar>
                  {organizer.verified && (
                    <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full gradient-primary border-2 border-background">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-3xl font-bold text-foreground">
                      {organizer.name}
                    </h1>
                    {organizer.verified && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {organizer.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {organizer.rating} ({organizer.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={toggleFollow}
                  className={`${
                    following
                      ? "bg-secondary text-foreground hover:bg-secondary/80"
                      : "gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                  }`}
                >
                  {following ? (
                    <>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
                    About
                  </h2>
                  <p className="text-secondary-foreground/80">
                    {organizer.bio}
                  </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      Events
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab("past")}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                          activeTab === "past"
                            ? "gradient-primary text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Past ({pastEvents.length})
                      </button>
                      <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                          activeTab === "upcoming"
                            ? "gradient-primary text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Upcoming ({upcomingEvents.length})
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeTab === "upcoming"
                      ? upcomingEvents.slice(0, 4).map((event, i) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                          >
                            <EventCard event={event} />
                          </motion.div>
                        ))
                      : pastEvents.slice(0, 4).map((event, i) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                          >
                            <EventCard event={event} />
                          </motion.div>
                        ))}
                  </div>

                  {((activeTab === "upcoming" && upcomingEvents.length === 0) ||
                    (activeTab === "past" && pastEvents.length === 0)) && (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground">
                        No {activeTab} events yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-border/50 bg-card p-5">
                  <h3 className="mb-4 font-display font-semibold text-foreground">
                    Stats
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Total Events
                      </span>
                      <span className="font-semibold text-foreground">
                        {organizer.totalEvents}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Total Attendees
                      </span>
                      <span className="font-semibold text-foreground">
                        {(organizer.totalAttendees / 1000).toFixed(1)}K
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        Rating
                      </span>
                      <span className="font-semibold text-foreground">
                        {organizer.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                {(organizer.website || organizer.socialLinks) && (
                  <div className="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 className="mb-4 font-display font-semibold text-foreground">
                      Links
                    </h3>
                    <div className="space-y-3">
                      {organizer.website && (
                        <a
                          href={organizer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 text-sm transition-colors hover:bg-secondary"
                        >
                          <span className="text-foreground">
                            {organizer.website.replace("https://", "")}
                          </span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                      )}
                      {organizer.socialLinks?.instagram && (
                        <a
                          href={`https://instagram.com/${organizer.socialLinks.instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 text-sm transition-colors hover:bg-secondary"
                        >
                          <div className="flex items-center gap-2">
                            <Instagram className="h-4 w-4 text-pink-500" />
                            <span className="text-foreground">Instagram</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{organizer.socialLinks.instagram}</span>
                        </a>
                      )}
                      {organizer.socialLinks?.twitter && (
                        <a
                          href={`https://twitter.com/${organizer.socialLinks.twitter.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 text-sm transition-colors hover:bg-secondary"
                        >
                          <div className="flex items-center gap-2">
                            <Twitter className="h-4 w-4 text-sky-500" />
                            <span className="text-foreground">Twitter</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{organizer.socialLinks.twitter}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-16" />
      <Footer />
    </div>
  );
};

export default OrganizerProfile;