import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Message {
  id: number;
  content: string;
  sender_id: string;
  created_at: string;
  read_at: string | null;
}

interface Conversation {
  id: string;
  userId: string;
  user: User;
  lastMessage: Message;
  messages: Message[];
  unread_count: number;
}

interface ConversationListProps {
  activeConversationId: string | null;
  onSelectConversation: (conv: Conversation) => void;
}

const ConversationList = ({ activeConversationId, onSelectConversation }: ConversationListProps) => {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("access_token") || "";

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if (!token) return;
        const response = await api.get("messages", undefined, token);
        if (response?.conversations) {
          setConversations(response.conversations);
        }
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [token]);

  const filteredConversations = conversations.filter((c) =>
    c.user?.name.toLowerCase().includes(search.toLowerCase()) ||
    c.user?.email.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="border-b border-border/50 p-4">
        <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-muted/50 border-border/50"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {isLoading ? (
          <p className="p-4 text-center text-sm text-muted-foreground">Loading conversations...</p>
        ) : filteredConversations.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">No conversations yet</p>
        ) : (
          filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50 ${
                activeConversationId === conv.userId ? "bg-accent/70" : ""
              } ${conv.unread_count > 0 ? "bg-primary/5" : ""}`}
            >
              <div className="relative">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                    {getInitials(conv.user?.name)}
                  </AvatarFallback>
                </Avatar>
                {conv.unread_count > 0 && (
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {conv.unread_count}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className={`truncate text-sm ${conv.unread_count > 0 ? "font-semibold" : "font-medium"} text-foreground`}>
                    {conv.user?.name}
                  </p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(conv.lastMessage.created_at).toLocaleDateString("en-US", { 
                      month: "short", 
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                <p className={`truncate text-xs ${conv.unread_count > 0 ? "text-muted-foreground font-medium" : "text-muted-foreground"}`}>
                  {conv.lastMessage.content}
                </p>
              </div>
            </button>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
