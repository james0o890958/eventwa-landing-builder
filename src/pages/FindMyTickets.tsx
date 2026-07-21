import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Ticket,
  Mail,
  Hash,
  ArrowLeft,
  CheckCircle,
  Calendar,
  MapPin,
  Download,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataStateWrapper } from "@/components/ui/DataStateWrapper";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockEvents } from "@/data/mockEvents";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface FoundTicket {
  ticketId: string;
  eventId: string;
  ticketType: string;
  quantity: number;
  totalPaid: number;
  purchaseDate: string;
  email: string;
  realEvent?: any;
}

// Mock ticket database
const MOCK_TICKET_DB: FoundTicket[] = [
  {
    ticketId: "EVT-2026-001",
    eventId: "2",
    ticketType: "VIP Floor",
    quantity: 2,
    totalPaid: 120000,
    purchaseDate: "2025-07-01",
    email: "adaeze.obi@gmail.com",
  },
  {
    ticketId: "EVT-2026-002",
    eventId: "1",
    ticketType: "General",
    quantity: 1,
    totalPaid: 5000,
    purchaseDate: "2025-06-15",
    email: "chidi.nwosu@gmail.com",
  },
  {
    ticketId: "EVT-2026-003",
    eventId: "9",
    ticketType: "Free Entry",
    quantity: 3,
    totalPaid: 0,
    purchaseDate: "2025-05-20",
    email: "fatima.bello@yahoo.com",
  },
  {
    ticketId: "EVT-2025-091",
    eventId: "5",
    ticketType: "21K Half Marathon",
    quantity: 1,
    totalPaid: 10000,
    purchaseDate: "2025-01-10",
    email: "emeka.eze@gmail.com",
  },
  {
    ticketId: "EVT-2025-042",
    eventId: "12",
    ticketType: "Regular",
    quantity: 2,
    totalPaid: 100000,
    purchaseDate: "2024-09-30",
    email: "yewande.a@outlook.com",
  },
];

// Simple QR code placeholder
const QRCodeMini = ({ value }: { value: string }) => {
  const seed = value.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 49 }, (_, i) => {
    const row = Math.floor(i / 7);
    const col = i % 7;
    const isCorner =
      (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
    return isCorner || (seed * (i + 1) * 31) % 17 > 8;
  });
  return (
    <div className="inline-grid grid-cols-7 gap-px rounded-lg bg-white p-2">
      {cells.map((filled, i) => (
        <div
          key={i}
          className={`h-3 w-3 rounded-sm ${filled ? "bg-foreground" : "bg-white"}`}
        />
      ))}
    </div>
  );
};

type SearchMethod = "email" | "reference";

const FindMyTickets = () => {
  const [searchMethod, setSearchMethod] = useState<SearchMethod>("email");
  const [emailInput, setEmailInput] = useState("");
  const [referenceInput, setReferenceInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<FoundTicket[]>([]);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const query =
      searchMethod === "email"
        ? emailInput.trim().toLowerCase()
        : referenceInput.trim().toUpperCase();

    if (!query) {
      toast.error(
        searchMethod === "email"
          ? "Please enter your email address."
          : "Please enter a ticket reference number.",
      );
      return;
    }

    if (searchMethod === "email" && !query.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSearching(true);
    setSearched(true); // Show the results section immediately so the skeleton renders

    const token = localStorage.getItem("access_token") || "";

    if (token) {
      // User is authenticated, retrieve live tickets from the backend
      try {
        const response = await api.get("user/tickets", undefined, token);
        if (response?.tickets && Array.isArray(response.tickets)) {
          const allUserTickets: FoundTicket[] = response.tickets.map((t: any) => {
            const ev = t.event ?? {};
            return {
              ticketId: t.ticket_code || String(t.id),
              eventId: String(ev.id || t.event_id),
              ticketType: t.status === "confirmed" ? "Confirmed Ticket" : "Ticket",
              quantity: t.quantity ?? 1,
              totalPaid: t.price ?? 0,
              purchaseDate: t.created_at || "",
              email: query, // Associated with search query
              realEvent: {
                id: ev.id,
                title: ev.title || "Event",
                description: ev.description || "",
                date: ev.start_date || "",
                time: ev.start_date ? new Date(ev.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                location: ev.locations?.[0]?.address || ev.locations?.[0]?.name || "TBD",
                image: ev.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              }
            };
          });

          let found: FoundTicket[];
          if (searchMethod === "email") {
            // Since they are logged in, we return all their tickets (or filter by email if we had user profiles)
            found = allUserTickets;
          } else {
            found = allUserTickets.filter((t) =>
              t.ticketId.toUpperCase().includes(query),
            );
          }

          setResults(found);
          setSearched(true);

          if (found.length > 0) {
            toast.success(`Found ${found.length} ticket${found.length !== 1 ? "s" : ""}! 🎟️`);
          } else {
            toast.error("No tickets found. Check your reference and try again.");
          }
        } else {
          setResults([]);
          setSearched(true);
          toast.error("No tickets found.");
        }
      } catch (err: any) {
        console.error("Failed to query live tickets:", err);
        toast.error("Failed to fetch tickets from server.");
      } finally {
        setSearching(false);
      }
    } else {
      // Guest mode - query real public tickets API endpoint
      try {
        const payload = searchMethod === "email" ? { email: query } : { code: query };
        const response = await api.post("public/tickets/find", payload);

        if (response?.tickets && Array.isArray(response.tickets)) {
          const publicFound: FoundTicket[] = response.tickets.map((t: any) => {
            const ev = t.event ?? {};
            return {
              ticketId: t.ticket_code || String(t.id),
              eventId: String(ev.id || t.event_id),
              ticketType: t.status === "confirmed" ? "Confirmed Ticket" : "Ticket",
              quantity: t.quantity ?? 1,
              totalPaid: t.price ?? 0,
              purchaseDate: t.created_at || "",
              email: query,
              realEvent: {
                id: ev.id,
                title: ev.title || "Event",
                description: ev.description || "",
                date: ev.start_date || "",
                time: ev.start_date ? new Date(ev.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                location: ev.locations?.[0]?.address || ev.locations?.[0]?.name || "TBD",
                image: ev.image_url || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              }
            };
          });

          setResults(publicFound);
          setSearched(true);

          if (publicFound.length > 0) {
            toast.success(`Found ${publicFound.length} ticket${publicFound.length !== 1 ? "s" : ""}! 🎟️`);
          } else {
            toast.error("No tickets found matching your query.");
          }
        } else {
          setResults([]);
          setSearched(true);
          toast.error("No tickets found.");
        }
      } catch (err: any) {
        console.error("Failed to query public tickets:", err);
        toast.error("No tickets found. Check reference code or email.");
        setResults([]);
        setSearched(true);
      } finally {
        setSearching(false);
      }
    }
  };

  const handleDownload = async (ticket: FoundTicket) => {
    const token = localStorage.getItem("access_token") || "";
    if (token && ticket.realEvent) {
      try {
        const response = await api.get(
          `user/tickets/${ticket.ticketId}/download`,
          undefined,
          token,
        );
        const payload = response?.ticket ?? ticket;
        const content = [
          `Event: ${payload.event?.title ?? ticket.realEvent.title}`,
          `Ticket ID: ${payload.ticket_code ?? ticket.ticketId}`,
          `Quantity: ${payload.quantity}`,
          `Status: ${payload.status || "Confirmed"}`,
          `Price: ₦${(payload.price ?? ticket.totalPaid).toLocaleString()}`,
          `Purchase date: ${new Date(payload.created_at ?? ticket.purchaseDate).toLocaleString()}`,
          `Location: ${payload.event?.location ?? ticket.realEvent.location}`,
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
        toast.success(`Downloaded ticket ${ticket.ticketId} 📥`);
      } catch (err) {
        console.error("Ticket download failed", err);
        toast.error("Ticket download failed.");
      }
    } else {
      toast(`Downloading demo ticket ${ticket.ticketId}… 📥`);
    }
  };

  const resetSearch = () => {
    setSearched(false);
    setResults([]);
    setEmailInput("");
    setReferenceInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-2xl px-4 pt-24 pb-16">
        {/* Back */}
        <Link
          to="/help"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
            <Ticket className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Find My Tickets
          </h1>
          <p className="mt-3 text-muted-foreground">
            Retrieve your tickets using your email address or ticket reference
            number
          </p>
        </motion.div>

        {/* Search form */}
        {!searched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border/50 bg-card p-6 shadow-card"
          >
            {/* Method toggle */}
            <div className="mb-6 flex rounded-xl border border-border/50 bg-secondary p-1">
              <button
                onClick={() => setSearchMethod("email")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  searchMethod === "email"
                    ? "gradient-primary text-white shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Mail className="h-4 w-4" />
                Search by Email
              </button>
              <button
                onClick={() => setSearchMethod("reference")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  searchMethod === "reference"
                    ? "gradient-primary text-white shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Hash className="h-4 w-4" />
                Search by Reference
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-5">
              <AnimatePresence mode="wait">
                {searchMethod === "email" ? (
                  <motion.div
                    key="email"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-1.5"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="pl-10 bg-secondary border-border/50"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter the email address you used when purchasing the
                      ticket
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reference"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-1.5"
                  >
                    <Label className="text-sm font-medium text-foreground">
                      Ticket Reference Number
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="e.g. EVT-2026-001"
                        value={referenceInput}
                        onChange={(e) =>
                          setReferenceInput(e.target.value.toUpperCase())
                        }
                        className="pl-10 bg-secondary border-border/50 font-mono uppercase tracking-wider"
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your reference number was included in your confirmation
                      email (format: EVT-XXXX-XXX)
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                disabled={searching}
                className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5 text-base font-semibold disabled:opacity-60"
              >
                {searching ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Searching…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Find My Tickets
                  </span>
                )}
              </Button>
            </form>

            {/* Demo hint */}
            <div className="mt-5 rounded-xl bg-primary/5 border border-primary/10 p-4">
              <p className="text-xs font-semibold text-primary mb-2">
                🔍 Demo: Try these to see results
              </p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Email:</span>{" "}
                  adaeze.obi@gmail.com
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Reference:
                  </span>{" "}
                  EVT-2026-001
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search results */}
        <AnimatePresence>
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Result header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {searching ? "Searching..." : results.length > 0
                      ? `${results.length} Ticket${results.length !== 1 ? "s" : ""} Found`
                      : "No Tickets Found"}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {searchMethod === "email"
                      ? `Results for: ${emailInput}`
                      : `Results for: ${referenceInput}`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetSearch}
                  className="border-border/50 text-xs gap-1.5"
                >
                  <Search className="h-3.5 w-3.5" />
                  New Search
                </Button>
              </div>

              <DataStateWrapper
                isLoading={searching}
                isError={false}
                isEmpty={results.length === 0}
                emptyIcon={<Ticket className="mb-4 h-14 w-14 text-muted-foreground/20" />}
                emptyMessage="No tickets found"
                emptyComponent={
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card py-16 text-center shadow-card">
                    <Ticket className="mb-4 h-14 w-14 text-muted-foreground/20" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      No tickets found
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      We couldn't find any tickets matching your details. Please
                      double-check your{" "}
                      {searchMethod === "email"
                        ? "email address"
                        : "reference number"}{" "}
                      and try again.
                    </p>
                    <div className="mt-6 flex flex-col gap-2 items-center">
                      <Button
                        size="sm"
                        onClick={resetSearch}
                        className="gradient-primary text-primary-foreground shadow-glow"
                      >
                        Try Again
                      </Button>
                      <Link to="/help">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-foreground text-xs"
                        >
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                  </div>
                }
              >
                <div className="space-y-4">
                  {results.map((ticket, i) => {
                    const event = ticket.realEvent || mockEvents.find(
                      (e) => e.id === ticket.eventId,
                    );
                    if (!event) return null;
                    const isExpanded = expandedTicket === ticket.ticketId;

                    return (
                      <motion.div
                        key={ticket.ticketId}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card"
                      >
                        {/* Ticket top */}
                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                          {/* Event image */}
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="mb-1 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                              <span className="text-xs font-semibold text-emerald-500">
                                Confirmed
                              </span>
                              <span className="font-mono text-xs text-muted-foreground">
                                {ticket.ticketId}
                              </span>
                            </div>
                            <Link to={`/event/${event.id}`}>
                              <h3 className="font-display font-bold text-foreground hover:text-primary transition-colors line-clamp-1">
                                {event.title}
                              </h3>
                            </Link>
                            <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5 text-primary" />
                                {new Date(event.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-primary" />
                                <span className="line-clamp-1">
                                  {event.location}
                                </span>
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary">
                                {ticket.ticketType}
                              </span>
                              <span className="text-muted-foreground">
                                ×{ticket.quantity}
                              </span>
                              <span className="font-semibold text-foreground">
                                {ticket.totalPaid === 0
                                  ? "Free"
                                  : `₦${ticket.totalPaid.toLocaleString()}`}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleDownload(ticket)}
                              className="gradient-primary text-primary-foreground shadow-glow text-xs gap-1.5"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setExpandedTicket(
                                  isExpanded ? null : ticket.ticketId,
                                )
                              }
                              className="border-border/50 text-xs gap-1.5"
                            >
                              <QrCode className="h-3.5 w-3.5" />
                              {isExpanded ? "Hide" : "QR Code"}
                            </Button>
                          </div>
                        </div>

                        {/* Tear line */}
                        <div className="mx-5 flex items-center">
                          <div className="-ml-8 h-6 w-6 rounded-full bg-background" />
                          <div className="flex-1 border-t-2 border-dashed border-border/50" />
                          <div className="-mr-8 h-6 w-6 rounded-full bg-background" />
                        </div>

                        {/* QR code expanded */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden"
                            >
                              <div className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-start">
                                {/* QR */}
                                <div className="flex flex-col items-center gap-2 shrink-0">
                                  <QRCodeMini value={ticket.ticketId} />
                                  <p className="font-mono text-xs text-muted-foreground">
                                    {ticket.ticketId}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Scan at event entrance
                                  </p>
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-2.5">
                                  <h4 className="font-display font-semibold text-foreground">
                                    Ticket Details
                                  </h4>
                                  {[
                                    { label: "Event", value: event.title },
                                    {
                                      label: "Ticket Type",
                                      value: ticket.ticketType,
                                    },
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
                                      value: ticket.purchaseDate ? new Date(
                                        ticket.purchaseDate,
                                      ).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      }) : "—",
                                    },
                                    {
                                      label: "Registered Email",
                                      value: ticket.email,
                                    },
                                  ].map((row) => (
                                    <div
                                      key={row.label}
                                      className="flex justify-between border-b border-border/30 pb-2 last:border-0"
                                    >
                                      <span className="text-xs text-muted-foreground">
                                        {row.label}
                                      </span>
                                      <span className="text-xs font-medium text-foreground text-right max-w-[60%] truncate">
                                        {row.value}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </DataStateWrapper>

              {/* Sign in prompt */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center"
                >
                  <p className="text-sm text-foreground font-medium mb-1">
                    Want easier access to your tickets?
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Create an account or sign in to access all your tickets
                    anytime from your dashboard.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Link to="/login">
                      <Button
                        size="sm"
                        className="gradient-primary text-primary-foreground shadow-glow text-xs"
                      >
                        Sign In / Sign Up
                      </Button>
                    </Link>
                    <Link to="/my-tickets">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border/50 text-xs"
                      >
                        My Tickets Page
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          <p>
            Still having trouble?{" "}
            <Link to="/help" className="text-primary hover:underline font-medium">
              Visit our Help Center
            </Link>{" "}
            or{" "}
            <Link
              to="/help/contact-organizer"
              className="text-primary hover:underline font-medium"
            >
              Contact an Organizer
            </Link>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default FindMyTickets;
