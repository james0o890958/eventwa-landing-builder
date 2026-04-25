import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Clock,
  User,
  Bookmark,
  BookmarkCheck,
  Shield,
  Star,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  UserPlus,
  UserCheck,
  MessageCircle,
  X,
  ExternalLink,
  Wifi,
  WifiOff,
  Tag,
  PlusCircle,
  Building2,
  CheckCircle,
  Send,
  Handshake,
  MessageSquare,
} from "lucide-react";
import OrganizerLink from "@/components/OrganizerLink";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AttendeeList from "@/components/AttendeeList";
import { EventChatroomTab } from "@/components/EventChatroomTab";
import { EventBlogSection } from "@/components/EventBlogSection";
import { mockEvents } from "@/data/mockEvents";
import { mockUsers, currentUserId, mockConversations } from "@/data/mockUsers";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// ─── helpers ────────────────────────────────────────────────────────────────

function getSavedIds(): string[] {
  try {
    const s = localStorage.getItem("savedEvents");
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

// ─── sponsorship data ───────────────────────────────────────────────────────

const SPONSORSHIP_TYPES = [
  {
    id: "title",
    label: "Title Sponsorship",
    desc: "Primary event branding and logo placement",
  },
  {
    id: "gold",
    label: "Gold Sponsor",
    desc: "Premium visibility with dedicated mentions",
  },
  {
    id: "silver",
    label: "Silver Sponsor",
    desc: "Standard visibility and brand placement",
  },
  {
    id: "booth",
    label: "Exhibition Booth",
    desc: "Physical booth space at the event",
  },
  {
    id: "other",
    label: "Other",
    desc: "Custom partnership opportunity",
  },
];

// ─── mock data ───────────────────────────────────────────────────────────────

const MOCK_REVIEWS = [
  {
    id: "r1",
    name: "Adaeze Obi",
    initials: "AO",
    rating: 5,
    date: "March 2025",
    comment:
      "Absolutely phenomenal! The energy was electric from start to finish. One of the best events I've ever attended in Lagos. Will definitely be back next year!",
  },
  {
    id: "r2",
    name: "Chidi Nwosu",
    initials: "CN",
    rating: 4,
    date: "March 2025",
    comment:
      "Great organisation and world-class production. The only thing that could be improved is the queue management at entry. Once inside, it was flawless.",
  },
  {
    id: "r3",
    name: "Fatima Bello",
    initials: "FB",
    rating: 5,
    date: "February 2025",
    comment:
      "Came all the way from Abuja and it was 100% worth it. The atmosphere, the crowd, the performances — everything was top tier. No dulling!",
  },
];

// ─── Star renderer ────────────────────────────────────────────────────────────

function Stars({
  rating,
  max = 5,
  size = "sm",
  interactive = false,
  onRate,
}: {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const sz = size === "md" ? "h-6 w-6" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = interactive ? (hovered || rating) > i : rating > i;
        return (
          <Star
            key={i}
            className={`${sz} transition-colors ${filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer" : ""}`}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate?.(i + 1)}
          />
        );
      })}
    </div>
  );
}

// ─── Social share helpers ─────────────────────────────────────────────────────

function buildShareLinks(title: string, url: string) {
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title + " — Check this out!");
  return {
    whatsapp: `https://wa.me/?text=${text}%20${encoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
  };
}

// ── Calendar helper ───────────────────────────────────────────────────────────

function buildCalendarLink(event: {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}) {
  const startDate = new Date(event.date + "T" + event.time);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const format = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, "").slice(0, 15);

  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//EventSpark//EN
BEGIN:VEVENT
UID:${event.id || Date.now()}@eventspark
DTSTAMP:${format(new Date())}
DTSTART:${format(startDate)}
DTEND:${format(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR
`.trim();

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  return URL.createObjectURL(blob);
}

// ─── Main component ───────────────────────────────────────────────────────────

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const event = mockEvents.find((e) => e.id === id);

  // ── Auth & Attendance checks ────────────────────────────────────────────────
  const currentUser = user ? mockUsers.find((u) => u.id === user.id) : null;
  const isOrganizer = user?.user_metadata?.full_name === event?.organizer || user?.email === "organizer@example.com";
  const hasAttended = currentUser?.joinedEvents.includes(id ?? "") ?? false;
  const hasPurchasedTicket = currentUser?.purchasedTickets.includes(id ?? "") ?? false;
  const canLeaveReview = !!user && hasAttended;
  const canViewAttendees = !!user && (hasPurchasedTicket || isOrganizer);

  // ── mobile detection ───────────────────────────────────────────────────────────
  const isMobile = useIsMobile();

  // ── save/bookmark ───────────────────────────────────────────────────────────
  const [saved, setSaved] = useState(() => getSavedIds().includes(id ?? ""));

  const toggleSave = () => {
    const ids = getSavedIds();
    const next = saved ? ids.filter((x) => x !== id) : [...ids, id!];
    localStorage.setItem("savedEvents", JSON.stringify(next));
    setSaved(!saved);
    toast(saved ? "Removed from saved events" : "Event saved! 🔖");
  };

  // ── follow organizer ─────────────────────────────────────────────────────────
  const [following, setFollowing] = useState(false);
  const toggleFollow = () => {
    setFollowing((v) => !v);
    toast(following ? "Unfollowed organizer" : "Following organizer! 🎉");
  };

  // ── active tab ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("details");

   // ── share / social share ─────────────────────────────────────────────────────
   const [showShareMenu, setShowShareMenu] = useState(false);
   const shareLinks = event ? buildShareLinks(event.title, window.location.href) : null;

   const handleAddToCalendar = () => {
     if (!event) return;
     const link = buildCalendarLink({
       id: event.id,
       title: event.title,
       date: event.date,
       time: event.time,
       location: event.location,
       description: event.description,
     });
     const a = document.createElement("a");
     a.href = link;
     a.download = `${event.title.replace(/\s+/g, "_")}.ics`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     URL.revokeObjectURL(link);
     toast("Calendar event downloaded! 📅");
   };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied! 🔗");
      setShowShareMenu(false);
    } catch {
      toast.error("Could not copy link");
    }
  };

  // ── online/offline detection ─────────────────────────────────────────────────
  const isOnline = event ? /online|virtual|zoom|meet|teams/i.test(event.location) : false;

  // ── reviews ──────────────────────────────────────────────────────────────────
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const submitReview = () => {
    if (!reviewRating) {
      toast.error("Please select a star rating");
      return;
    }
    toast("Review submitted! ✨");
    setShowReviewForm(false);
    setReviewRating(0);
    setReviewText("");
  };

  // ── ticket selection (for Tickets tab) ───────────────────────────────────────
  const [selectedTicket, setSelectedTicket] = useState(0);
  const [qty, setQty] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [purchaserName, setPurchaserName] = useState(user?.user_metadata?.display_name || user?.user_metadata?.full_name || "");
  const [purchaserEmail, setPurchaserEmail] = useState("");

  // ── sponsorship modal state ────────────────────────────────────────────────
  const [showSponsorshipModal, setShowSponsorshipModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isSponsoring, setIsSponsoring] = useState(false);
  const [isSponsorshipSubmitted, setIsSponsorshipSubmitted] = useState(false);
  const [sponsorshipForm, setSponsorshipForm] = useState({
    fullName: user?.user_metadata?.display_name || user?.user_metadata?.full_name || "",
    email: user?.email ?? "",
    company: "",
    phone: "",
    sponsorshipType: "",
    message: "",
  });

  const handleSponsorshipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorshipForm.fullName || !sponsorshipForm.email || !sponsorshipForm.sponsorshipType || !sponsorshipForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSponsoring(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSponsoring(false);
    setIsSponsorshipSubmitted(true);
    toast.success("Inquiry submitted! We'll be in touch soon.");
  };

  const handleSponsorshipChange = (field: string, value: string) => {
    setSponsorshipForm((prev) => ({ ...prev, [field]: value }));
  };

  const activeTicketType = event?.ticketTypes?.[selectedTicket];
  const subtotal = activeTicketType ? activeTicketType.price * qty : (event?.price ?? 0) * qty;
  const discountPct = appliedPromo?.discount ?? 0;
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const ticketTotal = subtotal - discountAmount + serviceFee;

  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (!code) return;
    if (appliedPromo?.code === code) {
      toast.error("This code is already applied.");
      return;
    }
    const PROMO_CODES: Record<string, number> = {
      EVENTLY10: 10,
      LAGOS20: 20,
      FIRSTTIME: 15,
    };
    const discount = PROMO_CODES[code];
    if (discount) {
      setAppliedPromo({ code, discount });
      toast.success(`Promo code applied — ${discount}% off! 🎉`);
    } else {
      toast.error("Invalid or expired promo code.");
    }
  };

  const handleGetTickets = () => {
    const ticketType = event?.ticketTypes?.[selectedTicket];
    const params = new URLSearchParams({
      eventId: event?.id ?? "",
      ticketType: ticketType?.name ?? "",
      qty: qty.toString(),
    });
    navigate(`/checkout?${params.toString()}`);
  };

  // ── close share menu on outside click ───────────────────────────────────────
  useEffect(() => {
    if (!showShareMenu) return;
    const handler = () => setShowShareMenu(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showShareMenu]);

  // ── not found ────────────────────────────────────────────────────────────────
  if (!event) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="flex flex-1 items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold text-foreground">Event Not Found</h1>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function organizerSlug(organizer: string): import("react").SetStateAction<string> {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <div className="relative h-[50vh] min-h-[350px] w-full overflow-hidden">
        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-32 relative z-10 max-w-6xl mx-auto"
        >
          {/* Back link */}
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to events
          </Link>

          {/* Category + online/offline badge + actions row */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="inline-block rounded-full gradient-primary px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              {event.category}
            </span>

            {/* Online / Offline badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isOnline ? "bg-blue-500/15 text-blue-500" : "bg-emerald-500/15 text-emerald-500"
              }`}
            >
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "Online Event" : "Physical Event"}
            </span>

             <div className="ml-auto flex items-center gap-2">
               {/* Save */}
               <button
                 onClick={toggleSave}
                 className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm transition-all hover:border-primary/40"
               >
                 {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4 text-muted-foreground" />}
                 <span className="text-foreground">{saved ? "Saved" : "Save"}</span>
               </button>

               {/* Add to Calendar */}
               <button
                 onClick={handleAddToCalendar}
                 className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm transition-all hover:border-primary/40"
               >
                 <PlusCircle className="h-4 w-4 text-muted-foreground" />
                 <span className="text-foreground">Add to Calendar</span>
               </button>

               {/* Share with social dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowShareMenu((v) => !v);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/80 px-4 py-1.5 text-sm font-medium backdrop-blur-sm transition-all hover:border-primary/40"
                >
                  <span className="text-foreground">Share</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {showShareMenu && shareLinks && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-border/50 bg-card shadow-card"
                    >
                      {[
                        {
                          label: "WhatsApp",
                          href: shareLinks.whatsapp,
                          color: "text-green-500",
                          bg: "hover:bg-green-500/10",
                          icon: "💬",
                        },
                        {
                          label: "Facebook",
                          href: shareLinks.facebook,
                          color: "text-blue-600",
                          bg: "hover:bg-blue-500/10",
                          icon: "👍",
                        },
                        {
                          label: "X / Twitter",
                          href: shareLinks.twitter,
                          color: "text-foreground",
                          bg: "hover:bg-secondary",
                          icon: "𝕏",
                        },
                        {
                          label: "LinkedIn",
                          href: shareLinks.linkedin,
                          color: "text-blue-500",
                          bg: "hover:bg-blue-500/10",
                          icon: "in",
                        },
                      ].map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setShowShareMenu(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${s.bg}`}
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${s.color}`}
                          >
                            {s.icon}
                          </span>
                          <span className="text-foreground">{s.label}</span>
                          <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                        </a>
                      ))}
                      <button
                        onClick={copyLink}
                        className="flex w-full items-center gap-3 border-t border-border/30 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-secondary text-xs">
                          🔗
                        </span>
                        Copy link
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 font-display text-4xl font-bold text-foreground sm:text-5xl">{event.title}</h1>

          {/* Meta */}
          <div className="mb-8 flex flex-wrap gap-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {event.time}
            </span>
            {/* Clickable location — scrolls to map section */}
            <button
              onClick={() => document.getElementById("map-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 hover:text-primary transition-colors group"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span className="group-hover:underline underline-offset-2">{event.location}</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {event.attendees.toLocaleString()} attending
            </span>
            <OrganizerLink
              organizerName={event.organizer}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <User className="h-4 w-4 text-primary" />
              {event.organizer}
            </OrganizerLink>
          </div>

          {/* Attend CTA button (mobile only) */}
          {isMobile && (
            <div className="mb-6">
              <Button
                size="lg"
                onClick={() => document.getElementById("ticket-sidebar")?.scrollIntoView({ behavior: "smooth" })}
                className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 px-8 py-6 text-base font-semibold"
              >
                Attend Event
              </Button>
            </div>
          )}

          {/* ── Two-column layout with Tabs ────────────────────────────────────── */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="w-full flex rounded-xl bg-muted/50 py-1 px-3 mb-8">
                  <TabsTrigger value="details" className="flex-1 rounded-lg py-2.5 transition-all">Details</TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1 rounded-lg py-2.5 transition-all">Reviews</TabsTrigger>
                  <TabsTrigger value="attendees" disabled={!canViewAttendees} className="flex-1 rounded-lg py-2.5 transition-all">
                    Attendees
                  </TabsTrigger>
                  <TabsTrigger value="blog" className="flex-1 rounded-lg py-2.5 transition-all">Blog</TabsTrigger>
                  <TabsTrigger value="chat" className="flex-1 rounded-lg py-2.5 transition-all">Chat</TabsTrigger>
                </TabsList>

                {/* ── DETAILS TAB ─────────────────────────────────────────── */}
                <TabsContent value="details" className="mt-0 space-y-6">
                  {/* About */}
                  <div className="rounded-2xl border border-border/50 bg-card p-6">
                    <h2 className="mb-4 font-display text-xl font-semibold text-foreground">About this event</h2>
                    <p className="leading-relaxed text-secondary-foreground/80">{event.description}</p>
                  </div>

                  {/* Agenda / Schedule */}
                  {event.agenda && event.agenda.length > 0 && (
                    <div className="rounded-2xl border border-border/50 bg-card p-6">
                      <h2 className="mb-6 font-display text-xl font-semibold text-foreground">Event Schedule</h2>
                      <div className="relative">
                        <div className="absolute left-[5.5rem] top-0 h-full w-px bg-border/50" />
                        <div className="space-y-6">
                          {event.agenda.map((item, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.07 }}
                              className="flex items-start gap-4"
                            >
                              <span className="w-20 shrink-0 pt-0.5 text-right text-xs font-medium text-muted-foreground">
                                {item.time}
                              </span>
                              <div className="relative z-10 mt-1.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-full gradient-primary shadow-glow" />
                              <div className="flex-1 pb-2">
                                <p className="font-medium text-foreground">{item.title}</p>
                                {item.description && (
                                  <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rules & Guidelines */}
                  {event.rules && event.rules.length > 0 && (
                    <div className="rounded-2xl border border-border/50 bg-card p-6">
                      <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                        <Shield className="h-5 w-5 text-primary" />
                        Rules & Guidelines
                      </h2>
                      <ul className="space-y-2">
                        {event.rules.map((rule, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-secondary-foreground/80">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Map Section (anchor for scroll) */}
                  <section id="map-section" className="rounded-2xl border border-border/50 bg-card p-6 scroll-mt-24">
                    <h2 className="mb-4 font-display text-xl font-semibold text-foreground flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Location
                    </h2>
                    <div className="h-64 rounded-xl border border-border/50 bg-secondary/50 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="mx-auto mb-2 h-10 w-10 text-primary" />
                        <p className="text-sm font-medium text-foreground">{isOnline ? "Online Event" : event.location}</p>
                        {isOnline ? (
                          <p className="mt-1 text-xs text-muted-foreground">Join link provided after ticket purchase</p>
                        ) : (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
                          >
                            Open in Google Maps <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Organizer Section */}
                  <div className="rounded-2xl border border-border/50 bg-card p-6">
                    <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Organizer</h2>
                    <OrganizerLink
                      organizerName={event.organizer}
                      className="flex items-center gap-3 mb-4 group cursor-pointer"
                    >
                      <Avatar className="h-11 w-11 shrink-0 transition-transform group-hover:scale-105">
                        <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-bold">
                          {event.organizer.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-foreground truncate text-sm group-hover:text-primary transition-colors">{event.organizer}</p>
                        <p className="text-xs text-muted-foreground">Event Organizer</p>
                      </div>
                    </OrganizerLink>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={toggleFollow}
                        className={`flex-1 text-xs ${
                          following ? "bg-secondary text-foreground hover:bg-secondary/80" : "gradient-primary text-primary-foreground shadow-glow"
                        }`}
                      >
                        {following ? (
                          <>
                            <UserCheck className="mr-1.5 h-3.5 w-3.5" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(organizerSlug(event.organizer))}
                        className="flex-1 border-border/50 text-xs"
                      >
                        <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowSponsorshipModal(true)}
                        className="flex-1 border-border/50 text-xs"
                      >
                        <Handshake className="mr-1.5 h-3.5 w-3.5" />
                        Sponsor
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                {/* ── REVIEWS TAB ───────────────────────────────────────────── */}
                <TabsContent value="reviews" className="mt-0">
                  <div className="rounded-2xl border border-border/50 bg-card p-6">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h2 className="font-display text-xl font-semibold text-foreground">Reviews</h2>
                        <div className="mt-1 flex items-center gap-2">
                          <Stars rating={4} />
                          <span className="text-sm font-semibold text-foreground">4.2</span>
                          <span className="text-sm text-muted-foreground">({MOCK_REVIEWS.length} reviews)</span>
                        </div>
                      </div>
                      {canLeaveReview ? (
                        <Button
                          size="sm"
                          onClick={() => setShowReviewForm((v) => !v)}
                          className="gradient-primary text-primary-foreground shadow-glow"
                        >
                          {showReviewForm ? "Cancel" : "Write a Review"}
                        </Button>
                      ) : (
                        <p className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                          {!user ? "Login & attend to review" : "Attend event to leave a review"}
                        </p>
                      )}
                    </div>

                    {/* Review form – only if logged in and attended */}
                    <AnimatePresence>
                      {canLeaveReview && showReviewForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 overflow-hidden rounded-xl border border-border/50 bg-secondary/50 p-4"
                        >
                          <p className="mb-3 text-sm font-medium text-foreground">Your rating</p>
                          <Stars rating={reviewRating} size="md" interactive onRate={setReviewRating} />
                          <Textarea
                            placeholder="Share your experience at this event…"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="mt-3 resize-none border-border/50 bg-background"
                            rows={3}
                          />
                          <div className="mt-3 flex justify-end">
                            <Button onClick={submitReview} className="gradient-primary text-primary-foreground shadow-glow">
                              Submit Review
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Review list */}
                    <div className="space-y-5">
                      {MOCK_REVIEWS.map((review) => (
                        <div key={review.id} className="flex gap-3 border-b border-border/30 pb-5 last:border-0 last:pb-0">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                              {review.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium text-foreground">{review.name}</p>
                              <Stars rating={review.rating} />
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-secondary-foreground/80">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* ── ATTENDEES TAB ────────────────────────────────────────── */}
                <TabsContent value="attendees" className="mt-0">
                  {canViewAttendees ? (
                    <AttendeeList 
                      eventId={event.id} 
                      onSelectUser={setSelectedUser} 
                    />
                  ) : (
                    <div className="rounded-2xl border border-border/50 bg-card p-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">Attendees List</h3>
                      <p className="text-muted-foreground text-sm">
                        {!user
                          ? "Sign in to view attendees"
                          : "Purchase a ticket to see who's attending"}
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* ── BLOG TAB ─────────────────────────────────────────────── */}
                <TabsContent value="blog" className="mt-0">
                  <EventBlogSection category={event.category} />
                </TabsContent>

                 {/* ── CHAT TAB ─────────────────────────────────────────────── */}
                 <TabsContent value="chat" className="mt-0">
                   <EventChatroomTab 
                     eventId={event.id} 
                     organizerName={event.organizer} 
                     onSelectUser={setSelectedUser}
                     isOrganizer={isOrganizer}
                     activeTab={activeTab}
                   />
                 </TabsContent>
              </Tabs>
            </div>

            {/* ── RIGHT COLUMN (sticky sidebar) ───────────────────────────── */}
            <div>
              <div className="sticky top-20 space-y-4">
                {/* Ticket Purchase Card */}
                <div id="ticket-sidebar" className="rounded-2xl border border-border/50 bg-card p-5 shadow-card">
                  <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Get Tickets</h2>

                  {event.ticketTypes && event.ticketTypes.length > 0 ? (
                    <>
                      {/* Ticket types */}
                      <div className="mb-4 space-y-2">
                        {event.ticketTypes.map((tt, i) => {
                          const remaining = tt.quantity - tt.sold;
                          const soldOut = remaining <= 0;
                          const isSelected = selectedTicket === i;

                          return (
                            <button
                              key={tt.name}
                              disabled={soldOut}
                              onClick={() => {
                                setSelectedTicket(i);
                                setQty(1);
                              }}
                              className={`w-full rounded-lg border p-3 text-left transition-all ${
                                soldOut
                                  ? "cursor-not-allowed border-border/30 opacity-50"
                                  : isSelected
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "border-border/50 hover:border-primary/50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-foreground text-sm">{tt.name}</span>
                                {soldOut ? (
                                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                                    Sold Out
                                  </span>
                                ) : (
                                  <span className="font-bold text-foreground">₦{tt.price.toLocaleString()}</span>
                                )}
                              </div>
                              {!soldOut && (
                                <p className="mt-1 text-xs text-muted-foreground">{remaining.toLocaleString()} remaining</p>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Quantity */}
                      {!(
                        (event.ticketTypes[selectedTicket]?.sold ?? 0) >=
                        (event.ticketTypes[selectedTicket]?.quantity ?? 0)
                      ) && (
                        <div className="mb-4">
                          <p className="mb-2 text-xs font-medium text-foreground">Quantity</p>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setQty((q) => Math.max(1, q - 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 text-foreground hover:bg-secondary transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-lg font-semibold text-foreground w-6 text-center">{qty}</span>
                            <button
                              onClick={() => setQty((q) => Math.min(10, q + 1))}
                              className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 text-foreground hover:bg-secondary transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Promo Code */}
                      <div className="mb-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Promo Code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="h-9 text-sm border-border/50"
                          />
                          <Button size="sm" variant="outline" onClick={applyPromo} className="border-border/50">
                            Apply
                          </Button>
                        </div>
                        {appliedPromo && (
                          <p className="mt-2 text-xs font-medium text-emerald-500">
                            Code "{appliedPromo.code}" applied! (-{appliedPromo.discount}%)
                          </p>
                        )}
                      </div>

                      {/* Summary */}
                      <div className="mb-6 space-y-2 border-t border-border/30 pt-4 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span>₦{subtotal.toLocaleString()}</span>
                        </div>
                        {discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-500">
                            <span>Discount ({appliedPromo?.discount}%)</span>
                            <span>-₦{discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                          <span>Service Fee (5%)</span>
                          <span>₦{serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-border/30 pt-2 font-bold text-foreground">
                          <span>Total</span>
                          <span>₦{ticketTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                        onClick={handleGetTickets}
                      >
                        Get Tickets
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="mb-6 flex items-center justify-between">
                        <span className="font-display text-2xl font-bold text-foreground">
                          {event.price === 0 ? "Free" : `₦${event.price.toLocaleString()}`}
                        </span>
                        <span className="text-xs text-muted-foreground">per person</span>
                      </div>

                      <div className="mb-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Shield className="h-4 w-4 text-primary" />
                          <span>Money-back guarantee</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground">
                          <Tag className="h-4 w-4 text-primary" />
                          <span>No hidden booking fees</span>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                        onClick={handleGetTickets}
                      >
                        {event.price === 0 ? "Register for Free" : "Get Tickets"}
                      </Button>
                    </>
                  )}

                  <p className="mt-4 text-center text-xs text-muted-foreground">Secure checkout powered by EventSpark</p>
                </div>

                {/* Small share section for desktop */}
                {!isMobile && (
                  <div className="rounded-2xl border border-border/50 bg-card p-5">
                    <h3 className="mb-3 text-sm font-semibold text-foreground">Share this event</h3>
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline" className="h-9 w-9 rounded-full border-border/50 hover:text-primary">
                        <span className="text-sm">𝕏</span>
                      </Button>
                      <Button size="icon" variant="outline" className="h-9 w-9 rounded-full border-border/50 hover:text-primary">
                        <span className="text-sm">f</span>
                      </Button>
                      <Button size="icon" variant="outline" className="h-9 w-9 rounded-full border-border/50 hover:text-primary">
                        <span className="text-sm">in</span>
                      </Button>
                      <Button size="icon" variant="outline" className="h-9 w-9 rounded-full border-border/50 hover:text-primary" onClick={copyLink}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="h-20" />
      <Footer />

      {/* Sponsorship Inquiry Modal */}
      <Dialog open={showSponsorshipModal} onOpenChange={setShowSponsorshipModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-bold flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Partner With Us
            </DialogTitle>
            <DialogDescription>
              Interested in sponsoring or partnering for "{event.title}"? Fill out the form below.
            </DialogDescription>
          </DialogHeader>

          {isSponsorshipSubmitted ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <h3 className="mb-4 font-display text-2xl font-bold text-foreground">Inquiry Received!</h3>
              <p className="text-muted-foreground mb-8">
                Thank you for your interest. The organizer will review your request and get back to you soon.
              </p>
              <Button 
                onClick={() => {
                  setShowSponsorshipModal(false);
                  setIsSponsorshipSubmitted(false);
                }}
                className="gradient-primary text-primary-foreground shadow-glow"
              >
                Close Modal
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSponsorshipSubmit} className="space-y-6 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sponsorship-name">Full Name *</Label>
                  <Input
                    id="sponsorship-name"
                    placeholder="John Doe"
                    value={sponsorshipForm.fullName}
                    onChange={(e) => handleSponsorshipChange("fullName", e.target.value)}
                    className="bg-secondary border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsorship-email">Email Address *</Label>
                  <Input
                    id="sponsorship-email"
                    type="email"
                    placeholder="john@company.com"
                    value={sponsorshipForm.email}
                    onChange={(e) => handleSponsorshipChange("email", e.target.value)}
                    className="bg-secondary border-border/50"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sponsorship-company">Company</Label>
                  <Input
                    id="sponsorship-company"
                    placeholder="Your company name"
                    value={sponsorshipForm.company}
                    onChange={(e) => handleSponsorshipChange("company", e.target.value)}
                    className="bg-secondary border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsorship-phone">Phone Number</Label>
                  <Input
                    id="sponsorship-phone"
                    type="tel"
                    placeholder="+234..."
                    value={sponsorshipForm.phone}
                    onChange={(e) => handleSponsorshipChange("phone", e.target.value)}
                    className="bg-secondary border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interested In *</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SPONSORSHIP_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleSponsorshipChange("sponsorshipType", type.id)}
                      className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                        sponsorshipForm.sponsorshipType === type.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border/50 bg-secondary/50 hover:border-primary/30"
                      }`}
                    >
                      <span className="font-medium text-foreground text-sm">{type.label}</span>
                      <span className="text-[10px] text-muted-foreground">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsorship-message">Message *</Label>
                <Textarea
                  id="sponsorship-message"
                  placeholder="Tell us about your goals..."
                  value={sponsorshipForm.message}
                  onChange={(e) => handleSponsorshipChange("message", e.target.value)}
                  className="min-h-[100px] bg-secondary border-border/50"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSponsoring}
                className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-6 text-base font-semibold"
              >
                {isSponsoring ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Submit Sponsorship Inquiry
                  </span>
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Shared Direct Chat Overlay */}
      <Sheet open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <SheetContent className="sm:max-w-[450px] p-0 flex flex-col border-l border-border/50 shadow-2xl [&>button]:hidden">
          <ChatOverlayContent userId={selectedUser} onClose={() => setSelectedUser(null)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

// Internal component for the chat overlay content to handle its own logic
const ChatOverlayContent = ({ userId, onClose }: { userId: string | null, onClose: () => void }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const user = mockUsers.find(u => u.id === userId);

  useEffect(() => {
    if (userId) {
      const conv = mockConversations.find(c => c.userId === userId);
      setMessages(conv?.messages || []);
    }
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = {
      id: `dm${Date.now()}`,
      senderId: currentUserId,
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    toast.success("Message sent!");
  };

  if (!user) return null;

  return (
    <>
      <SheetHeader className="p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <SheetTitle className="text-base font-bold leading-none">{user.name}</SheetTitle>
            <div className="flex items-center gap-1 text-[11px] text-primary font-medium mt-1">
              <MapPin className="h-3 w-3" />
              <span>{user.location}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-muted transition-colors">
          <X className="h-4 w-4" />
        </Button>
      </SheetHeader>

      <ScrollArea className="flex-1 p-4 bg-muted/20">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <MessageSquare className="h-12 w-12 mb-3" />
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs">Start the conversation with {user.name}</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                      isMine
                        ? "gradient-primary text-primary-foreground rounded-br-none"
                        : "bg-card text-foreground border border-border/50 rounded-bl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <p className={`mt-1 text-[10px] ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50 bg-card">
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            placeholder={`Message ${user.name.split(' ')[0]}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-secondary border-border/50 h-11"
          />
          <Button type="submit" size="icon" className="h-11 w-11 gradient-primary text-primary-foreground shrink-0 shadow-glow">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
};

export default EventDetail;
