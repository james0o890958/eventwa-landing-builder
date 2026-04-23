import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  BarChart3,
  Plus,
  Ticket,
  Megaphone,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { mockEvents } from "@/data/mockEvents";
import type { Event } from "@/data/mockEvents";

type OrgTab = "events" | "analytics" | "announcements";

interface Announcement {
  id: string;
  text: string;
  timestamp: string;
}

function getTicketsSold(events: Event[]): number {
  return events.reduce((sum, e) => {
    if (e.ticketTypes && e.ticketTypes.length > 0) {
      return sum + e.ticketTypes.reduce((s, t) => s + t.sold, 0);
    }
    return sum + Math.floor(e.attendees * 0.7);
  }, 0);
}

function getRevenue(events: Event[]): number {
  return events.reduce((sum, e) => {
    if (e.ticketTypes && e.ticketTypes.length > 0) {
      return sum + e.ticketTypes.reduce((s, t) => s + t.sold * t.price, 0);
    }
    return sum + e.price * Math.floor(e.attendees * 0.7);
  }, 0);
}

function fmtRevenue(n: number): string {
  if (n >= 1_000_000_000) return `₦${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}

function getStatus(dateStr: string) {
  const days = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / 86_400_000,
  );
  if (days < 0)
    return { label: "Ended", cls: "bg-muted text-muted-foreground" };
  if (days <= 14)
    return { label: "Soon", cls: "bg-amber-500/20 text-amber-500" };
  return { label: "Upcoming", cls: "bg-emerald-500/20 text-emerald-500" };
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    text: "Gates open at 5PM sharp! Please arrive early to avoid long queues at the entrance.",
    timestamp: "2 days ago",
  },
  {
    id: "a2",
    text: "Parking is available at the venue. Follow signs for the designated event parking area.",
    timestamp: "1 week ago",
  },
];

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OrgTab>("events");
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    INITIAL_ANNOUNCEMENTS,
  );
  const [draftText, setDraftText] = useState("");

  const displayName =
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Organizer";
  const initials = displayName.slice(0, 2).toUpperCase();

  const orgEvents = mockEvents.slice(0, 4);
  const totalAttendees = orgEvents.reduce((s, e) => s + e.attendees, 0);
  const ticketsSold = getTicketsSold(orgEvents);
  const revenue = getRevenue(orgEvents);

  const STATS: { Icon: React.ElementType; label: string; value: string }[] = [
    { Icon: Calendar, label: "Total Events", value: String(orgEvents.length) },
    {
      Icon: Users,
      label: "Total Attendees",
      value: totalAttendees.toLocaleString(),
    },
    {
      Icon: Ticket,
      label: "Tickets Sold",
      value: ticketsSold.toLocaleString(),
    },
    { Icon: BarChart3, label: "Revenue", value: fmtRevenue(revenue) },
  ];

  const TABS: { id: OrgTab; label: string; Icon: React.ElementType }[] = [
    { id: "events", label: "My Events", Icon: Calendar },
    { id: "analytics", label: "Analytics", Icon: TrendingUp },
    { id: "announcements", label: "Announcements", Icon: Megaphone },
  ];

  const handlePost = () => {
    if (!draftText.trim()) return;
    setAnnouncements((prev) => [
      { id: `a${Date.now()}`, text: draftText.trim(), timestamp: "Just now" },
      ...prev,
    ]);
    setDraftText("");
  };

  return (
    <DashboardLayout title="Organizer Dashboard" subtitle="Run your events like a pro" menu={organizerMenu}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/30">
                <AvatarFallback className="gradient-primary text-primary-foreground text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-3xl font-bold text-foreground">
                    {displayName}
                  </h1>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    ✓ Verified
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Event Organizer</p>
              </div>
            </div>
            <Link to="/organizer/create-event">
              <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" /> Create Event
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-border/50 bg-card p-5 text-center shadow-card"
              >
                <stat.Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-display mt-1 text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

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
                <tab.Icon className="h-4 w-4" />
                {tab.label}
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
              {/* ── My Events ─────────────────────────────────────────────── */}
              {activeTab === "events" && (
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="px-5 py-4 text-left font-medium text-muted-foreground">
                            Event
                          </th>
                          <th className="px-5 py-4 text-left font-medium text-muted-foreground hidden sm:table-cell">
                            Date
                          </th>
                          <th className="px-5 py-4 text-left font-medium text-muted-foreground hidden md:table-cell">
                            Location
                          </th>
                          <th className="px-5 py-4 text-right font-medium text-muted-foreground">
                            Attendees
                          </th>
                          <th className="px-5 py-4 text-right font-medium text-muted-foreground">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orgEvents.map((event) => {
                          const status = getStatus(event.date);
                          return (
                            <tr
                              key={event.id}
                              className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                            >
                              <td className="px-5 py-4">
                                <Link
                                  to={`/event/${event.id}`}
                                  className="font-medium text-foreground hover:text-primary transition-colors"
                                >
                                  {event.title}
                                </Link>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {event.category}
                                </p>
                              </td>
                              <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">
                                {new Date(event.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </td>
                              <td className="px-5 py-4 text-muted-foreground hidden md:table-cell truncate max-w-[200px]">
                                {event.location}
                              </td>
                              <td className="px-5 py-4 text-right text-foreground">
                                {event.attendees.toLocaleString()}
                              </td>
                              <td className="px-5 py-4 text-right">
                                <span
                                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.cls}`}
                                >
                                  {status.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Analytics ─────────────────────────────────────────────── */}
              {activeTab === "analytics" && (
                <div className="space-y-5">
                  {/* Summary cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      {
                        label: "Avg Revenue / Event",
                        value: fmtRevenue(revenue / orgEvents.length),
                      },
                      {
                        label: "Avg Attendees / Event",
                        value: Math.floor(
                          totalAttendees / orgEvents.length,
                        ).toLocaleString(),
                      },
                      { label: "Est. Page Views", value: "12.4K" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-border/50 bg-card p-5 text-center shadow-card"
                      >
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="font-display mt-1 text-2xl font-bold text-foreground">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Per-event breakdown */}
                  <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
                    <div className="border-b border-border/50 px-5 py-4">
                      <h3 className="font-display font-semibold text-foreground">
                        Per-Event Breakdown
                      </h3>
                    </div>
                    {orgEvents.map((event, i) => {
                      const evSold = event.ticketTypes
                        ? event.ticketTypes.reduce((s, t) => s + t.sold, 0)
                        : Math.floor(event.attendees * 0.7);
                      const evRev = event.ticketTypes
                        ? event.ticketTypes.reduce(
                            (s, t) => s + t.sold * t.price,
                            0,
                          )
                        : event.price * Math.floor(event.attendees * 0.7);
                      const capacity = event.ticketTypes
                        ? event.ticketTypes.reduce((s, t) => s + t.quantity, 0)
                        : event.attendees;
                      const pct = Math.min(
                        100,
                        Math.round((evSold / Math.max(capacity, 1)) * 100),
                      );
                      const status = getStatus(event.date);

                      return (
                        <div
                          key={event.id}
                          className={`px-5 py-4 hover:bg-secondary/30 transition-colors ${
                            i < orgEvents.length - 1
                              ? "border-b border-border/30"
                              : ""
                          }`}
                        >
                          <div className="mb-2 flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="line-clamp-1 text-sm font-medium text-foreground">
                                {event.title}
                              </p>
                              <div className="mt-0.5 flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {event.price === 0
                                    ? "Free"
                                    : `₦${event.price.toLocaleString()} / ticket`}
                                </p>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.cls}`}
                                >
                                  {status.label}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-sm font-semibold text-foreground">
                                {fmtRevenue(evRev)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {evSold.toLocaleString()} tickets sold
                              </p>
                            </div>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-secondary">
                            <motion.div
                              className="h-full rounded-full gradient-primary"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.8,
                                delay: i * 0.1,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {pct}% capacity filled
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Announcements ─────────────────────────────────────────── */}
              {activeTab === "announcements" && (
                <div className="space-y-6">
                  {/* Compose */}
                  <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
                    <h3 className="mb-3 flex items-center gap-2 font-display font-semibold text-foreground">
                      <Megaphone className="h-4 w-4 text-primary" />
                      Post Announcement
                    </h3>
                    <Textarea
                      placeholder="Write an update for your attendees…"
                      value={draftText}
                      onChange={(e) => setDraftText(e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="mb-2 resize-none border-border/50 bg-secondary/50"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {draftText.length}/500
                      </span>
                      <Button
                        onClick={handlePost}
                        disabled={!draftText.trim()}
                        className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-40"
                      >
                        <Megaphone className="mr-2 h-4 w-4" /> Post
                      </Button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {announcements.map((ann) => (
                        <motion.div
                          key={ann.id}
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-2xl border border-border/50 bg-card p-5 shadow-card"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full gradient-primary">
                              <Megaphone className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-primary">
                                Organizer Update
                              </span>
                              <p className="mt-0.5 text-sm text-foreground">
                                {ann.text}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {ann.timestamp}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;
