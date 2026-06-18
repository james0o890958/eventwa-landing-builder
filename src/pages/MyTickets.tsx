import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Download,
  Share2,
  Calendar,
  MapPin,
  QrCode,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface TicketEvent {
  id: number | string;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
  image?: string;
  image_url?: string;
  category?: string;
  organizer?: { name?: string };
  locations?: Array<{ name?: string; address?: string }>;
  date?: string;
  time?: string;
  location?: string;
}

type TicketStatus = "pending" | "confirmed" | "cancelled";
type TicketViewStatus = "upcoming" | "attended" | "cancelled";

interface PurchasedTicket {
  ticketId: string;
  eventId: number | string;
  ticketType: string;
  quantity: number;
  totalPaid: number;
  purchaseDate: string;
  status: TicketStatus;
  ticket_code: string;
  event: TicketEvent;
  viewStatus: TicketViewStatus;
}

const initialTickets: PurchasedTicket[] = [];

// ─── Minimal QR code visual ───────────────────────────────────────────────────

const QRCodeDisplay = ({ value }: { value: string }) => {
  // Deterministic pseudo-random pattern from ticketId string
  const seed = value.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 7 * 7 }, (_, i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;
    // Always fill corners (finder patterns)
    const isCorner =
      (row < 2 && col < 2) ||
      (row < 2 && col > 4) ||
      (row > 4 && col < 2);
    return isCorner || ((seed * (i + 1) * 31) % 17 > 8);
  });
  return (
    <div className="inline-grid grid-cols-7 gap-0.5 rounded-lg bg-white p-2">
      {cells.map((filled, i) => (
        <div
          key={i}
          className={`h-4 w-4 rounded-sm ${filled ? "bg-foreground" : "bg-white"}`}
        />
      ))}
    </div>
  );
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PurchasedTicket["status"] }) {
  const map = {
    upcoming: "bg-emerald-500/15 text-emerald-500",
    attended: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/15 text-destructive",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${map[status]}`}
    >
      {status}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const MyTickets = () => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "upcoming" | "attended" | "cancelled"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [tickets, setTickets] = useState<PurchasedTicket[]>(initialTickets);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("access_token") || "";

  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) {
        setIsLoading(false);
        setError("No access token available.");
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await api.get("user/tickets", undefined, token);
        if (response?.tickets) {
          const now = new Date();
          const normalized = response.tickets.map((ticket: any) => {
            const event = ticket.event ?? {};
            const status = ticket.status ?? "confirmed";
            const eventStart = event.start_date ? new Date(event.start_date) : null;
            const eventEnd = event.end_date ? new Date(event.end_date) : eventStart;
            const viewStatus: TicketViewStatus =
              status === "cancelled"
                ? "cancelled"
                : eventEnd && eventEnd < now
                ? "attended"
                : "upcoming";
            const location = event.locations?.[0]?.address || event.locations?.[0]?.name || "";
            const startTime = eventStart
              ? eventStart.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : undefined;
            return {
              ticketId: ticket.ticket_code || String(ticket.id),
              eventId: event.id || ticket.event_id,
              ticketType: event.title || "Ticket",
              quantity: ticket.quantity ?? 1,
              totalPaid: ticket.price ?? event.price ?? 0,
              purchaseDate: ticket.created_at || ticket.createdAt || "",
              status,
              ticket_code: ticket.ticket_code,
              event: {
                id: event.id,
                title: event.title || "Event",
                description: event.description,
                start_date: event.start_date,
                end_date: event.end_date,
                price: event.price,
                image: event.image || event.image_url || "",
                image_url: event.image_url || event.image || "",
                category: event.category,
                organizer: event.organizer,
                locations: event.locations,
                date: eventStart
                  ? eventStart.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : undefined,
                time: startTime,
                location,
              },
              viewStatus,
            } as PurchasedTicket;
          });
          setTickets(normalized);
        }
      } catch (err) {
        console.error("Failed to load tickets", err);
        setError("Unable to load tickets.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

  const enriched = tickets;

  const filtered = enriched.filter((t) => {
    const matchesStatus =
      activeFilter === "all" ||
      (activeFilter === "cancelled"
        ? t.status === "cancelled"
        : t.viewStatus === activeFilter);
    const matchesSearch =
      !searchQuery.trim() ||
      t.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(t.ticketId).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDownload = async (ticket: (typeof enriched)[0]) => {
    if (!token) {
      toast.error("Unable to download ticket without an access token.");
      return;
    }

    try {
      const response = await api.get(
        `user/tickets/${ticket.ticketId}/download`,
        undefined,
        token,
      );

      const payload = response?.ticket ?? ticket;
      const content = [
        `Event: ${payload.event?.title ?? "Unknown event"}`,
        `Ticket ID: ${payload.ticket_code ?? payload.ticketId}`,
        `Quantity: ${payload.quantity}`,
        `Status: ${payload.status}`,
        `Price: ₦${payload.price?.toLocaleString?.() ?? payload.totalPaid}`,
        `Purchase date: ${new Date(payload.created_at ?? payload.purchaseDate).toLocaleString()}`,
        `Location: ${payload.event?.location ?? payload.event?.locations?.[0]?.address ?? "TBD"}`,
        "",
        payload.event?.description ?? "",
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${ticket.ticketId}.txt`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ticket ${ticket.ticketId}`);
    } catch (err) {
      console.error("Ticket download failed", err);
      toast.error("Ticket download failed. Try again.");
    }
  };

  const handleShare = async (ticket: (typeof enriched)[0]) => {
    const text = `I'm going to ${ticket.event!.title}! 🎉`;
    if (navigator.share) {
      try {
        await navigator.share({ title: ticket.event!.title, text });
        return;
      } catch {
        // fall through
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Event details copied to clipboard! 🔗");
    } catch {
      toast.error("Could not share ticket");
    }
  };

  const handleAddToCalendar = (ticket: (typeof enriched)[0]) => {
    const ev = ticket.event!;
    const start = ev.start_date ? new Date(ev.start_date) : null;
    if (!start || Number.isNaN(start.getTime())) {
      toast.error("Unable to add event to calendar without a valid start date.");
      return;
    }
    const end = ev.end_date ? new Date(ev.end_date) : new Date(start.getTime() + 3 * 60 * 60 * 1000); // +3h
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      ev.title,
    )}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(ev.description ?? "")}&location=${encodeURIComponent(
      ev.location ?? ev.locations?.[0]?.address ?? "",
    )}`;
    window.open(url, "_blank");
  };

  const FILTERS = [
    { id: "all" as const, label: "All Tickets", count: enriched.length },
    {
      id: "upcoming" as const,
      label: "Upcoming",
      count: enriched.filter((t) => t.viewStatus === "upcoming").length,
    },
    {
      id: "attended" as const,
      label: "Attended",
      count: enriched.filter((t) => t.viewStatus === "attended").length,
    },
    {
      id: "cancelled" as const,
      label: "Cancelled",
      count: enriched.filter((t) => t.status === "cancelled").length,
    },
  ];

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Ticket className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground">
              My Tickets
            </h1>
          </div>
          <p className="text-muted-foreground">
            All your event tickets in one place
          </p>
        </motion.div>

        {/* Filters + Search */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm sm:flex-row sm:items-center">
          {/* Search */}
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border/50 bg-secondary px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Search by event or ticket ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 h-8"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Status pills */}
          <div className="flex gap-2 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === f.id
                    ? "gradient-primary text-white shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    activeFilter === f.id
                      ? "bg-white/20 text-white"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Ticket className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <p className="font-display text-xl font-semibold text-foreground">
              No tickets found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search term."
                : "You haven't purchased any tickets yet."}
            </p>
            <Link to="/explore">
              <Button className="mt-6 gradient-primary text-primary-foreground shadow-glow">
                Browse Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ticket, i) => {
              const ev = ticket.event!;
              const isExpanded = expandedTicket === ticket.ticketId;

              return (
                <motion.div
                  key={ticket.ticketId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card"
                >
                  {/* Ticket top row */}
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    {/* Event image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <StatusBadge status={ticket.status} />
                        <span className="text-xs font-mono text-muted-foreground">
                          {ticket.ticketId}
                        </span>
                      </div>
                      <Link to={`/event/${ev.id}`}>
                        <h3 className="font-display text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                          {ev.title}
                        </h3>
                      </Link>
                      <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {new Date(ev.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {ev.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span className="line-clamp-1">{ev.location}</span>
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                          {ticket.ticketType}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {ticket.quantity} ticket{ticket.quantity !== 1 ? "s" : ""}
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {ticket.totalPaid === 0
                            ? "Free"
                            : `₦${ticket.totalPaid.toLocaleString()}`}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare(ticket)}
                        className="border-border/50 text-xs gap-1.5"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(ticket)}
                        className="gradient-primary text-primary-foreground shadow-glow text-xs gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                      <button
                        onClick={() =>
                          setExpandedTicket(
                            isExpanded ? null : ticket.ticketId,
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dashed divider (ticket tear line) */}
                  <div className="mx-5 flex items-center gap-2">
                    <div className="-ml-8 h-6 w-6 rounded-full bg-background" />
                    <div className="flex-1 border-t-2 border-dashed border-border/50" />
                    <div className="-mr-8 h-6 w-6 rounded-full bg-background" />
                  </div>

                  {/* Expanded QR section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
                          {/* QR Code */}
                          <div className="flex flex-col items-center gap-2">
                            <QRCodeDisplay value={ticket.ticketId} />
                            <p className="font-mono text-xs text-muted-foreground">
                              {ticket.ticketId}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <QrCode className="h-3 w-3" />
                              Scan at entry
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 space-y-3">
                            <h4 className="font-display font-semibold text-foreground">
                              Ticket Details
                            </h4>
                            {[
                              { label: "Event", value: ev.title },
                              { label: "Ticket Type", value: ticket.ticketType },
                              {
                                label: "Quantity",
                                value: `${ticket.quantity} ticket${ticket.quantity !== 1 ? "s" : ""}`,
                              },
                              {
                                label: "Amount Paid",
                                value:
                                  ticket.totalPaid === 0
                                    ? "Free"
                                    : `₦${ticket.totalPaid.toLocaleString()}`,
                              },
                              {
                                label: "Purchase Date",
                                value: new Date(
                                  ticket.purchaseDate,
                                ).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }),
                              },
                              { label: "Venue", value: ev.location },
                            ].map((row) => (
                              <div
                                key={row.label}
                                className="flex items-start justify-between gap-4 border-b border-border/30 pb-2 last:border-0"
                              >
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {row.label}
                                </span>
                                <span className="text-xs font-medium text-foreground text-right">
                                  {row.value}
                                </span>
                              </div>
                            ))}

                            {ticket.status === "upcoming" && (
                              <button
                                onClick={() => handleAddToCalendar(ticket)}
                                className="mt-2 flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                              >
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                Add to Google Calendar
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
