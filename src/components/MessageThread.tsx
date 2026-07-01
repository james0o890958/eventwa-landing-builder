import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";

// Lazily import Echo — app won't crash if Reverb isn't configured yet
let echo: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  echo = require("@/lib/echo").default;
} catch {
  // Reverb not configured
}

interface Message {
  id: number;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  read_at: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface MessageThreadProps {
  userId: string;
  messages?: Message[];
  user?: User;
  onBack?: () => void;
}

const MessageThread = ({ userId, messages: initialMessages = [], user: initialUser, onBack }: MessageThreadProps) => {
  const authUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
  const token = localStorage.getItem("access_token") || "";
  const myId = String(authUser?.id ?? "");
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [user, setUser] = useState<User | undefined>(initialUser);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch conversation if not provided
    if (!initialMessages.length && token && userId) {
      const fetchConversation = async () => {
        try {
          const response = await api.get(`messages/${userId}`, undefined, token);
          if (response?.conversation) {
            setMessages(response.conversation.messages || []);
            setUser(response.conversation.user);
          }
        } catch (err) {
          console.error("Failed to fetch conversation", err);
        }
      };
      fetchConversation();
    }
  }, [userId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [userId]);

  // ── Real-time: listen for incoming DMs via Laravel Echo ──────────────────
  useEffect(() => {
    if (!echo || !myId) return;

    const channel = echo
      .private(`messages.${myId}`)
      .listen(".PrivateMessageSent", (e: { message: Message }) => {
        // Only append if it's from the person we're currently chatting with
        if (String(e.message.sender_id) === String(userId)) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === e.message.id)) return prev;
            return [...prev, e.message];
          });
        }
      });

    return () => {
      echo.leave(`messages.${myId}`);
    };
  }, [myId, userId]);

  const handleSend = async () => {
    if (!input.trim() || !token) return;
    
    setIsSending(true);
    try {
      const response = await api.post("messages", {
        recipient_id: userId,
        content: input.trim()
      }, token);

      if (response?.data) {
        setMessages((prev) => [...prev, response.data]);
        setInput("");
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name?: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 p-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 lg:hidden">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-foreground">{user?.name || "User"}</p>
          <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((msg) => {
            const isMine = msg.sender_id === authUser?.id || msg.sender_id === localStorage.getItem("user_id");
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`mt-1 text-[10px] ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border/50 p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            id="message-input"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            className="flex-1 bg-muted/50 border-border/50"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="gradient-primary text-primary-foreground shrink-0"
            disabled={isSending || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessageThread;

