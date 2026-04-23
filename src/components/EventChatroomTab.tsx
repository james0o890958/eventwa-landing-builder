import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, MessageCircle, Megaphone, ChevronRight, Send, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockUsers, currentUserId, type MockMessage, mockConversations } from "@/data/mockUsers";
import { toast } from "sonner";

interface EventChatroomTabProps {
  eventId: string;
  organizerName: string;
  onSelectUser?: (userId: string) => void;
  isOrganizer?: boolean;
  activeTab?: string;
}

export const EventChatroomTab = ({ eventId, organizerName, onSelectUser, isOrganizer }: EventChatroomTabProps) => {
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [input, setInput] = useState("");
  const [pinnedAnnouncement, setPinnedAnnouncement] = useState<MockMessage | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load initial messages
  useEffect(() => {
    // Merge some group messages and announcements for the demo
    const initialMessages: MockMessage[] = [
      ...mockConversations.flatMap((conv) => conv.messages),
      {
        id: "ann1",
        senderId: "organizer",
        text: `Welcome to ${organizerName}'s event! We're excited to have you here.`,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    setMessages(initialMessages);
    // Set the latest announcement as pinned by default for demo
    setPinnedAnnouncement(initialMessages.filter(m => m.senderId === "organizer").pop() || null);
  }, [organizerName]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  // Focus input when chat tab is active
  useEffect(() => {
    if (activeTab === "chat") {
      inputRef.current?.focus();
    }
  }, [activeTab]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: MockMessage = {
      id: `m${Date.now()}`,
      senderId: isOrganizer ? "organizer" : currentUserId,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, newMsg]);
    
    if (isOrganizer) {
      setPinnedAnnouncement(newMsg);
      toast.success("Announcement pinned!");
    } else {
      toast("Message sent!");
    }
    
    setInput("");
  };

  const handlePinMessage = (msg: MockMessage) => {
    setPinnedAnnouncement(msg);
    toast.success("Message pinned as announcement!");
  };

  return (
    <div className="flex h-[600px] flex-col rounded-2xl border border-border/50 bg-card overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              💬 Event Chat
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">Chat with other attendees and the organizer</p>
          </div>
          <div className="flex -space-x-2">
             {mockUsers.slice(0, 4).map((u, i) => (
               <Avatar key={i} className="h-7 w-7 border-2 border-card shrink-0">
                 <AvatarImage src={u.avatar} />
                 <AvatarFallback className="bg-primary/10 text-primary text-[8px] font-bold">{u.initials}</AvatarFallback>
               </Avatar>
             ))}
             <div className="h-7 w-7 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-[8px] font-bold text-muted-foreground">
               +12
             </div>
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
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-0.5">Pinned Announcement</p>
                <p className="text-xs text-foreground truncate">{pinnedAnnouncement.text}</p>
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
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMine = (isOrganizer && msg.senderId === "organizer") || (!isOrganizer && msg.senderId === currentUserId);
              const isAnnouncement = msg.senderId === "organizer";
              const sender = msg.senderId === "organizer" 
                ? { id: "organizer", name: organizerName, initials: "OR", avatar: undefined } 
                : mockUsers.find((u) => u.id === msg.senderId);
              
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} group`}>
                  <div className={`flex gap-3 max-w-[85%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMine && (
                       <button 
                        onClick={() => {
                          if (sender?.id && sender.id !== "organizer") {
                            onSelectUser?.(sender.id);
                          }
                        }}
                        className={`h-9 w-9 mt-1 shrink-0 transition-transform hover:scale-110 active:scale-95 ${isAnnouncement ? "cursor-default" : ""}`}
                       >
                         <Avatar className={`h-full w-full border shadow-sm ${isAnnouncement ? "border-amber-500/40 bg-amber-500/10" : "border-border/50"}`}>
                           <AvatarImage src={sender?.avatar} />
                           <AvatarFallback className={`${isAnnouncement ? "text-amber-600" : "bg-primary/10 text-primary"} text-[11px] font-bold`}>
                             {sender?.initials}
                           </AvatarFallback>
                         </Avatar>
                       </button>
                    )}
                    <div className="relative">
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm shadow-sm transition-all ${
                          isAnnouncement
                            ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                            : isMine
                              ? "gradient-primary text-primary-foreground rounded-br-none"
                              : "bg-card text-foreground border border-border/50 rounded-bl-none"
                        }`}
                      >
                        {!isMine && (
                          <span className={`text-[10px] font-bold mb-1.5 block tracking-wide ${isAnnouncement ? "text-amber-600" : "text-primary"}`}>
                            {sender?.name} {isAnnouncement && <span className="ml-1 opacity-70">• Organizer</span>}
                          </span>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <div className="mt-1.5 flex items-center justify-end gap-1.5">
                          {pinnedAnnouncement?.id === msg.id && (
                             <Megaphone className="h-2.5 w-2.5 text-amber-500" />
                          )}
                          <p className={`text-[10px] opacity-50 font-medium`}>
                            {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>

                      {/* Pin button for organizers */}
                      {isOrganizer && pinnedAnnouncement?.id !== msg.id && (
                        <button
                          onClick={() => handlePinMessage(msg)}
                          className={`absolute top-0 ${isMine ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-amber-500`}
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
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="p-4 border-t border-border/50 bg-card">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex flex-col gap-2">
            <div className="flex gap-2">
               <Input
                 ref={inputRef}
                 placeholder="Message the group..."
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 className="flex-1 bg-secondary border-border/50 h-11"
               />
              <Button type="submit" size="icon" className="h-11 w-11 gradient-primary text-primary-foreground shrink-0 shadow-glow">
                <Send className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  );
};
