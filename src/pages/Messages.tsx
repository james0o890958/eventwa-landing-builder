import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConversationList from "@/components/ConversationList";
import MessageThread from "@/components/MessageThread";
import { mockConversations, mockUsers, type MockConversation } from "@/data/mockUsers";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeConv, setActiveConv] = useState<MockConversation | null>(null);
  const [showThread, setShowThread] = useState(false);

  // Open conversation from ?user= param
  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId) {
      const conv = mockConversations.find((c) => c.userId === userId);
      if (conv) {
        setActiveConv(conv);
        setShowThread(true);
      } else {
        // Create empty conversation for this user
        const user = mockUsers.find((u) => u.id === userId);
        if (user) {
          const newConv: MockConversation = { id: `conv-new-${userId}`, userId, messages: [] };
          setActiveConv(newConv);
          setShowThread(true);
        }
      }
    }
  }, [searchParams]);

  const handleSelectConversation = (conv: MockConversation) => {
    setActiveConv(conv);
    setShowThread(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex-1 pt-16">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2 gap-1 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-[calc(100vh-4rem-6rem)] overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
            {/* Conversation List */}
            <div
              className={`w-full border-r border-border/50 lg:w-80 lg:block ${
                showThread ? "hidden" : "block"
              }`}
            >
              <ConversationList
                activeConversationId={activeConv?.id ?? null}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* Thread or Empty */}
            <div className={`flex-1 ${showThread ? "block" : "hidden lg:block"}`}>
              {activeConv ? (
                <MessageThread
                  userId={activeConv.userId}
                  messages={activeConv.messages}
                  onBack={() => setShowThread(false)}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 opacity-40" />
                  <p className="text-sm">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;
