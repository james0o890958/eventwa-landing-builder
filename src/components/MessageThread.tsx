import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Flag, MoreHorizontal, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api, getFullAvatarUrl } from "@/lib/api";
import ReportDialog from "@/components/ReportDialog";
import PublicProfileModal from "@/components/PublicProfileModal";

import echo from "@/lib/echo";

interface Message {
  id: number;
  content: string;
  sender_id: string;
  recipient_id: string;
  is_edited?: boolean;
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
  const authUser = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("access_token") || "";
  const myId = String(authUser?.id ?? "");
  
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [user, setUser] = useState<User | undefined>(initialUser);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  
  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear messages visually when switched to a new conversation
  useEffect(() => {
    setMessages([]);
    setUser(undefined);
  }, [userId]);

  useEffect(() => {
    if (!token || !userId) return;
    const fetchConversation = async () => {
      try {
        const response = await api.get(`messages/${userId}`, undefined, token);
        if (response?.conversation) {
          setMessages(response.conversation.messages || []);
          setUser(response.conversation.user);
          // Dispatch window event so sidebar unread count clears instantly
          window.dispatchEvent(new CustomEvent("messages-read", { detail: { userId } }));
        }
      } catch (err) {
        console.error("Failed to fetch conversation", err);
      }
    };
    fetchConversation();
  }, [userId, token]);

  useEffect(() => {
    const viewport = bottomRef.current?.closest('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [userId]);

  // ── Real-time: listen for incoming DMs, edits & deletions via Echo ──────
  useEffect(() => {
    if (!echo || !myId || !import.meta.env.VITE_PUSHER_APP_KEY) return;

    // Dynamically set or update the token in Echo auth headers before connecting/subscribing
    if (token && echo.connector?.options?.auth?.headers) {
      echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
    }

    const channel = echo
      .private(`messages.${myId}`)
      .listen(".PrivateMessageSent", (e: { message: Message }) => {
        if (String(e.message.sender_id) === String(userId)) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === e.message.id)) return prev;
            return [...prev, e.message];
          });
        }
      })
      .listen(".PrivateMessageUpdated", (e: { message: Message }) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === e.message.id ? { ...m, content: e.message.content, is_edited: true } : m))
        );
      })
      .listen(".PrivateMessageDeleted", (e: { message_id: number }) => {
        setMessages((prev) => prev.filter((m) => m.id !== e.message_id));
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

  const handleStartEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditInput(msg.content);
  };

  const handleSaveEdit = async (msgId: number) => {
    if (!editInput.trim() || !token) return;
    setIsSavingEdit(true);
    try {
      const response = await api.put(`messages/${msgId}`, { content: editInput.trim() }, token);
      if (response?.data) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, content: response.data.content, is_edited: true } : m))
        );
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to edit message", err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteMessage = async (msgId: number) => {
    if (!token) return;
    try {
      await api.delete(`messages/${msgId}`, token);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch (err) {
      console.error("Failed to delete message", err);
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
        <Avatar className="h-9 w-9 cursor-pointer hover:opacity-85 transition-opacity" onClick={() => setViewingProfileId(userId)}>
          <AvatarImage src={getFullAvatarUrl(user?.avatar)} />
          <AvatarFallback className="bg-primary/20 text-primary text-sm font-semibold">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setViewingProfileId(userId)}>
          <p className="text-sm font-semibold text-foreground hover:text-primary transition-colors">{user?.name || "User"}</p>
          <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ReportDialog targetType="user" targetId={userId} targetName={user?.name || "this user"}>
              <DropdownMenuItem
                className="gap-2 text-destructive focus:text-destructive"
                onSelect={(event) => event.preventDefault()}
              >
                <Flag className="h-4 w-4" />
                Report account
              </DropdownMenuItem>
            </ReportDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((msg) => {
            const isMine = String(msg.sender_id) === myId || String(msg.sender_id) === String(localStorage.getItem("user_id"));
            const isEditingThis = editingId === msg.id;

            return (
              <div key={msg.id} className={`group flex items-start gap-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                <div
                  className={`relative max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {isEditingThis ? (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <Input
                        value={editInput}
                        onChange={(e) => setEditInput(e.target.value)}
                        className="text-sm bg-background/20 text-foreground border-border/40 focus-visible:ring-1"
                        autoFocus
                      />
                      <div className="flex justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-xs"
                          onClick={() => setEditingId(null)}
                          disabled={isSavingEdit}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-7 w-7 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                          onClick={() => handleSaveEdit(msg.id)}
                          disabled={isSavingEdit || !editInput.trim()}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <div className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                        {msg.is_edited && <span className="italic opacity-80">(edited)</span>}
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Message Dropdown Actions (Edit / Delete) for sender */}
                {isMine && !isEditingThis && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                      >
                        <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem onClick={() => handleStartEdit(msg)} className="gap-2 cursor-pointer text-xs">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
      <PublicProfileModal
        isOpen={!!viewingProfileId}
        userId={viewingProfileId}
        onClose={() => setViewingProfileId(null)}
        onSendMessage={() => setViewingProfileId(null)}
      />
    </div>
  );
};

export default MessageThread;
