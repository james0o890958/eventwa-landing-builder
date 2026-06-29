import { Link } from "react-router-dom";
import { MessagesSquare, ArrowRight } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { mockEvents } from "@/data/mockEvents";

const OrganizerChatrooms = () => {
  const events = mockEvents.slice(0, 6);
  return (
    <DashboardLayout
      title="Event Chatrooms"
      subtitle="Talk to your attendees and post announcements per event"
      menu={organizerMenu}
    >
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
        {events.map((e, i) => (
          <Link
            key={e.id}
            to={`/organizer/event/${e.id}/chatroom`}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 ${
              i < events.length - 1 ? "border-b border-border/30" : ""
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full gradient-primary">
              <MessagesSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{e.title}</p>
              <p className="text-xs text-muted-foreground">{e.attendees} members in chat</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {(i + 2) * 3} new
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerChatrooms;
