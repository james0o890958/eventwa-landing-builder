import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockUsers, mockConversations, type MockConversation } from "@/data/mockUsers";
import { useState } from "react";

interface ConversationListProps {
  activeConversationId: string | null;
  onSelectConversation: (conv: MockConversation) => void;
}

const ConversationList = ({ activeConversationId, onSelectConversation }: ConversationListProps) => {
  const [search, setSearch] = useState("");

  const conversations = mockConversations
    .map((conv) => {
      const user = mockUsers.find((u) => u.id === conv.userId);
      const lastMessage = conv.messages[conv.messages.length - 1];
      return { ...conv, user, lastMessage };
    })
    .filter((c) => c.user?.name.toLowerCase().includes(search.toLowerCase()));

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
        {conversations.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50 ${
                activeConversationId === conv.id ? "bg-accent/70" : ""
              }`}
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
                  {conv.user?.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-foreground">{conv.user?.name}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(conv.lastMessage.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">{conv.lastMessage.text}</p>
              </div>
            </button>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
