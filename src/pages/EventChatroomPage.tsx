import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { EventChatroomTab } from "@/components/EventChatroomTab";
import { api } from "@/lib/api";
import { toast } from "sonner";

const EventChatroomPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const res = await api.get(`public/events/${id}`);
        setEvent(res?.event ?? res);
      } catch (err) {
        console.error("Failed to load event:", err);
        toast.error("Could not load event details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout title="Loading…" subtitle="" menu={organizerMenu}>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={event ? `Chatroom — ${event.title}` : "Event Chatroom"}
      subtitle="Pin announcements and chat with attendees"
      menu={organizerMenu}
    >
      <Link
        to="/organizer/chatrooms"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All chatrooms
      </Link>
      <EventChatroomTab
        eventId={id ?? ""}
        organizerName={event?.organizer ?? event?.organizer_name ?? "Organizer"}
        isOrganizer
        activeTab="chat"
      />
    </DashboardLayout>
  );
};

export default EventChatroomPage;
