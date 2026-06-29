import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Plus, Edit, Users, Copy, Megaphone, MessagesSquare, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { mockEvents } from "@/data/mockEvents";
import { api } from "@/lib/api";
import { toast } from "sonner";

const OrganizerEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get("events", undefined, token);
      if (res && res.status === "success" && Array.isArray(res.events)) {
        const sortedEvents = res.events.sort((a: any, b: any) => {
          const dateA = new Date(a.start_date || a.date || 0).getTime();
          const dateB = new Date(b.start_date || b.date || 0).getTime();
          return dateA - dateB;
        });
        const mapped = sortedEvents.map((e: any) => ({
          id: String(e.id),
          title: e.title,
          description: e.description,
          date: e.start_date ? e.start_date.split("T")[0] : e.date || "",
          time: e.start_date ? new Date(e.start_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : e.time || "",
          location: e.location?.address || e.location?.name || e.location || "Online",
          image: e.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
          price: Number(e.price) || 0,
          attendees: e.attendees || 0,
          category: e.category?.slug || e.category?.name?.toLowerCase() || e.category || "social",
        }));
        setEvents(mapped);
      }
    } catch (error) {
      console.error("Failed to load organizer events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDuplicate = async (id: string, title: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("You must be logged in to perform this action.");
        return;
      }
      
      const res = await api.post("events/duplicate/", { event_id: id }, token);
      
      if (res && res.status === "success") {
        toast.success(`Duplicated "${title}" successfully.`);
        fetchEvents();
      } else {
        toast.error(res?.message || "Failed to duplicate event.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to duplicate the event. Please try again.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the event "${title}"?`);
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("You must be logged in to perform this action.");
        return;
      }
      
      await api.delete(`events/${id}`, token);
      toast.success(`Event "${title}" deleted successfully.`);
      // Optimistically update the UI list
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete the event. Please try again.");
    }
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
        {loading ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl border border-border/50 bg-card p-5 shadow-card animate-pulse flex flex-col gap-4 sm:flex-row">
              <div className="h-24 w-full rounded-xl bg-muted sm:w-32" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-card flex flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">No Events Found</h3>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              It looks like you haven't created any events yet. Share your next experience with the world today!
            </p>
            <Link to="/organizer/create-event">
              <Button className="gradient-primary text-primary-foreground shadow-glow">
                <Plus className="mr-2 h-4 w-4" /> Create First Event
              </Button>
            </Link>
          </div>
        ) : (
          events.map((event, i) => (
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
                        {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{event.location}</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500 shrink-0">
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
                    <Button size="sm" variant="secondary" onClick={() => handleDuplicate(event.id, event.title)}>
                      <Copy className="mr-1.5 h-3.5 w-3.5" />Duplicate
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(event.id, event.title)}>
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />Delete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerEvents;
