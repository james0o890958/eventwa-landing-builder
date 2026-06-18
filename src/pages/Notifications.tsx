import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Ticket,
  MapPin,
  BellRing,
  Calendar,
  Megaphone,
  Star,
  Check,
  Trash2,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface Notification {
  id: number | string;
  title: string;
  description: string;
  category: "reminder" | "ticket" | "suggestion" | "announcement" | "review" | "nearby" | "other";
  read_at: string | null;
  created_at: string;
  link?: string;
}

const TYPE_CONFIG: Record<
  Notification["category"],
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  reminder: {
    icon: Bell,
    color: "text-amber-500",
    bg: "bg-amber-500/15",
    label: "Reminder",
  },
  ticket: {
    icon: Ticket,
    color: "text-emerald-500",
    bg: "bg-emerald-500/15",
    label: "Ticket",
  },
  suggestion: {
    icon: Star,
    color: "text-violet-500",
    bg: "bg-violet-500/15",
    label: "For You",
  },
  announcement: {
    icon: Megaphone,
    color: "text-primary",
    bg: "bg-primary/15",
    label: "Announcement",
  },
  review: {
    icon: Star,
    color: "text-amber-400",
    bg: "bg-amber-400/15",
    label: "Review",
  },
  nearby: {
    icon: MapPin,
    color: "text-blue-500",
    bg: "bg-blue-500/15",
    label: "Nearby",
  },
  other: {
    icon: Bell,
    color: "text-muted-foreground",
    bg: "bg-muted/15",
    label: "Other",
  },
};

const FILTER_TABS = [
  { id: "all", label: "All" },
  { id: "announcement", label: "Announcements" },
  { id: "ticket", label: "Tickets" },
  { id: "reminder", label: "Reminders" },
  { id: "suggestion", label: "For You" },
  { id: "nearby", label: "Nearby" },
] as const;

type FilterId = (typeof FILTER_TABS)[number]["id"];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("access_token") || "";

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const allResponse = await api.get("notifications", undefined, token);
        if (allResponse?.notifications) {
          setAllNotifications(allResponse.notifications);
          if (activeFilter === "all") {
            setNotifications(allResponse.notifications);
          }
        }

        if (activeFilter !== "all") {
          const categoryResponse = await api.get(`notifications/category/${activeFilter}`, undefined, token);
          setNotifications(categoryResponse?.notifications ?? []);
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
        setError("Unable to load notifications at this time.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [token, activeFilter]);

  const unreadCount = allNotifications.filter((n) => !n.read_at).length;

  const filtered = notifications;

  const markAllRead = async () => {
    if (!token) return;

    try {
      await api.patch("notifications/read-all", {}, token);
      setAllNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  const markRead = async (id: string | number) => {
    if (!token) return;

    try {
      await api.patch(`notifications/${id}/read`, {}, token);
      setAllNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const deleteNotification = async (id: string | number) => {
    if (!token) return;

    try {
      await api.delete(`notifications/${id}`, token);
      setAllNotifications((prev) => prev.filter((n) => n.id !== id));
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const clearAll = async () => {
    if (!token) return;

    try {
      await api.delete("notifications", token);
      setAllNotifications([]);
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-3xl px-4 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
                <BellRing className="h-6 w-6 text-primary-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Notifications
                </h1>
                <p className="text-sm text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                    : "All caught up!"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={markAllRead}
                  className="border-border/50 text-xs gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={clearAll}
                  className="border-border/50 text-xs gap-1.5 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear all
                </Button>
              )}
              <Link to="/settings/notifications">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border/50 text-xs gap-1.5"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.id === "all"
                ? notifications.length
                : notifications.filter((n) => n.category === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === tab.id
                    ? "gradient-primary text-white shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                      activeFilter === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Bell className="mb-4 h-16 w-16 text-muted-foreground/20" />
            <h2 className="font-display text-xl font-semibold text-foreground">
              No notifications
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {activeFilter === "all"
                ? "You're all caught up! No new notifications."
                : `No ${activeFilter} notifications yet.`}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {filtered.map((notif, i) => {
                const config = TYPE_CONFIG[notif.category];
                const Icon = config.icon;
                const isRead = !!notif.read_at;

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16, height: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                    className={`group relative overflow-hidden rounded-2xl border transition-all ${
                      isRead
                        ? "border-border/50 bg-card"
                        : "border-primary/20 bg-primary/5"
                    }`}
                  >
                    {/* Unread indicator */}
                    {!isRead && (
                      <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl gradient-primary" />
                    )}

                    <div className="flex items-start gap-4 p-4 pl-5">
                      {/* Icon */}
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.bg}`}
                      >
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.color}`}
                          >
                            {config.label}
                          </span>
                          {!isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="font-medium text-foreground text-sm">
                          {notif.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
                          {notif.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(notif.created_at).toLocaleString()}
                          </span>
                          {notif.link && (
                            <Link
                              to={notif.link}
                              onClick={() => markRead(notif.id)}
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              View →
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isRead && (
                          <button
                            onClick={() => markRead(notif.id)}
                            title="Mark as read"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          title="Delete notification"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
