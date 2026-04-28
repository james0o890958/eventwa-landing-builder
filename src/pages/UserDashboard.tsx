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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { mockEvents } from "@/data/mockEvents";
import { mockConversations, mockUsers } from "@/data/mockUsers";
import { generateEventSuggestions } from "@/lib/eventSuggestions";

type Tab = "upcoming" | "saved" | "past" | "notifications" | "messages";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get("tab") as Tab) || "upcoming";
  const selectedUserId = searchParams.get("userId");
  const chatViewOpen = searchParams.get("chat") === "true";

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [notifFilter, setNotifFilter] = useState<"all" | NotifCategory>("all");

  const selectedConversation = useMemo(() => {
    if (!selectedUserId) return null;
    const conv = mockConversations.find(c => c.userId === selectedUserId);
    if (conv) return conv;
    // Fallback for temporary conversation
    const u = mockUsers.find(x => x.id === selectedUserId);
    if (u) return { id: `temp-${selectedUserId}`, userId: selectedUserId, messages: [] };
    return null;
  }, [selectedUserId]);

  // Only open the sheet if we're NOT on the dedicated messages tab
  const chatOpen = (chatViewOpen || !!selectedConversation) && activeTab !== "messages";

  const setActiveTab = (tab: Tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    setSearchParams(params);
  };

  const setSelectedConversation = (conv: typeof mockConversations[number] | null) => {
    const params = new URLSearchParams(searchParams);
    if (conv) {
      params.set("userId", conv.userId);
      // Ensure we are in messages tab or show chat sheet
      if (activeTab !== "messages") {
        params.set("chat", "true");
      }
    } else {
      params.delete("userId");
    }
    setSearchParams(params);
  };

  const setChatOpen = (open: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (open) {
      params.set("chat", "true");
    } else {
      params.delete("chat");
      params.delete("userId");
    }
    setSearchParams(params);
  };


  const chatContacts = mockConversations
    .map((conv) => {
      const u = mockUsers.find((x) => x.id === conv.userId);
      const last = conv.messages[conv.messages.length - 1];
      return u ? { user: u, last } : null;
    })
    .filter((c): c is { user: typeof mockUsers[number]; last: typeof mockConversations[number]["messages"][number] } => Boolean(c));

  const openChat = (uid: string) => {
    const conv = mockConversations.find(c => c.userId === uid);
    if (conv) {
      setSelectedConversation(conv);
      setChatOpen(true);
    } else {
      const user = mockUsers.find(u => u.id === uid);
      if (user) {
        setSelectedConversation({ id: `temp-${uid}`, userId: uid, messages: [] });
        setChatOpen(true);
      }
    }
  };

  const handleOpenMessages = () => {
    setSelectedConversation(null);
    setChatOpen(true);
  };


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
    { id: "messages", label: "Messages", Icon: MessageCircle, count: chatContacts.length },
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
      count: chatContacts.length,
      action: handleOpenMessages,
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

              {/* Messages Tab */}
              {activeTab === "messages" && (
                <div className="space-y-4">
                  {selectedConversation ? (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center">
                        <BackButton 
                          label="Back to Messages" 
                          onClick={() => setSelectedConversation(null)} 
                        />
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card h-[600px]">
                        <MessageThread 
                          userId={selectedConversation.userId}
                          messages={selectedConversation.messages}
                          onBack={() => setSelectedConversation(null)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                      <div className="flex items-center">
                        <BackButton 
                          label="Back to Dashboard" 
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.delete("tab");
                            setSearchParams(params);
                          }} 
                        />
                      </div>
                      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card h-[600px]">
                        <ConversationList 
                          activeConversationId={null}
                          onSelectConversation={(conv) => {
                            setSelectedConversation(conv);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
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

        {/* Right off-canvas: Direct Chat */}
        <Sheet open={chatOpen} onOpenChange={setChatOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-l border-border/50 shadow-2xl">
            <SheetHeader className="border-b border-border/50 p-4 flex-row items-center gap-3 space-y-0 bg-background/80 backdrop-blur-md sticky top-0 z-10">
              {(selectedConversation || chatViewOpen) && (
                <BackButton 
                  className="shrink-0"
                  onClick={() => {
                    if (selectedConversation) {
                      setSelectedConversation(null);
                    } else {
                      setChatOpen(false);
                    }
                  }}
                />
              )}
              <div className="flex-1">
                <SheetTitle className="font-display text-lg font-bold">
                  {selectedConversation ? "Direct Chat" : "Chat with attendees"}
                </SheetTitle>
                <SheetDescription className="text-xs font-medium text-muted-foreground">
                  {selectedConversation 
                    ? `Messaging with ${mockUsers.find(u => u.id === selectedConversation.userId)?.name}` 
                    : "Connect with event participants"}
                </SheetDescription>
              </div>
            </SheetHeader>
            
            <div className="flex-1 overflow-hidden bg-card/30">
              {selectedConversation ? (
                <MessageThread 
                  userId={selectedConversation.userId}
                  messages={selectedConversation.messages}
                  onBack={() => {
                    setSelectedConversation(null);
                    setActiveTab("messages");
                  }}
                />
              ) : (
                <ConversationList 
                  activeConversationId={null}
                  onSelectConversation={(conv) => setSelectedConversation(conv)}
                />
              )}
            </div>

            {!selectedConversation && (
              <div className="border-t border-border/50 p-4 bg-background/50">
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-semibold">
                  Private & Secure Messaging
                </p>
              </div>
            )}
          </SheetContent>
        </Sheet>

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
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-background">
              3
            </span>
          </Button>
        </motion.div>

      </>
    );
};

export default UserDashboard;
