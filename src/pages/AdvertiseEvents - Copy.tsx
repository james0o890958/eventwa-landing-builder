import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Star,
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Users,
  Eye,
  Megaphone,
  Mail,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Badge,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockEvents } from "@/data/mockEvents";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PromotionPackage {
  id: string;
  name: string;
  price: string;
  duration: string;
  badge: string | null;
  highlight: boolean;
  icon: React.ElementType;
  iconColor: string;
  description: string;
  features: string[];
  estimatedReach: string;
  cta: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PACKAGES: PromotionPackage[] = [
  {
    id: "boost",
    name: "Event Boost",
    price: "₦5,000",
    duration: "3 days",
    badge: null,
    highlight: false,
    icon: Zap,
    iconColor: "from-amber-400 to-orange-500",
    description: "Give your event a quick visibility boost on the Explore page and category listings.",
    features: [
      "Boosted position in Explore results",
      "Category page priority listing",
      "3-day promotion window",
      "Performance analytics report",
      "Social media snippet card",
    ],
    estimatedReach: "2,000–5,000",
    cta: "Boost Event",
  },
  {
    id: "featured",
    name: "Featured Listing",
    price: "₦15,000",
    duration: "7 days",
    badge: "Most Popular",
    highlight: true,
    icon: Star,
    iconColor: "from-primary to-violet-600",
    description: "Get your event featured on the homepage, category pages, and in our weekly newsletter.",
    features: [
      "Homepage Featured Events section",
      "Category page top position",
      "Weekly newsletter inclusion (50K+ subscribers)",
      "7-day promotion window",
      "Detailed analytics dashboard",
      "Featured badge on event card",
      "Social media reshare by @EventlyNG",
    ],
    estimatedReach: "15,000–30,000",
    cta: "Get Featured",
  },
  {
    id: "sponsored",
    name: "Sponsored Placement",
    price: "₦35,000",
    duration: "14 days",
    badge: "Maximum Reach",
    highlight: false,
    icon: Target,
    iconColor: "from-rose-500 to-pink-600",
    description: "Premium sponsored placement across all Evently surfaces with targeted audience delivery.",
    features: [
      "Hero carousel on homepage",
      "All category pages — top position",
      "Explore page sponsored banner",
      "Push notifications to relevant users",
      "14-day promotion window",
      "Sponsored badge + visual upgrade",
      "Two weekly newsletter features",
      "Dedicated account manager",
      "Full analytics + audience insights",
      "Social media campaign (3 posts)",
    ],
    estimatedReach: "50,000–100,000+",
    cta: "Go Sponsored",
  },
];

const STATS = [
  { icon: Users, label: "Monthly Visitors", value: "580K+", color: "text-blue-500" },
  { icon: Eye, label: "Event Page Views", value: "2.4M+", color: "text-violet-500" },
  { icon: TrendingUp, label: "Tickets Sold Monthly", value: "45K+", color: "text-emerald-500" },
  { icon: Globe, label: "Cities Covered", value: "12+", color: "text-amber-500" },
];

const TESTIMONIALS = [
  {
    name: "Chioma Okafor",
    event: "Afrobeats Night Lagos",
    initials: "CO",
    color: "from-pink-500 to-rose-600",
    quote: "Featured listing sold out my 2,000-capacity event in 4 days. The ROI was incredible!",
    package: "Featured Listing",
  },
  {
    name: "Yusuf Abdullahi",
    event: "TechHub Summit 2025",
    initials: "YA",
    color: "from-blue-500 to-cyan-600",
    quote: "Sponsored placement gave us the visibility we needed. 800+ registrations in one week.",
    package: "Sponsored Placement",
  },
  {
    name: "Adaeze Nwosu",
    event: "Lagos Food Festival",
    initials: "AN",
    color: "from-violet-500 to-purple-600",
    quote: "The Event Boost more than paid for itself. Perfect for last-minute promotion!",
    package: "Event Boost",
  },
];

const FAQS = [
  {
    q: "How soon does my promotion go live?",
    a: "Promotions go live within 2–4 hours of payment confirmation. For Sponsored Placements, our team will contact you to finalise creative assets before launch.",
  },
  {
    q: "Can I promote multiple events at once?",
    a: "Yes! You can run promotions on multiple events simultaneously. Each promotion is independent and you can mix packages — for example, Boost on one event and Featured on another.",
  },
  {
    q: "What if my event doesn't get enough reach?",
    a: "We guarantee minimum impressions for each package. If we fall short of the estimated reach range, we'll extend your promotion window at no additional cost.",
  },
  {
    q: "Can I pause or cancel a promotion?",
    a: "Promotions can be paused once during their window. Refunds are available within 24 hours of purchase if the promotion hasn't launched yet. Once live, promotions are non-refundable but can be extended.",
  },
  {
    q: "Do you offer custom packages for very large events?",
    a: "Absolutely. For major festivals, concerts, or conferences with 10,000+ expected attendees, contact our sales team for a custom promotional strategy and pricing.",
  },
];

// ─── Enquiry Form ─────────────────────────────────────────────────────────────

const EnquiryForm = ({
  selectedPackage,
  onClose,
}: {
  selectedPackage: PromotionPackage;
  onClose: () => void;
}) => {
  const [eventId, setEventId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) {
      toast.error("Please select an event to promote.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    toast.success(`Promotion request submitted! 🚀`, {
      description: `We'll review your ${selectedPackage.name} request and get back to you shortly.`,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 16 }}
        className="w-full max-w-lg rounded-3xl border border-border/50 bg-card p-7 shadow-card"
      >
        {/* Header */}
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${selectedPackage.iconColor} shadow-md`}
            >
              <selectedPackage.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                {selectedPackage.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedPackage.price} · {selectedPackage.duration}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Fill in the details below and we'll get your event promoted!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event selector */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              Event to Promote <span className="text-destructive">*</span>
            </Label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full rounded-xl border border-border/50 bg-secondary px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select an event…</option>
              {mockEvents.slice(0, 10).map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          {/* Special notes */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              Special Instructions{" "}
              <span className="text-xs text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              placeholder="e.g. Focus on music lovers in Lagos, target age 18–35…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={300}
              className="resize-none bg-secondary border-border/50 text-sm"
            />
            <p className="text-xs text-muted-foreground text-right">{notes.length}/300</p>
          </div>

          {/* Price summary */}
          <div className="rounded-xl border border-border/50 bg-secondary/50 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{selectedPackage.name}</p>
              <p className="text-xs text-muted-foreground">
                {selectedPackage.duration} · est. {selectedPackage.estimatedReach} impressions
              </p>
            </div>
            <p className="font-display text-xl font-bold text-foreground">
              {selectedPackage.price}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 gradient-primary text-primary-foreground shadow-glow hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Submitting…
                </span>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Submit & Pay
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const AdvertiseEvents = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<PromotionPackage | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-20 text-center">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-0 right-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              <Megaphone className="h-4 w-4" />
              Promote Your Events
            </span>
            <h1 className="mb-5 font-display text-5xl font-bold text-foreground sm:text-6xl lg:text-7xl">
              Reach More People,
              <br />
              <span className="text-gradient">Sell More Tickets</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Put your event in front of thousands of event-lovers across Nigeria.
              Choose a promotion package that fits your budget and goals.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => {
                  document
                    .getElementById("packages")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="gradient-primary px-8 text-primary-foreground shadow-glow hover:opacity-90 text-base"
              >
                View Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/organizer/create-event">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/50 text-foreground hover:bg-secondary text-base px-8"
                >
                  Create an Event First
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-xl sm:grid-cols-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="text-center"
              >
                <stat.icon className={`mx-auto mb-2 h-6 w-6 ${stat.color}`} />
                <p className="font-display text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Promotion Packages ──────────────────────────────────────────────── */}
      <section id="packages" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Choose Your Package
            </h2>
            <p className="mt-3 text-muted-foreground">
              From quick boosts to full-scale campaigns — we've got you covered
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col overflow-hidden rounded-3xl border p-8 shadow-card transition-all duration-300 ${
                  pkg.highlight
                    ? "border-primary bg-card ring-2 ring-primary/30 scale-105 z-10"
                    : "border-border/50 bg-card hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div
                    className={`absolute right-5 top-5 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                      pkg.highlight
                        ? "gradient-primary text-primary-foreground shadow-glow"
                        : "bg-amber-500/20 text-amber-500"
                    }`}
                  >
                    <Flame className="h-3 w-3" />
                    {pkg.badge}
                  </div>
                )}

                {/* Icon + Header */}
                <div className="mb-6">
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${pkg.iconColor} shadow-md`}
                  >
                    <pkg.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {pkg.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-2">
                    <span className="font-display text-4xl font-bold text-foreground">
                      {pkg.price}
                    </span>
                    <span className="mb-1.5 text-sm text-muted-foreground">
                      / {pkg.duration}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs">
                    <Eye className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="text-muted-foreground">
                      Est. reach:{" "}
                      <span className="font-semibold text-foreground">
                        {pkg.estimatedReach} people
                      </span>
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => setSelectedPackage(pkg)}
                  className={`mb-6 w-full text-sm font-semibold py-5 ${
                    pkg.highlight
                      ? "gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                      : "border border-border/50 bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {pkg.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Feature list */}
                <ul className="flex-1 space-y-2.5">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Need a custom campaign for a large event?{" "}
            <Link to="/help" className="text-primary hover:underline font-medium">
              Contact our sales team →
            </Link>
          </p>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              How Promotion Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Get your event in front of the right audience in three simple steps
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
            {[
              {
                step: "01",
                icon: Target,
                color: "from-violet-500 to-purple-600",
                title: "Choose a Package",
                desc: "Select the promotion package that fits your event size and budget.",
              },
              {
                step: "02",
                icon: Sparkles,
                color: "from-primary to-blue-600",
                title: "Submit Your Event",
                desc: "Select your event and provide any targeting preferences or special notes.",
              },
              {
                step: "03",
                icon: TrendingUp,
                color: "from-emerald-500 to-teal-600",
                title: "Watch It Grow",
                desc: "Your event goes live across Evently's platform. Track performance in real time.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-5">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-glow`}
                  >
                    <step.icon className="h-9 w-9 text-white" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-card text-xs font-bold text-primary shadow">
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Placement Showcase ──────────────────────────────────────────────── */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Where Your Event Appears
            </h2>
            <p className="mt-3 text-muted-foreground">
              Your event gets shown across Evently's highest-traffic surfaces
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Globe,
                color: "from-blue-500 to-cyan-600",
                title: "Homepage Hero",
                desc: "Carousel placement on Evently's homepage — the first thing 580K+ monthly visitors see.",
                plans: ["Sponsored"],
              },
              {
                icon: Star,
                color: "from-amber-400 to-orange-500",
                title: "Featured Events",
                desc: "Dedicated 'Featured' section on the homepage and Explore page.",
                plans: ["Featured", "Sponsored"],
              },
              {
                icon: Target,
                color: "from-violet-500 to-purple-600",
                title: "Category Pages",
                desc: "Top-of-page placement when users browse your event's category.",
                plans: ["Boost", "Featured", "Sponsored"],
              },
              {
                icon: Mail,
                color: "from-green-500 to-emerald-600",
                title: "Weekly Newsletter",
                desc: "Featured in our curated newsletter sent to 50,000+ active subscribers every Friday.",
                plans: ["Featured", "Sponsored"],
              },
              {
                icon: BarChart3,
                color: "from-rose-500 to-pink-600",
                title: "Search Results",
                desc: "Priority ranking in search results for relevant keywords and locations.",
                plans: ["Boost", "Featured", "Sponsored"],
              },
              {
                icon: Megaphone,
                color: "from-teal-500 to-cyan-600",
                title: "Push Notifications",
                desc: "Direct push notifications sent to users who match your event's audience profile.",
                plans: ["Sponsored"],
              },
            ].map((placement, i) => (
              <motion.div
                key={placement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-border/50 bg-card p-5 shadow-card"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${placement.color} shadow-md`}
                >
                  <placement.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-1.5 font-display font-semibold text-foreground">
                  {placement.title}
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  {placement.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {placement.plans.map((plan) => (
                    <span
                      key={plan}
                      className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {plan}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Organizers Love the Results
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real stories from organizers who promoted with Evently
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border/50 bg-card p-6 shadow-card"
              >
                <div className="mb-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-secondary-foreground/80 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-xs font-bold text-white`}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.event}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {t.package}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  openFaq === i
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 bg-card"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className={`font-medium text-sm pr-4 ${openFaq === i ? "text-primary" : "text-foreground"}`}>
                    {faq.q}
                  </span>
                  {openFaq === i ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border/30 px-5 pb-5 pt-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl gradient-primary p-14 text-center shadow-glow"
          >
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <Megaphone className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-4 font-display text-4xl font-bold text-white">
                Ready to Promote?
              </h2>
              <p className="mb-8 text-lg text-white/70">
                Start with as little as ₦5,000 and watch your ticket sales grow.
                Our team is ready to help you succeed.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("packages")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-white px-8 text-primary hover:bg-white/90 text-base font-semibold"
                >
                  Choose a Package
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/help">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 text-base px-8"
                  >
                    Talk to Sales
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Enquiry Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPackage && (
          <EnquiryForm
            selectedPackage={selectedPackage}
            onClose={() => setSelectedPackage(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AdvertiseEvents;
