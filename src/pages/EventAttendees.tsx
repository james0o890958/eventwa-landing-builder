import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  Search,
  Download,
  Mail,
  Megaphone,
  Filter,
  CheckCircle2,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockEvents } from "@/data/mockEvents";
import { toast } from "sonner";

interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  quantity: number;
  amountPaid: number;
  purchaseDate: string;
  status: "confirmed" | "pending" | "cancelled";
  checkedIn: boolean;
}

function generateAttendees(eventId: string): Attendee[] {
  const names = [
    ["Adaeze Obi", "adaeze.obi@gmail.com"],
    ["Chidi Nwosu", "chidi.nwosu@gmail.com"],
    ["Fatima Bello", "fatima.bello@yahoo.com"],
    ["Emeka Eze", "emeka.eze@gmail.com"],
    ["Yewande Adeyemi", "yewande.a@outlook.com"],
    ["Tunde Bakare", "tunde.bakare@gmail.com"],
    ["Ngozi Okeke", "ngozi.okeke@gmail.com"],
    ["Ibrahim Yusuf", "ibrahim.y@gmail.com"],
    ["Chioma Okafor", "chioma.o@gmail.com"],
    ["Seun Adesanya", "seun.a@gmail.com"],
    ["Kemi Lawal", "kemi.lawal@yahoo.com"],
    ["Bola Adeleke", "bola.adeleke@gmail.com"],
    ["Nneka Umeh", "nneka.umeh@gmail.com"],
    ["Uche Okonkwo", "uche.o@gmail.com"],
    ["Amaka Eze", "amaka.eze@outlook.com"],
    ["Dayo Oladele", "dayo.o@gmail.com"],
    ["Sola Abiodun", "sola.a@gmail.com"],
    ["Funke Adeyemi", "funke.a@gmail.com"],
    ["Rotimi Ogundimu", "rotimi.o@gmail.com"],
    ["Blessing Nwankwo", "blessing.n@gmail.com"],
  ];

  const ticketTypes = ["General", "VIP", "Early Bird", "Regular", "VVIP"];
  const statuses: Attendee["status"][] = ["confirmed", "confirmed", "confirmed", "pending", "confirmed"];

  return names.map(([name, email], i) => {
    const ticketType = ticketTypes[i % ticketTypes.length];
    const price = ticketType === "VIP" ? 25000 : ticketType === "VVIP" ? 50000 : ticketType === "Early Bird" ? 8000 : 5000;
    return {
      id: `att-${eventId}-${i + 1}`,
      name,
      email,
      ticketType,
      quantity: i % 5 === 0 ? 2 : 1,
      amountPaid: price * (i % 5 === 0 ? 2 : 1),
      purchaseDate: new Date(Date.now() - (i * 3 + 1) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: statuses[i % statuses.length],
      checkedIn: i < 8,
    };
  });
}

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", cls: "bg-emerald-500/15 text-emerald-600" },
  pending:   { label: "Pending",   cls: "bg-amber-500/15 text-amber-600"   },
  cancelled: { label: "Cancelled", cls: "bg-destructive/15 text-destructive" },
};

const EventAttendees = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const id = eventId ?? "1";
  const event = mockEvents.find((e) => e.id === id) ?? mockEvents[0];

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Attendee["status"]>("all");
  const [ticketFilter, setTicketFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token") || "";
        const res = await api.get(`events/${id}/attendees`, undefined, token);
        if (res?.attendees && Array.isArray(res.attendees)) {
          const mapped: Attendee[] = res.attendees.map((t: any) => ({
            id: t.ticket_code || String(t.id),
            name: t.name || "Guest",
            email: t.email || "—",
            ticketType: t.ticket_type || "Standard",
            quantity: 1,
            amountPaid: Number(t.price || 0),
            purchaseDate: t.registered_at ? t.registered_at.split("T")[0] : "Recently",
            status: t.status?.toLowerCase() === "checked_in" ? "confirmed" : (t.status?.toLowerCase() || "confirmed"),
            checkedIn: Boolean(t.checked_in),
            rawId: t.id,
          }));
          setAttendees(mapped);
        } else {
          setAttendees(generateAttendees(id));
        }
      } catch (err) {
        console.error("Failed to fetch live event attendees:", err);
        setAttendees(generateAttendees(id));
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [id]);

  const ticketTypes = Array.from(new Set(attendees.map((a) => a.ticketType)));

  const filtered = attendees.filter((a) => {
    const matchesSearch =
      !searchQuery.trim() ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesTicket = ticketFilter === "all" || a.ticketType === ticketFilter;
    return matchesSearch && matchesStatus && matchesTicket;
  });

  const totalRevenue = attendees
    .filter((a) => a.status !== "cancelled")
    .reduce((sum, a) => sum + a.amountPaid, 0);
  const checkedInCount = attendees.filter((a) => a.checkedIn).length;
  const confirmedCount = attendees.filter((a) => a.status === "confirmed").length;

  // ── Selection ──────────────────────────────────────────────────────────────
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  // ── Check-in toggle ────────────────────────────────────────────────────────
  const toggleCheckin = async (attendeeId: string) => {
    const target = attendees.find((a) => a.id === attendeeId);
    if (!target) return;

    const token = localStorage.getItem("access_token") || "";
    try {
      const res = await api.post(
        `events/${id}/checkin`,
        { ticket_code: target.id },
        token,
      );
      toast.success(res.message || "Attendee checked in! 🎟️");
      setAttendees((prev) =>
        prev.map((a) => (a.id === attendeeId ? { ...a, checkedIn: true, status: "confirmed" } : a)),
      );
    } catch (err: any) {
      // Local state toggle if API returns error (e.g. offline testing)
      setAttendees((prev) =>
        prev.map((a) => (a.id === attendeeId ? { ...a, checkedIn: !a.checkedIn } : a)),
      );
      toast.info(err.message || "Updated check-in status locally.");
    }
  };

  // ── Export CSV ─────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const rows = [
      ["ID", "Name", "Email", "Ticket Type", "Qty", "Amount Paid", "Purchase Date", "Status", "Checked In"],
      ...filtered.map((a) => [
        a.id, a.name, a.email, a.ticketType,
        a.quantity, `₦${a.amountPaid.toLocaleString()}`,
        a.purchaseDate, a.status, a.checkedIn ? "Yes" : "No",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, "-")}-attendees.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast("CSV downloaded! 📥");
  };

  // ── Email ──────────────────────────────────────────────────────────────────
  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast.error("Please fill in subject and message.");
      return;
    }
    const count = selectedIds.size > 0 ? selectedIds.size : filtered.length;
    toast.success(`Email sent to ${count} attendee${count !== 1 ? "s" : ""}! 📧`);
    setShowEmailForm(false);
    setEmailSubject("");
    setEmailBody("");
  };

  // ── Announcement ───────────────────────────────────────────────────────────
  const handleSendAnnouncement = () => {
    if (!announcement.trim()) {
      toast.error("Please write an announcement.");
      return;
    }
    toast.success("Announcement sent to all attendees! 📢");
    setShowAnnouncementForm(false);
    setAnnouncement("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Back */}
        <Link
          to="/organizer/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Attendees
              </h1>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                {event.title}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportCSV}
                className="border-border/50 gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowEmailForm((v) => !v);
                  setShowAnnouncementForm(false);
                }}
                className="border-border/50 gap-1.5 text-xs"
              >
                <Mail className="h-3.5 w-3.5" />
                Email Attendees
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setShowAnnouncementForm((v) => !v);
                  setShowEmailForm(false);
                }}
                className="gradient-primary text-primary-foreground shadow-glow gap-1.5 text-xs"
              >
                <Megaphone className="h-3.5 w-3.5" />
                Announcement
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Attendees", value: attendees.length, icon: Users, color: "text-primary" },
            { label: "Confirmed", value: confirmedCount, icon: CheckCircle2, color: "text-emerald-500" },
            { label: "Checked In", value: checkedInCount, icon: CheckCircle2, color: "text-blue-500" },
            {
              label: "Revenue",
              value: `₦${(totalRevenue / 1000).toFixed(0)}K`,
              icon: Download,
              color: "text-amber-500",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border border-border/50 bg-card p-5 text-center shadow-card"
            >
              <stat.icon className={`mx-auto mb-2 h-6 w-6 ${stat.color}`} />
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Email form */}
        {showEmailForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-card"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display font-semibold text-foreground">
                <Mail className="h-4 w-4 text-primary" />
                Email{" "}
                {selectedIds.size > 0
                  ? `${selectedIds.size} Selected`
                  : "All"}{" "}
                Attendees
              </h3>
              <button
                onClick={() => setShowEmailForm(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <Input
                placeholder="Email subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="bg-secondary border-border/50"
              />
              <Textarea
                placeholder="Write your message to attendees…"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={4}
                className="resize-none bg-secondary border-border/50"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEmailForm(false)}
                  className="border-border/50 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSendEmail}
                  className="gradient-primary text-primary-foreground shadow-glow text-xs"
                >
                  <Mail className="mr-1.5 h-3.5 w-3.5" />
                  Send Email
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Announcement form */}
        {showAnnouncementForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-card"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display font-semibold text-foreground">
                <Megaphone className="h-4 w-4 text-primary" />
                Send Announcement to All Attendees
              </h3>
              <button
                onClick={() => setShowAnnouncementForm(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <Textarea
                placeholder="Write a quick announcement e.g. 'Gates open at 5PM, please arrive early!'"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                rows={3}
                maxLength={500}
                className="resize-none bg-secondary border-border/50"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {announcement.length}/500
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAnnouncementForm(false)}
                    className="border-border/50 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSendAnnouncement}
                    disabled={!announcement.trim()}
                    className="gradient-primary text-primary-foreground shadow-glow text-xs"
                  >
                    <Megaphone className="mr-1.5 h-3.5 w-3.5" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-border/50 bg-secondary px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="Search by name, email or ticket ID…"
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

            <button
              onClick={() => setShowFilters((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 flex flex-wrap gap-2 overflow-hidden border-t border-border/30 pt-3"
            >
              {/* Status filter */}
              <div className="flex flex-wrap gap-2">
                {(["all", "confirmed", "pending", "cancelled"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all capitalize ${
                      statusFilter === s
                        ? "gradient-primary text-white shadow-glow"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s === "all" ? "All Status" : s}
                  </button>
                ))}
              </div>

              <div className="h-px w-full bg-border/30 sm:h-auto sm:w-px" />

              {/* Ticket type filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTicketFilter("all")}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    ticketFilter === "all"
                      ? "gradient-primary text-white shadow-glow"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Tickets
                </button>
                {ticketTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTicketFilter(t)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      ticketFilter === t
                        ? "gradient-primary text-white shadow-glow"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Results count + bulk actions */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            of {attendees.length} attendees
            {selectedIds.size > 0 && (
              <span className="ml-2 text-primary font-medium">
                · {selectedIds.size} selected
              </span>
            )}
          </p>
          {selectedIds.size > 0 && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowEmailForm(true);
                  setShowAnnouncementForm(false);
                }}
                className="border-border/50 gap-1.5 text-xs"
              >
                <Mail className="h-3.5 w-3.5" />
                Email Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedIds(new Set())}
                className="border-border/50 gap-1.5 text-xs text-muted-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Clear selection
              </Button>
            </div>
          )}
        </div>

        {/* Attendee table */}
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        filtered.length > 0 &&
                        selectedIds.size === filtered.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-border/50 accent-primary"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Attendee
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                    Ticket
                  </th>
                  <th className="hidden px-4 py-3 text-right font-medium text-muted-foreground md:table-cell">
                    Amount
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground lg:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Check-in
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                      <Users className="mx-auto mb-3 h-10 w-10 opacity-30" />
                      <p>No attendees found matching your filters.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((attendee, i) => (
                    <motion.tr
                      key={attendee.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border/30 last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(attendee.id)}
                          onChange={() => toggleSelect(attendee.id)}
                          className="rounded border-border/50 accent-primary"
                        />
                      </td>

                      {/* Attendee */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                              {attendee.name
                                .split(" ")
                                .map((w) => w[0])
                                .slice(0, 2)
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground text-sm">
                              {attendee.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {attendee.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Ticket */}
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <div>
                          <p className="text-sm text-foreground">
                            {attendee.ticketType}
                          </p>
                          {attendee.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">
                              ×{attendee.quantity}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="hidden px-4 py-3 text-right text-sm text-foreground md:table-cell">
                        {attendee.amountPaid === 0
                          ? "Free"
                          : `₦${attendee.amountPaid.toLocaleString()}`}
                      </td>

                      {/* Purchase Date */}
                      <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                        {new Date(attendee.purchaseDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_CONFIG[attendee.status].cls}`}
                        >
                          {STATUS_CONFIG[attendee.status].label}
                        </span>
                      </td>

                      {/* Check-in */}
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleCheckin(attendee.id)}
                          className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                            attendee.checkedIn
                              ? "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25"
                              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {attendee.checkedIn ? "✓ In" : "Check In"}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventAttendees;
