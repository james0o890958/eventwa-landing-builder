import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { EventChatroomTab } from "@/components/EventChatroomTab";
import { mockEvents } from "@/data/mockEvents";

const EventChatroomPage = () => {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id) || mockEvents[0];

  return (
    <DashboardLayout
      title={`Chatroom — ${event.title}`}
      subtitle="Pin announcements and chat with attendees"
      menu={organizerMenu}
    >
      <Link to="/organizer/chatrooms" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All chatrooms
      </Link>
      <EventChatroomTab eventId={event.id} organizerName={event.organizer} isOrganizer activeTab="chat" />
    </DashboardLayout>
  );
};

export default EventChatroomPage;
