import { Link } from "react-router-dom";
import { Users, ArrowRight, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Input } from "@/components/ui/input";
import { mockEvents } from "@/data/mockEvents";
import { useState } from "react";

const OrganizerAttendees = () => {
  const [query, setQuery] = useState("");
  const events = mockEvents.slice(0, 6).filter((e) => e.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <DashboardLayout
      title="Event Attendees"
      subtitle="Pick an event to view and manage its attendee list"
      menu={organizerMenu}
    >
      <div className="mb-6 flex items-center gap-2 rounded-2xl border border-border/50 bg-card px-4 py-2 shadow-card">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events..."
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
        {events.map((e, i) => (
          <Link
            key={e.id}
            to={`/organizer/event/${e.id}/attendees`}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 ${
              i < events.length - 1 ? "border-b border-border/30" : ""
            }`}
          >
            <img src={e.image} alt={e.title} className="h-12 w-12 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-foreground">{e.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(e.date).toLocaleDateString()} · {e.location}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {e.attendees}
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerAttendees;
