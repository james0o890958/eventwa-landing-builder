import EventCard from "@/components/EventCard";
import type { Event } from "@/data/mockEvents";

interface EventsSectionProps {
  title: string;
  subtitle?: string;
  events: Event[];
}

const EventsSection = ({ title, subtitle, events }: EventsSectionProps) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 font-display text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="mb-10 text-muted-foreground">{subtitle}</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
