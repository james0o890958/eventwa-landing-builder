import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Plus, Edit, Users, Copy, Megaphone, MessagesSquare, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { mockEvents } from "@/data/mockEvents";
import { toast } from "sonner";

const OrganizerEvents = () => {
  const events = mockEvents.slice(0, 6);

  const handleDuplicate = (title: string) => {
    toast.success(`Duplicated "${title}" — edit your new draft.`);
  };
  const handleDelete = (title: string) => {
    toast(`"${title}" moved to trash.`);
  };

  return (
    <DashboardLayout
      title="My Events"
      subtitle="Manage all your created events in one place"
      menu={organizerMenu}
    >
      <div className="mb-6 flex justify-end">
        <Link to="/organizer/create-event">
          <Button className="gradient-primary text-primary-foreground shadow-glow">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-border/50 bg-card p-5 shadow-card"
          >
            <div className="flex flex-col gap-4 sm:flex-row">
              <img src={event.image} alt={event.title} className="h-24 w-full rounded-xl object-cover sm:w-32" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/event/${event.id}`} className="font-display font-semibold text-foreground hover:text-primary">
                      {event.title}
                    </Link>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{event.location}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                    {event.attendees} attendees
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/organizer/edit-event/${event.id}`}>
                    <Button size="sm" variant="secondary"><Edit className="mr-1.5 h-3.5 w-3.5" />Edit</Button>
                  </Link>
                  <Link to={`/organizer/event/${event.id}/attendees`}>
                    <Button size="sm" variant="secondary"><Users className="mr-1.5 h-3.5 w-3.5" />Attendees</Button>
                  </Link>
                  <Link to={`/organizer/event/${event.id}/chatroom`}>
                    <Button size="sm" variant="secondary"><MessagesSquare className="mr-1.5 h-3.5 w-3.5" />Chat</Button>
                  </Link>
                  <Link to={`/organizer/event/${event.id}/promote`}>
                    <Button size="sm" variant="secondary"><Megaphone className="mr-1.5 h-3.5 w-3.5" />Promote</Button>
                  </Link>
                  <Button size="sm" variant="secondary" onClick={() => handleDuplicate(event.title)}>
                    <Copy className="mr-1.5 h-3.5 w-3.5" />Duplicate
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(event.title)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerEvents;
