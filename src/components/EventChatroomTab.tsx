import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageCircle, Megaphone, Send, X, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// Lazily import Echo so the app doesn't crash if Reverb isn't configured yet
let echo: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  echo = require("@/lib/echo").default;
} catch {
  // Reverb not configured — real-time updates won't work but REST still will
}

interface ChatMessage {
  id: string | number;
  content: string;
  user_id: string | number;
  created_at: string;
  isOrganizer?: boolean;
  user?: { id: string | number; name: string; avatar?: string | null };
}

interface EventChatroomTabProps {
  eventId: string | number;
  organizerName: string;
  chatrooms?: any[];
  onSelectUser?: (userId: string) => void;
  isOrganizer?: boolean;
  activeTab?: string;
}

export const EventChatroomTab = ({
  eventId,
  organizerName,
  onSelectUser,
  isOrganizer,
  activeTab,
}: EventChatroomTabProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState<ChatMessage | null>(null);
  const [chatroomId, setChatroomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("access_token") ?? "";
  const myUserId = (user as any)?.id;

  // ── Load chatroom and message history ─────────────────────────────────────
  useEffect(() => {
    if (!eventId || !token) {
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        // 1. Get or create chatroom for this event
        const roomRes = await api.get(`events/${eventId}/chatroom`, undefined, token);
        const room = roomRes?.chatroom;
        if (!room?.id) throw new Error("No chatroom returned");
        setChatroomId(room.id);

        // 2. Fetch last 50 messages
        const msgRes = await api.get(`chatrooms/${room.id}/messages`, undefined, token);
        setMessages(msgRes?.messages ?? []);

        // Pin first organizer message as announcement if any
        const firstOrg = (msgRes?.messages ?? []).find((m: ChatMessage) => m.isOrganizer);
        if (firstOrg) setPinnedAnnouncement(firstOrg);
      } catch (err) {
        console.error("Failed to load chatroom:", err);
        setError(true);
        toast.error("Couldn't load chat. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [eventId, token]);

  // ── Subscribe to real-time messages via Echo ───────────────────────────────
  useEffect(() => {
    if (!chatroomId || !echo) return;

    const channel = echo
      .private(`chatroom.${chatroomId}`)
      .listen(".ChatroomMessageSent", (e: { message: ChatMessage }) => {
        setMessages((prev) => {
          // Avoid duplicates if our own message was already optimistically added
          if (prev.some((m) => m.id === e.message.id)) return prev;
          return [...prev, e.message];
        });
      });

    return () => {
      echo.leave(`chatroom.${chatroomId}`);
    };
  }, [chatroomId]);

  // ── Auto-scroll to bottom on new messages ─────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Focus input when chat tab becomes active ───────────────────────────────
  useEffect(() => {
    if (activeTab === "chat") inputRef.current?.focus();
  }, [activeTab]);

  // ── Send a message ─────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || !chatroomId || sending) return;
    if (!token) {
      toast.error("Please log in to send messages");
      return;
    }

    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: input.trim(),
      user_id: myUserId ?? "me",
      created_at: new Date().toISOString(),
      isOrganizer,
      user: { id: myUserId ?? "me", name: user ? (user as any).name || "You" : "You" },
    };

    // Optimistic update
    setMessages((prev) => [...prev, tempMsg]);
    if (isOrganizer) setPinnedAnnouncement(tempMsg);
    setInput("");
    setSending(true);

    try {
      const res = await api.post(`chatrooms/${chatroomId}/messages`, { content: tempMsg.content }, token);
      // Replace temp with real message from server
      const real = res?.message;
      if (real) {
        setMessages((prev) => prev.map((m) => (m.id === tempMsg.id ? real : m)));
        if (isOrganizer) setPinnedAnnouncement(real);
      }
      if (isOrganizer) toast.success("Announcement pinned!");
    } catch (err: any) {
      console.error("Send failed:", err);
      // Roll back optimistic message
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      toast.error(err?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handlePinMessage = (msg: ChatMessage) => {
    setPinnedAnnouncement(msg);
    toast.success("Message pinned as announcement!");
  };

  // ── Render helpers ─────────────────────────────────────────────────────────
  const isMyMessage = (msg: ChatMessage) =>
    String(msg.user_id) === String(myUserId) || msg.id?.toString().startsWith("temp-");

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-border/50 bg-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
            💬 Event Chat
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Chat with other attendees and the organizer
          </p>
        </div>
        {/* Participant count placeholder */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
          <Users className="h-3 w-3" />
          Live
        </div>
      </div>

      {/* Pinned Announcement */}
      <AnimatePresence>
        {pinnedAnnouncement && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4 py-2 bg-amber-500/5 border-b border-amber-500/20 flex items-center gap-3 relative group"
          >
            <Megaphone className="h-4 w-4 text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">
                Pinned Announcement
              </p>
              <p className="text-xs text-foreground truncate">{pinnedAnnouncement.content}</p>
            </div>
            {isOrganizer && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPinnedAnnouncement(null)}
                className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-muted/5">
        {loading ? (
          <div className="flex h-full items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center py-16 gap-3">
            <WifiOff className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Failed to load messages</p>
            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-16 gap-2">
            <MessageCircle className="h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm font-medium text-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground">Be the first to say hello! 👋</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const mine = isMyMessage(msg);
              const announcement = !!msg.isOrganizer;
              const senderName = msg.user?.name ?? (mine ? "You" : "Attendee");
              const initials = senderName.slice(0, 2).toUpperCase();

              return (
                <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"} group`}>
                  <div className={`flex gap-3 max-w-[85%] ${mine ? "flex-row-reverse" : "flex-row"}`}>
                    {!mine && (
                      <button
                        onClick={() => {
                          const uid = String(msg.user?.id ?? msg.user_id);
                          if (uid && uid !== "organizer") onSelectUser?.(uid);
                        }}
                        className="h-9 w-9 mt-1 shrink-0 transition-transform hover:scale-110 active:scale-95"
                      >
                        <Avatar className={`h-full w-full border shadow-sm ${announcement ? "border-amber-500/40 bg-amber-500/10" : "border-border/50"}`}>
                          <AvatarImage src={msg.user?.avatar ?? undefined} />
                          <AvatarFallback className={`${announcement ? "text-amber-600" : "bg-primary/10 text-primary"} text-[11px] font-bold`}>
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    )}
                    <div className="relative">
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm shadow-sm transition-all ${
                          announcement
                            ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                            : mine
                              ? "gradient-primary text-primary-foreground rounded-br-none"
                              : "bg-card text-foreground border border-border/50 rounded-bl-none"
                        }`}
                      >
                        {!mine && (
                          <span className={`text-[10px] font-bold mb-1.5 block tracking-wide ${announcement ? "text-amber-600" : "text-primary"}`}>
                            {senderName}
                            {announcement && <span className="ml-1 opacity-70">• Organizer</span>}
                          </span>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <div className="mt-1.5 flex items-center justify-end gap-1.5">
                          {pinnedAnnouncement?.id === msg.id && (
                            <Megaphone className="h-2.5 w-2.5 text-amber-500" />
                          )}
                          <p className="text-[10px] opacity-50 font-medium">
                            {new Date(msg.created_at).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Pin button for organizers */}
                      {isOrganizer && pinnedAnnouncement?.id !== msg.id && (
                        <button
                          onClick={() => handlePinMessage(msg)}
                          className={`absolute top-0 ${mine ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-amber-500`}
                          title="Pin as announcement"
                        >
                          <Megaphone className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="p-4 border-t border-border/50 bg-card">
        {!token ? (
          <p className="text-center text-xs text-muted-foreground py-2">
            Please <span className="text-primary font-medium">sign in</span> to join the chat
          </p>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                placeholder={isOrganizer ? "Post an announcement..." : "Message the group..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-secondary border-border/50 h-11"
                disabled={sending}
              />
              <Button
                type="submit"
                size="icon"
                disabled={sending || !input.trim()}
                className="h-11 w-11 gradient-primary text-primary-foreground shrink-0 shadow-glow"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            {isOrganizer && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  <Megaphone className="h-2.5 w-2.5" />
                  Organizer Mode: Messages pin automatically
                </span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
