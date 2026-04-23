import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  Share2,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  ArrowLeft,
  Home,
} from "lucide-react";
import { organizerSlug } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockEvents } from "@/data/mockEvents";
import { toast } from "sonner";

// Simple CSS-based QR code placeholder
const QRCode = ({ value }: { value: string }) => {
  // Generate a deterministic grid pattern from the value string
  const hash = value.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const grid: boolean[][] = Array.from({ length: 11 }, (_, row) =>
    Array.from({ length: 11 }, (_, col) => {
      const n = (hash * (row + 1) * (col + 1) * 31) % 100;
      // Always fill corners for QR-like look
      if ((row < 3 && col < 3) || (row < 3 && col > 7) || (row > 7 && col < 3))
        return true;
      return n > 45;
    }),
  );

  return (
    <div className="inline-block rounded-xl border border-border/50 bg-white p-3">
      <div
        className="grid gap-px"
        style={{ gridTemplateColumns: `repeat(11, 1fr)`, width: 132 }}
      >
        {grid.flat().map((filled, i) => (
          <div
            key={i}
            className={`h-[11px] w-[11px] ${filled ? "bg-foreground" : "bg-white"}`}
          />
        ))}
      </div>
    </div>
  );
};

const TicketConfirmation = () => {
  const [params] = useSearchParams();

  const eventId = params.get("eventId") ?? "1";
  const ticketType = params.get("ticketType") ?? "General";
  const qty = Number(params.get("qty") ?? 1);

  const event = mockEvents.find((e) => e.id === eventId) ?? mockEvents[0];

  // Generate a mock ticket ID
  const ticketId = `EVT-${eventId.padStart(3, "0")}-${Math.abs(
    (eventId + ticketType).split("").reduce((a, c) => a + c.charCodeAt(0), 0) *
      7331,
  )
    .toString(16)
    .toUpperCase()
    .slice(0, 8)}`;

  const selectedTicketType = event.ticketTypes?.find(
    (t) => t.name === ticketType,
  );
  const totalPrice = selectedTicketType
    ? selectedTicketType.price * qty
    : event.price * qty;

  const handleDownload = () => {
    toast("Downloading ticket PDF… 📄", {
      description: "Your ticket will be ready shortly.",
    });
  };

  const handleShare = async () => {
    const text = `I'm going to ${event.title}! 🎟️ Join me!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text });
        return;
      } catch {
        //
      }
    }
    await navigator.clipboard.writeText(text);
    toast("Copied to clipboard! 📋");
  };

  const handleAddToCalendar = () => {
    const start = new Date(event.date + "T" + event.time.replace(" ", ""))
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${start}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-2xl px-4 pt-24 pb-16">
        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-glow">
            <CheckCircle className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            You're In! 🎉
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your ticket has been confirmed. See you at{" "}
            <span className="font-medium text-foreground">{event.title}</span>!
          </p>
        </motion.div>

        {/* Ticket card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-card"
        >
          {/* Ticket top — event image + info */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="mb-2 inline-block rounded-full gradient-primary px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                {event.category}
              </span>
              <h2 className="font-display text-xl font-bold text-foreground">
                {event.title}
              </h2>
            </div>
          </div>

          {/* Dotted tear line */}
          <div className="relative flex items-center">
            <div className="-ml-4 h-8 w-8 rounded-full bg-background" />
            <div className="flex-1 border-t-2 border-dashed border-border/40" />
            <div className="-mr-4 h-8 w-8 rounded-full bg-background" />
          </div>

          {/* Ticket body */}
          <div className="p-6">
            {/* Event meta */}
            <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Date
                </p>
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Time
                </p>
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  {event.time}
                </p>
              </div>
              <div className="col-span-2">
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Venue
                </p>
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  {event.location}
                </p>
              </div>
              <div>
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Ticket Type
                </p>
                <p className="flex items-center gap-1.5 font-medium text-foreground">
                  <Ticket className="h-4 w-4 text-primary" />
                  {ticketType}
                </p>
              </div>
              <div>
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Quantity
                </p>
                <p className="font-medium text-foreground">{qty} ticket{qty > 1 ? "s" : ""}</p>
              </div>
              <div>
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total Paid
                </p>
                <p className="font-display text-lg font-bold text-foreground">
                  {totalPrice === 0 ? "Free" : `₦${totalPrice.toLocaleString()}`}
                </p>
              </div>
              <div>
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Organizer
                </p>
                <p className="font-medium text-foreground truncate">
                  <Link
                    to={`/organizer/${organizerSlug(event.organizer)}`}
                    className="hover:text-primary hover:underline"
                  >
                    {event.organizer}
                  </Link>
                </p>
              </div>
            </div>

            {/* Ticket ID */}
            <div className="mb-6 rounded-xl bg-secondary/50 px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Ticket ID
              </p>
              <p className="mt-1 font-mono text-lg font-bold tracking-widest text-foreground">
                {ticketId}
              </p>
            </div>

            {/* QR code */}
            <div className="flex flex-col items-center gap-3">
              <QRCode value={ticketId} />
              <p className="text-xs text-muted-foreground">
                Scan this QR code at the entrance
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 grid gap-3 sm:grid-cols-3"
        >
          <Button
            onClick={handleDownload}
            className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleShare}
            className="border-border/50"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Ticket
          </Button>
          <Button
            variant="outline"
            onClick={handleAddToCalendar}
            className="border-border/50"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Add to Calendar
          </Button>
        </motion.div>

        {/* Navigation links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link to="/my-tickets">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <Ticket className="h-4 w-4" />
              View All My Tickets
            </Button>
          </Link>
          <span className="hidden text-muted-foreground/40 sm:block">·</span>
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <span className="hidden text-muted-foreground/40 sm:block">·</span>
          <Link to={`/event/${event.id}`}>
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Event
            </Button>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TicketConfirmation;
