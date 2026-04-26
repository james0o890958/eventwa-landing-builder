import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Ticket,
  MessageCircle,
  Settings,
  Bell,
  Bookmark,
  MapPin,
  BellRing,
} from "lucide-react";
import EventCard from "@/components/EventCard";
import EventsSection from "@/components/EventsSection";
import EventsNearYou from "@/components/EventsNearYou";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { mockEvents } from "@/data/mockEvents";
import { generateEventSuggestions } from "@/lib/eventSuggestions";

type Tab = "upcoming" | "saved" | "past" | "notifications";

type NotifCategory = "reminder" | "ticket" | "suggestion" | "announcement" | "nearby";

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    Icon: Bell,
    title: "Event reminder",
    desc: "Felabration 2026 starts in 3 days — don't forget your ticket!",
    time: "2 hours ago",
    unread: true,
    category: "reminder" as NotifCategory,
  },
  {
    id: "n2",
    Icon: Ticket,
    title: "Ticket confirmed",
    desc: "Your ticket for Lagos Carnival 2026 is ready. Tap to view QR code.",
    time: "Yesterday",
    unread: true,
    category: "ticket" as NotifCategory,
  },
  {
    id: "n3",
    Icon: Calendar,
    title: "Suggested for you",
    desc: "Based on your love for Afrobeats, you might enjoy Wizkid Fest 2026",
    time: "Yesterday",
    unread: true,
    category: "suggestion" as NotifCategory,
  },
  {
    id: "n4",
    Icon: Bell,
    title: "Event reminder",
    desc: "Lagos Tech Summit is tomorrow at 9:00 AM. See you there!",
    time: "2 days ago",
    unread: false,
    category: "reminder" as NotifCategory,
  },
  {
    id: "n5",
    Icon: Ticket,
    title: "Ticket confirmed",
    desc: "Payment received — your VIP pass for Detty December is secured.",
    time: "3 days ago",
    unread: false,
    category: "ticket" as NotifCategory,
  },
  {
    id: "n6",
    Icon: Calendar,
    title: "New event suggestion",
    desc: "You saved 3 jazz events. Check out Lagos Jazz Night this Friday.",
    time: "4 days ago",
    unread: false,
    category: "suggestion" as NotifCategory,
  },
  {
    id: "n7",
    Icon: MapPin,
    title: "New event near you",
    desc: "Burna Boy Live is happening near Victoria Island",
    time: "5 days ago",
    unread: false,
    category: "nearby" as NotifCategory,
  },
  {
    id: "n8",
    Icon: BellRing,
    title: "Organizer announcement",
    desc: "Gates open 1 hour earlier for Wizkid Fest",
    time: "1 week ago",
    unread: false,
    category: "announcement" as NotifCategory,
  },
] as const;

const NOTIF_FILTERS: { id: "all" | NotifCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "reminder", label: "Reminders" },
  { id: "ticket", label: "Tickets" },
  { id: "suggestion", label: "Suggestions" },
  { id: "nearby", label: "Nearby" },
  { id: "announcement", label: "Announcements" },
];

interface EmptyStateProps {
  Icon: React.ElementType;
  title: string;
  desc: string;
  cta?: { label: string; to: string };
}

const EmptyState = ({ Icon, title, desc, cta }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <Icon className="mb-4 h-14 w-14 text-muted-foreground/30" />
    <p className="font-display text-lg font-semibold text-foreground">
      {title}
    </p>
    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    {cta && (
      <Link to={cta.to}>
        <Button className="mt-6 gradient-primary text-primary-foreground shadow-glow">
          {cta.label}
        </Button>
      </Link>
    )}
  </div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [notifFilter, setNotifFilter] = useState<"all" | NotifCategory>("all");

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("savedEvents");
      if (stored) setSavedIds(JSON.parse(stored) as string[]);
      const recent = localStorage.getItem("recentlyViewedEvents");
      if (recent) setRecentlyViewedIds(JSON.parse(recent) as string[]);
    } catch {
      // ignore parse errors
    }
  }, []);

  const recentlyViewedEvents = recentlyViewedIds
    .map((rid) => mockEvents.find((e) => e.id === rid))
    .filter((e): e is typeof mockEvents[number] => Boolean(e))
    .slice(0, 6);

  const now = new Date();
  const upcomingEvents = mockEvents
    .filter((e) => new Date(e.date) >= now)
    .slice(0, 3);
  const savedEvents = mockEvents.filter((e) => savedIds.includes(e.id));
  const pastEvents = mockEvents
    .filter((e) => new Date(e.date) < now)
    .slice(0, 3);

  const upcomingEventIds = mockEvents
    .filter((e) => new Date(e.date) >= now)
    .map((e) => e.id);
  const pastEventIds = mockEvents
    .filter((e) => new Date(e.date) < now)
    .map((e) => e.id);

  const suggestedEvents = useMemo(
    () =>
      generateEventSuggestions({
        allEvents: mockEvents,
        savedEventIds: savedIds,
        excludeEventIds: [...upcomingEventIds, ...pastEventIds],
        maxSuggestions: 6,
      }),
    [savedIds.join(","), upcomingEventIds.join(","), pastEventIds.join(",")]
  );

  const TABS: {
    id: Tab;
    label: string;
    Icon: React.ElementType;
    count?: number;
  }[] = [
    {
      id: "upcoming",
      label: "Upcoming",
      Icon: Calendar,
      count: upcomingEvents.length,
    },
    { id: "saved", label: "Saved", Icon: Bookmark, count: savedEvents.length },
    { id: "past", label: "Past", Icon: Ticket },
    { id: "notifications", label: "Notifications", Icon: Bell, count: 2 },
  ];

  const QUICK_ACTIONS: {
    label: string;
    Icon: React.ElementType;
    count: number | null;
    action: () => void;
  }[] = [
    {
      label: "My Events",
      Icon: Calendar,
      count: upcomingEvents.length,
      action: () => setActiveTab("upcoming"),
    },
    {
      label: "Saved",
      Icon: Bookmark,
      count: savedEvents.length,
      action: () => setActiveTab("saved"),
    },
    {
      label: "Messages",
      Icon: MessageCircle,
      count: 5,
      action: () => navigate("/messages"),
    },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          My Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back to your event hub
        </p>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile header */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-primary/30">
                <AvatarFallback className="gradient-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="font-display text-3xl font-bold text-foreground">
                Welcome back,{" "}
                <span className="text-gradient">{displayName}</span>!
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Member since 2024
              </span>
            </div>
          </div>

          {/* Quick action cards */}
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {QUICK_ACTIONS.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="group rounded-2xl border border-border/50 bg-card p-5 text-center transition-all hover:border-primary/30 hover:bg-secondary/50 hover:shadow-card"
              >
                <item.Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  {item.label}
                </p>
                {item.count !== null && (
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {item.count}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Tab bar */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "gradient-primary text-white shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <tab.Icon className="h-4 w-4" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
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
              {/* Upcoming */}
              {activeTab === "upcoming" &&
                (upcomingEvents.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((e, i) => (
                      <EventCard key={e.id} event={e} index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    Icon={Calendar}
                    title="No upcoming events"
                    desc="You haven't joined any events yet."
                    cta={{ label: "Explore Events", to: "/explore" }}
                  />
                ))}

              {/* Saved */}
              {activeTab === "saved" && (
                <>
                  {savedEvents.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {savedEvents.map((e, i) => (
                        <EventCard key={e.id} event={e} index={i} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      Icon={Bookmark}
                      title="No saved events yet"
                      desc="Bookmark events you're interested in to find them here."
                      cta={{ label: "Explore Events", to: "/explore" }}
                    />
                  )}

                  <div className="mt-10">
                    <EventsNearYou
                      events={mockEvents.filter((e) => new Date(e.date) >= now)}
                    />
                  </div>
                </>
              )}

              {/* Past */}
              {activeTab === "past" &&
                (pastEvents.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {pastEvents.map((e, i) => (
                      <EventCard key={e.id} event={e} index={i} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    Icon={Ticket}
                    title="No past events"
                    desc="Events you've attended will appear here once they've ended."
                  />
                ))}

              {/* Notifications */}
              {activeTab === "notifications" && (() => {
                const filtered =
                  notifFilter === "all"
                    ? MOCK_NOTIFICATIONS
                    : MOCK_NOTIFICATIONS.filter((n) => n.category === notifFilter);
                return (
                  <>
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                      {NOTIF_FILTERS.map((f) => {
                        const count =
                          f.id === "all"
                            ? MOCK_NOTIFICATIONS.length
                            : MOCK_NOTIFICATIONS.filter((n) => n.category === f.id).length;
                        if (count === 0) return null;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setNotifFilter(f.id)}
                            className={[
                              "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                              notifFilter === f.id
                                ? "gradient-primary text-primary-foreground shadow-glow"
                                : "bg-secondary text-muted-foreground hover:text-foreground",
                            ].join(" ")}
                          >
                            {f.label}
                            <span
                              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                notifFilter === f.id
                                  ? "bg-white/20"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {filtered.length === 0 ? (
                      <EmptyState
                        Icon={Bell}
                        title="No notifications"
                        desc="You're all caught up in this category."
                      />
                    ) : (
                      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
                        {filtered.map((notif, i) => (
                          <div
                            key={notif.id}
                            className={[
                              "flex items-start gap-4 px-5 py-4 transition-colors hover:bg-secondary/40",
                              i < filtered.length - 1 ? "border-b border-border/30" : "",
                              notif.unread ? "bg-primary/5" : "",
                            ].join(" ")}
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                notif.unread ? "gradient-primary" : "bg-secondary"
                              }`}
                            >
                              <notif.Icon
                                className={`h-5 w-5 ${
                                  notif.unread ? "text-primary-foreground" : "text-muted-foreground"
                                }`}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">
                                  {notif.title}
                                </p>
                                {notif.unread && (
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                                )}
                              </div>
                              <p className="mt-0.5 text-sm text-muted-foreground">
                                {notif.desc}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground/60">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>

          {recentlyViewedEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <EventsSection
                title="Recently Viewed"
                subtitle="Pick up where you left off"
                events={recentlyViewedEvents}
              />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <EventsSection
              title="Suggested For You"
              subtitle="Events we think you'll love"
              events={suggestedEvents}
            />
          </motion.div>
        </motion.div>
      </>
    );
};

export default UserDashboard;
