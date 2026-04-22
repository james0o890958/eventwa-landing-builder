import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  Ticket,
  Settings,
  Eye,
  EyeOff,
  MapPin,
  UserPlus,
  UserCheck,
  Shield,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { mockEvents } from "@/data/mockEvents";
import { useAuth } from "@/contexts/AuthContext";

type ProfileTab = "attended" | "hosted";

// Mock user profiles
const MOCK_PROFILES: Record<
  string,
  {
    id: string;
    username: string;
    displayName: string;
    bio: string;
    location: string;
    joinedDate: string;
    attendedEventIds: string[];
    hostedEventIds: string[];
    followersCount: number;
    followingCount: number;
    showAttended: boolean;
    showHosted: boolean;
  }
> = {
  adaeze: {
    id: "u1",
    username: "adaeze",
    displayName: "Adaeze Obi",
    bio: "Music lover & event enthusiast 🎵 | Lagos based | Always at the best shows in the city",
    location: "Victoria Island, Lagos",
    joinedDate: "2024-01-15",
    attendedEventIds: ["1", "2", "5", "9", "12"],
    hostedEventIds: [],
    followersCount: 142,
    followingCount: 89,
    showAttended: true,
    showHosted: false,
  },
  chidi: {
    id: "u2",
    username: "chidi",
    displayName: "Chidi Nwosu",
    bio: "Lagos nightlife explorer 🌃 | Sports fanatic | Finding the next big event near you",
    location: "Lekki, Lagos",
    joinedDate: "2024-03-22",
    attendedEventIds: ["1", "4", "6", "18"],
    hostedEventIds: ["17", "28"],
    followersCount: 310,
    followingCount: 201,
    showAttended: true,
    showHosted: true,
  },
  fatima: {
    id: "u3",
    username: "fatima",
    displayName: "Fatima Bello",
    bio: "Tech meets culture ✨ | Conference speaker | Connecting Nigeria's creative ecosystem",
    location: "Abuja, FCT",
    joinedDate: "2023-11-05",
    attendedEventIds: ["12", "13", "26"],
    hostedEventIds: ["12"],
    followersCount: 890,
    followingCount: 412,
    showAttended: true,
    showHosted: true,
  },
};

const DEFAULT_PROFILE = MOCK_PROFILES["adaeze"];

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  const profile = (username && MOCK_PROFILES[username]) || DEFAULT_PROFILE;

  const [activeTab, setActiveTab] = useState<ProfileTab>("attended");
  const [isFollowing, setIsFollowing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Privacy toggles (only relevant if viewing own profile)
  const [showAttended, setShowAttended] = useState(profile.showAttended);
  const [showHosted, setShowHosted] = useState(profile.showHosted);

  const isOwnProfile =
    user?.email?.split("@")[0] === profile.username ||
    user?.user_metadata?.display_name === profile.displayName;

  const attendedEvents = mockEvents.filter((e) =>
    profile.attendedEventIds.includes(e.id),
  );
  const hostedEvents = mockEvents.filter((e) =>
    profile.hostedEventIds.includes(e.id),
  );

  const initials = profile.displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const TABS: { id: ProfileTab; label: string; count: number }[] = [
    { id: "attended", label: "Events Attended", count: attendedEvents.length },
    { id: "hosted", label: "Events Hosted", count: hostedEvents.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-4xl px-4 pt-24 pb-16">
        {/* Back */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-card"
        >
          {/* Cover banner */}
          <div className="h-32 gradient-primary relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
          </div>

          {/* Avatar + info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="-mt-12 flex items-end gap-4">
                <Avatar className="h-24 w-24 border-4 border-card shadow-lg">
                  <AvatarFallback className="gradient-primary text-primary-foreground text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="mb-1">
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    {profile.displayName}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    @{profile.username}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowSettings((v) => !v)}
                    className="border-border/50 gap-1.5"
                  >
                    <Settings className="h-4 w-4" />
                    Privacy Settings
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="border-border/50 gap-1.5"
                    >
                      <Link to="/messages">
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsFollowing((v) => !v);
                      }}
                      className={
                        isFollowing
                          ? "bg-secondary text-foreground hover:bg-secondary/80"
                          : "gradient-primary text-primary-foreground shadow-glow"
                      }
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="mr-1.5 h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-1.5 h-4 w-4" />
                          Follow
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/80">
                {profile.bio}
              </p>
            )}

            {/* Meta info */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {profile.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Joined{" "}
                {new Date(profile.joinedDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Ticket className="h-3.5 w-3.5 text-primary" />
                {attendedEvents.length} events attended
              </span>
            </div>

            {/* Followers */}
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="font-bold text-foreground">
                  {profile.followersCount.toLocaleString()}
                </span>{" "}
                <span className="text-muted-foreground">Followers</span>
              </div>
              <div>
                <span className="font-bold text-foreground">
                  {profile.followingCount.toLocaleString()}
                </span>{" "}
                <span className="text-muted-foreground">Following</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Settings Panel (own profile only) */}
        <AnimatePresence>
          {showSettings && isOwnProfile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-card"
            >
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-foreground">
                  Privacy Settings
                </h2>
              </div>

              <div className="space-y-4">
                {/* Show attended events */}
                <div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    {showAttended ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Show Events Attended
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Allow others to see events you've attended
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAttended((v) => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      showAttended ? "gradient-primary" : "bg-secondary"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        showAttended ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Show hosted events */}
                <div className="flex items-center justify-between rounded-xl border border-border/50 p-4">
                  <div className="flex items-center gap-3">
                    {showHosted ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Show Events Hosted
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Allow others to see events you've organized
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHosted((v) => !v)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      showHosted ? "gradient-primary" : "bg-secondary"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        showHosted ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="mb-8 flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200",
                activeTab === tab.id
                  ? "gradient-primary text-white shadow-glow"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "attended" && (
              <>
                {!showAttended && !isOwnProfile ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <EyeOff className="mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="font-display text-lg font-semibold text-foreground">
                      Hidden by user
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {profile.displayName} has set their attended events to
                      private.
                    </p>
                  </div>
                ) : attendedEvents.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {attendedEvents.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Ticket className="mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="font-display text-lg font-semibold text-foreground">
                      No events attended yet
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Events attended by {profile.displayName} will show here.
                    </p>
                  </div>
                )}
              </>
            )}

            {activeTab === "hosted" && (
              <>
                {!showHosted && !isOwnProfile ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <EyeOff className="mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="font-display text-lg font-semibold text-foreground">
                      Hidden by user
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {profile.displayName} has set their hosted events to
                      private.
                    </p>
                  </div>
                ) : hostedEvents.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {hostedEvents.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="font-display text-lg font-semibold text-foreground">
                      No hosted events
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {isOwnProfile
                        ? "Create your first event to see it here."
                        : `${profile.displayName} hasn't hosted any events yet.`}
                    </p>
                    {isOwnProfile && (
                      <Link to="/organizer/create-event">
                        <Button className="mt-6 gradient-primary text-primary-foreground shadow-glow">
                          Create an Event
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
