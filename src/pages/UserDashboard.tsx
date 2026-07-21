import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Ticket,
  MessageCircle,
  Bell,
  Bookmark,
  MapPin,
  BellRing,
  ArrowLeft,
} from "lucide-react";
import { BackButton } from "@/components/BackButton";
import EventCard from "@/components/EventCard";
import EventsSection from "@/components/EventsSection";
import EventsNearYou from "@/components/EventsNearYou";
import ConversationList from "@/components/ConversationList";
import MessageThread from "@/components/MessageThread";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
} from "@/components/ui/sheet";
import { DataStateWrapper } from "@/components/ui/DataStateWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { generateEventSuggestions } from "@/lib/eventSuggestions";
import { api, getFullAvatarUrl } from "@/lib/api";
import { useSavedEvents } from "@/hooks/useBookmark";
import echo from "@/lib/echo";

type Tab = "upcoming" | "saved" | "past" | "notifications" | "messages";

type NotifCategory = "reminder" | "ticket" | "suggestion" | "announcement" | "nearby";

interface Notification {
  id: number;
  title: string;
  description: string;
  category: NotifCategory;
  icon: string;
  read_at: string | null;
  created_at: string;
}

interface Conversation {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  lastMessage: {
    id: number;
    content: string;
    sender_id: string;
    created_at: string;
  };
  messages: any[];
  unread_count: number;
}

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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as Tab) || "upcoming";

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [notifFilter, setNotifFilter] = useState<"all" | NotifCategory>("all");
  
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [notificationsError, setNotificationsError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        const [publicRes, savedRes, myEventsRes, messagesRes, notificationsRes] = await Promise.all([
          api.get("public/events", undefined, undefined, { bypassCache: true }),
          Promise.resolve({ events: [] }),
          token ? api.get("user-events", undefined, token) : Promise.resolve({ events: [] }),
          token ? api.get("user-messages", undefined, token) : Promise.resolve({ conversations: [], users: [] }),
          token ? api.get("notifications", undefined, token).catch(() => ({ notifications: [] })) : Promise.resolve({ notifications: [] })
        ]);
        
        if (publicRes?.events) setAllEvents(Array.isArray(publicRes.events) ? publicRes.events : typeof publicRes.events === 'object' ? Object.values(publicRes.events) : []);
        if (myEventsRes?.events) setUserEvents(Array.isArray(myEventsRes.events) ? myEventsRes.events : typeof myEventsRes.events === 'object' ? Object.values(myEventsRes.events) : []);
        if (messagesRes?.conversations) setConversations(messagesRes.conversations);
        if (messagesRes?.users) setUsers(messagesRes.users);
        if (notificationsRes?.notifications) setNotifications(notificationsRes.notifications);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setNotificationsError("Failed to load data");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Real-time Echo: push incoming notifications into state
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = stored?.id;
    if (!echo || !userId) return;

    echo
      .private(`notifications.${userId}`)
      .listen('.NotificationCreated', (e: { notification: any }) => {
        setNotifications((prev: any[]) => [e.notification, ...prev]);
      });

    return () => {
      echo.leave(`notifications.${userId}`);
    };
  }, []);

  const setActiveTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    setSearchParams(params);
  };

  const handleOpenMessages = () => {
    navigate("/dashboard/messages");
  };


  const displayName =
    user?.user_metadata?.display_name || 
    (user as any)?.name || 
    user?.email?.split("@")[0] || 
    "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, [user]);

  const rawAvatarUrl =
    user?.avatar ||
    user?.avatar_url ||
    user?.user_metadata?.avatar ||
    user?.user_metadata?.avatar_url ||
    storedUser?.avatar ||
    storedUser?.avatar_url ||
    storedUser?.user_metadata?.avatar ||
    storedUser?.user_metadata?.avatar_url;

  const fullAvatarUrl = getFullAvatarUrl(rawAvatarUrl);

  useEffect(() => {
    try {
      const recent = localStorage.getItem("recentlyViewedEvents");
      if (recent) setRecentlyViewedIds(JSON.parse(recent) as string[]);
    } catch {
      // ignore parse errors
    }
  }, []);

  const recentlyViewedEvents = recentlyViewedIds
    .map((rid) => allEvents.find((e) => String(e.id) === String(rid)))
    .filter((e): e is any => Boolean(e))
    .slice(0, 6);

  const now = new Date();
  const upcomingEvents = userEvents
    .filter((e) => new Date(e.date || e.start_date) >= now)
    .slice(0, 3);
  
  // Retrieve saved events using central hook
  const { data: savedEvents = [] } = useSavedEvents();
  const allSavedIds = savedEvents.map((e) => String(e.id));  
  
  const pastEvents = userEvents
    .filter((e) => new Date(e.date || e.start_date) < now)
    .slice(0, 3);

  const upcomingEventIds = upcomingEvents.map((e) => String(e.id));
  const pastEventIds = pastEvents.map((e) => String(e.id));

  const suggestedEvents = useMemo(
    () =>
      generateEventSuggestions({
        allEvents: allEvents,
        savedEventIds: allSavedIds,
        excludeEventIds: [...upcomingEventIds, ...pastEventIds],
        maxSuggestions: 6,
      }),
    [allEvents, allSavedIds.join(","), upcomingEventIds.join(","), pastEventIds.join(",")]
  );

  // Loading and Error states are handled by DataStateWrapper below

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
    { id: "notifications", label: "Notifications", Icon: Bell, count: notifications.filter(n => !n.read_at).length },
    { id: "messages", label: "Messages", Icon: MessageCircle, count: conversations.reduce((total, c) => total + (c.unread_count || 0), 0) },
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
      count: conversations.reduce((total, c) => total + (c.unread_count || 0), 0) || null,
      action: handleOpenMessages,
    },
  ];

  return (
    <>
      <DataStateWrapper 
        isLoading={isLoading} 
        isError={isError} 
        isEmpty={false} 
        emptyMessage="No dashboard data found"
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Profile header */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start max-w-full">
          <div className="relative shrink-0">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-2 border-primary/30">
                <AvatarImage
                  src={fullAvatarUrl}
                  alt={displayName}
                />
                <AvatarFallback className="gradient-primary text-primary-foreground text-xl sm:text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div className="text-center sm:text-left min-w-0 max-w-full">
              <h2 className="font-display text-xl sm:text-3xl font-bold text-foreground break-words max-w-full">
                Welcome back,{" "}
                <span className="text-gradient inline-block">{displayName}</span>!
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{user?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Member since {(() => {
                  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
                  const createdAt = user?.created_at || storedUser?.created_at;
                  if (createdAt) {
                    const year = new Date(createdAt).getFullYear();
                    if (!isNaN(year)) return year;
                  }
                  return new Date().getFullYear();
                })()}
              </span>
            </div>
          </div>

          {/* Quick action cards */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-full">
            {QUICK_ACTIONS.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="group rounded-2xl border border-border/50 bg-card p-3.5 sm:p-5 text-center transition-all hover:border-primary/30 hover:bg-secondary/50 hover:shadow-card"
              >
                <item.Icon className="mx-auto mb-1.5 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                  {item.label}
                </p>
                {item.count !== null && (
                  <p className="mt-0.5 text-xl sm:text-2xl font-bold text-foreground">
                    {item.count}
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Tab bar */}
          <div className="mb-8 flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "messages") {
                    navigate("/dashboard/messages");
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={[
                  "flex shrink-0 items-center gap-2 rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200",
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
                        <EventCard
                          key={e.id}
                          event={e}
                          index={i}
                        />
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
                      events={allEvents.filter((e) => new Date(e.date || e.start_date) >= now)}
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
                    ? notifications
                    : notifications.filter((n) => n.category === notifFilter);
                
                const getCategoryIcon = (category: NotifCategory) => {
                  const iconMap: Record<NotifCategory, typeof Bell> = {
                    reminder: Bell,
                    ticket: Ticket,
                    suggestion: Calendar,
                    announcement: BellRing,
                    nearby: MapPin
                  };
                  return iconMap[category] || Bell;
                };

                const formatTime = (timestamp: string) => {
                  const date = new Date(timestamp);
                  const now = new Date();
                  const diffMs = now.getTime() - date.getTime();
                  const diffMins = Math.floor(diffMs / 60000);
                  const diffHours = Math.floor(diffMs / 3600000);
                  const diffDays = Math.floor(diffMs / 86400000);

                  if (diffMins < 1) return 'Just now';
                  if (diffMins < 60) return `${diffMins}m ago`;
                  if (diffHours < 24) return `${diffHours}h ago`;
                  if (diffDays === 1) return 'Yesterday';
                  return `${diffDays}d ago`;
                };

                return (
                  <>
                    <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                      {NOTIF_FILTERS.map((f) => {
                        const count =
                          f.id === "all"
                            ? notifications.length
                            : notifications.filter((n) => n.category === f.id).length;
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
                    {notificationsError && (
                      <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                        {notificationsError}
                      </div>
                    )}
                    {filtered.length === 0 ? (
                      <EmptyState
                        Icon={Bell}
                        title="No notifications"
                        desc="You're all caught up in this category."
                      />
                    ) : (
                      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
                        {filtered.map((notif, i) => {
                          const IconComponent = getCategoryIcon(notif.category);
                          const isUnread = !notif.read_at;
                          
                          return (
                            <div
                              key={notif.id}
                              className={[
                                "flex items-start gap-4 px-5 py-4 transition-colors hover:bg-secondary/40 cursor-pointer",
                                i < filtered.length - 1 ? "border-b border-border/30" : "",
                                isUnread ? "bg-primary/5" : "",
                              ].join(" ")}
                              onClick={async () => {
                                if (isUnread) {
                                  const token = localStorage.getItem("access_token");
                                  if (token) {
                                    try {
                                      await api.patch(`notifications/${notif.id}/read`, {}, token);
                                      // Update local state
                                      setNotifications(
                                        notifications.map(n =>
                                          n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n
                                        )
                                      );
                                    } catch (err) {
                                      console.error("Failed to mark notification as read", err);
                                    }
                                  }
                                }
                              }}
                            >
                              <div
                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                  isUnread ? "gradient-primary" : "bg-secondary"
                                }`}
                              >
                                <IconComponent
                                  className={`h-5 w-5 ${
                                    isUnread ? "text-primary-foreground" : "text-muted-foreground"
                                  }`}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-foreground">
                                    {notif.title}
                                  </p>
                                  {isUnread && (
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                                  )}
                                </div>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                  {notif.description}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground/60">
                                  {formatTime(notif.created_at)}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Messages Tab consolidated and handled in /dashboard/messages */}
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

        {/* Consolidated messaging drawer sheet removed */}

        {/* Floating Chat Button */}
        <motion.div 
          className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            size="lg" 
            className="h-14 w-14 rounded-full gradient-primary shadow-glow p-0 flex items-center justify-center border-none"
            onClick={handleOpenMessages}
          >
            <MessageCircle className="h-6 w-6 text-white" />
            {conversations.some(c => c.unread_count > 0) && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-background">
                {conversations.reduce((total, c) => total + c.unread_count, 0)}
              </span>
            )}
          </Button>
        </motion.div>
      </DataStateWrapper>
    </>
  );
};

export default UserDashboard;
