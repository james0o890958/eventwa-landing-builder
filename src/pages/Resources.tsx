import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Video,
  Download,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  Users,
  User,
  ArrowLeft,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type ResourceType = "guide" | "tutorial" | "template";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  duration?: string;
  category: string;
  featured?: boolean;
  downloadable?: boolean;
  image?: string;
  rating: number;
  views: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RESOURCES: Resource[] = [
  // Guides
  {
    id: "g1",
    type: "guide",
    title: "How to Create Your First Event",
    description: "Step-by-step guide to setting up your event page, ticketing, and promotion.",
    duration: "15 min read",
    category: "Getting Started",
    featured: true,
    downloadable: true,
    rating: 4.9,
    views: 12400,
  },
  {
    id: "g2",
    type: "guide",
    title: "Marketing Tools for Event Success",
    description: "Built-in marketing tools to reach your target audience and maximize ticket sales.",
    duration: "20 min read",
    category: "Marketing",
    downloadable: true,
    rating: 4.8,
    views: 15600,
  },
  {
    id: "g3",
    type: "guide",
    title: "Attendee Management Best Practices",
    description: "How to manage your attendees, check-ins, and post-event follow-up.",
    duration: "18 min read",
    category: "Operations",
    downloadable: true,
    rating: 4.7,
    views: 8900,
  },

  // Tutorials
  {
    id: "t1",
    type: "tutorial",
    title: "Setting Up Your First Event on Evently",
    description: "Complete walkthrough of the Evently event creation flow.",
    duration: "12 min",
    category: "Getting Started",
    featured: true,
    rating: 4.9,
    views: 22000,
  },
  {
    id: "t2",
    type: "tutorial",
    title: "Customizing Your Event Page",
    description: "How to write event descriptions that sell and choose the right banner image.",
    duration: "8 min",
    category: "Marketing",
    rating: 4.8,
    views: 11200,
  },
  {
    id: "t3",
    type: "tutorial",
    title: "Using the Organizer Analytics Dashboard",
    description: "Deep dive into Evently's analytics tools and data interpretation.",
    duration: "15 min",
    category: "Analytics",
    rating: 4.7,
    views: 6800,
  },

  // Templates
  {
    id: "tmpl1",
    type: "template",
    title: "Event Budget Planning Spreadsheet",
    description: "Comprehensive Excel template for planning your event budget.",
    category: "Finance",
    downloadable: true,
    rating: 4.9,
    views: 8700,
  },
  {
    id: "tmpl2",
    type: "template",
    title: "Sponsorship Proposal Deck",
    description: "Professional PowerPoint template for securing event sponsors.",
    category: "Sponsorship",
    downloadable: true,
    rating: 4.8,
    views: 6200,
  },
];

const FAQS: FAQ[] = [
  // Tickets
  {
    id: "t1",
    category: "tickets",
    question: "How do I find my tickets after purchase?",
    answer:
      "After purchasing, your tickets are automatically saved to your Evently account under 'My Tickets'. You'll also receive a confirmation email with your ticket details and QR code. If you didn't receive the email, check your spam folder or visit /help/find-tickets to retrieve your tickets using your email address.",
  },
  {
    id: "t2",
    category: "tickets",
    question: "Can I transfer my ticket to someone else?",
    answer:
      "Yes! You can transfer tickets to another person from the 'My Tickets' page. Click on the ticket you want to transfer, then select 'Transfer Ticket' and enter the recipient's email address. The transfer is instant and they'll receive a confirmation email. Please note that some organizers may disable transfers for their events.",
  },
  {
    id: "t3",
    category: "tickets",
    question: "What happens if I lose my ticket or QR code?",
    answer:
      "Don't worry — your tickets are always available in your Evently account. Simply log in and navigate to 'My Tickets' to access your QR codes at any time. You can also download a PDF copy. If you purchased as a guest (without an account), visit /help/find-tickets and enter your email address and ticket reference number.",
  },
  {
    id: "t4",
    category: "tickets",
    question: "Can I get a refund for my ticket?",
    answer:
      "Refund policies vary by organizer. If an organizer allows refunds, you'll see a 'Request Refund' option in your ticket details. Generally, refunds are available up to 48 hours before the event. If the event is cancelled by the organizer, you'll automatically receive a full refund within 3–5 business days.",
  },
  {
    id: "t5",
    category: "tickets",
    question: "How do I download my ticket?",
    answer:
      "Go to 'My Tickets', find the event, click 'Download' and a PDF with your ticket details and QR code will be saved to your device. You can also screenshot the QR code directly from the app. We recommend downloading your ticket before the event in case you have internet issues on the day.",
  },
  {
    id: "t6",
    category: "tickets",
    question: "How do I buy tickets?",
    answer:
      "Browse events on Evently, select the event you want to attend, choose your ticket type and quantity, then proceed to checkout. You can pay with card, bank transfer, or mobile money.",
  },
  {
    id: "t7",
    category: "tickets",
    question: "What payment methods are accepted?",
    answer:
      "Evently accepts: Debit/Credit cards (Visa, Mastercard, Verve), Bank transfers, OPay wallet, and mobile money apps like Kuda and PalmPay. All transactions are secured with 256-bit encryption.",
  },
  {
    id: "t8",
    category: "tickets",
    question: "Can I buy tickets for someone else?",
    answer:
      "Yes! You can purchase tickets for friends or family. During checkout, enter their details or the attendee information. They'll receive their ticket via email after purchase.",
  },
  {
    id: "t9",
    category: "tickets",
    question: "When will I receive my ticket after purchase?",
    answer:
      "Your ticket is instantly available in your 'My Tickets' page after purchase. You'll also receive a confirmation email with your QR code within a few minutes.",
  },
  {
    id: "t10",
    category: "tickets",
    question: "How do I set ticket prices?",
    answer:
      "When creating or editing your event, go to 'Tickets' and add ticket tiers (e.g., General, VIP). Set a price for each tier. You can also create early bird discounts.",
  },
  


  // Attendees
  {
    id: "at1",
    category: "attendees",
    question: "How do I register for a free event?",
    answer:
      "For free events, simply click 'Register' or 'Get Ticket' on the event page. You'll need to sign in (or create an account) to complete registration. You'll receive a confirmation email with your ticket.",
  },
  {
    id: "at2",
    category: "attendees",
    question: "How do I view event details like location and schedule?",
    answer:
      "After registering, go to 'My Tickets' and click on the event. You'll see the event description, date, time, venue location, map, and schedule. Event updates are also emailed to you.",
  },
  {
    id: "at3",
    category: "attendees",
    question: "How do I contact the event organizer?",
    answer:
      "From the event page or your ticket details, click 'Contact Organizer' to send a message. You can also find contact information in your confirmation email. Organizers typically respond within 24 hours.",
  },
  {
    id: "at4",
    category: "attendees",
    question: "Can I cancel my registration?",
    answer:
      "Yes, you can cancel your registration from 'My Tickets'. Open the ticket and select 'Cancel Registration'. If the event was paid, check the refund policy — some events may not allow cancellations or may charge a cancellation fee.",
  },
  {
    id: "at5",
    category: "attendees",
    question: "How do I update my name or email on my ticket?",
    answer:
      "If you need to correct your name or email, contact the event organizer directly. They can update your ticket details from their Attendees dashboard. For minor typos, some events allow self-service edits within 2 hours of purchase.",
  },
  {
    id: "at6",
    category: "attendees",
    question: "How do I add the event to my calendar?",
    answer:
      "From your ticket or the event page, click the 'Add to Calendar' button to download an .ics file or open in Google Calendar, Apple Calendar, or Outlook. You'll get event reminders automatically.",
  },

  // Account
  {
    id: "ac1",
    category: "account",
    question: "How do I create an Evently account?",
    answer:
      "Click 'Sign Up' on any page or visit /auth. You can sign up with your email address or use Google sign-in for faster registration. Once registered, you'll receive a verification email — click the link to activate your account. After verification, you can immediately start browsing and buying tickets.",
  },
  {
    id: "ac2",
    category: "account",
    question: "I forgot my password — how do I reset it?",
    answer:
      "On the sign-in page, click 'Forgot Password?' and enter your email address. We'll send you a password reset link valid for 1 hour. If you don't receive the email within a few minutes, check your spam folder. If you're still having trouble, contact our support team via the form below.",
  },
  {
    id: "ac3",
    category: "account",
    question: "How do I update my profile information?",
    answer:
      "Log in and go to your Dashboard, then click 'Settings' (or the Settings icon). From there you can update your display name, email, profile photo, bio, and location. Email changes require verification — we'll send a confirmation link to your new email address.",
  },
  {
    id: "ac4",
    category: "account",
    question: "How do I delete my account?",
    answer:
      "We're sorry to see you go! To delete your account, go to Dashboard > Settings > Account > Delete Account. Please note that this action is permanent and will remove all your tickets, saved events, and purchase history. We recommend downloading your tickets before deleting your account.",
  },
  {
    id: "ac5",
    category: "account",
    question: "How do I manage my notification preferences?",
    answer:
      "Go to /settings/notifications to manage your email and push notification preferences. You can choose to receive event reminders, ticket confirmations, organizer announcements, and event recommendations. You can also unsubscribe from marketing emails at any time.",
  },
  {
    id: "ac6",
    category: "account",
    question: "I can't sign in to my account",
    answer:
      "First, try clearing your browser cache and cookies, then restart your browser. If that doesn't work, use the 'Forgot Password' link on the sign-in page to reset your password. Make sure you're using the correct email address associated with your account.",
  },
  {
    id: "ac7",
    category: "account",
    question: "I didn't receive the verification email",
    answer:
      "Verification emails can take up to 10 minutes to arrive. Check your spam/junk folder. If you still haven't received it, click 'Resend Email' on the verification page or contact support@evently.ng with your account email.",
  },
  {
    id: "ac8",
    category: "account",
    question: "My account is locked",
    answer:
      "Accounts get locked after 5 failed login attempts. Wait 30 minutes and try again, or use the 'Forgot Password' option to reset your password and unlock your account automatically.",
  },
  {
    id: "ac9",
    category: "account",
    question: "My password isn't working",
    answer:
      "Passwords are case-sensitive. Check that Caps Lock is off and try copying/pasting your password from a saved password manager. If you've forgotten it, use the 'Forgot Password' link to set a new one.",
  },

  // Payments
  {
    id: "p1",
    category: "payments",
    question: "What payment methods does Evently accept?",
    answer:
      "Evently accepts multiple payment methods including: OPay wallet and USSD, Debit/Credit cards (Visa, Mastercard, Verve), Bank Transfer, and mobile money apps like Kuda and PalmPay. All payments are secured with 256-bit encryption. We do not store your card details on our servers.",
  },
  {
    id: "p2",
    category: "payments",
    question: "Is my payment information secure?",
    answer:
      "Absolutely. Evently uses industry-standard 256-bit SSL encryption for all transactions. We are PCI-DSS compliant and never store your card details on our servers. All payments are processed through certified payment gateways. Look for the padlock icon in your browser to confirm the connection is secure.",
  },
  {
    id: "p3",
    category: "payments",
    question: "Why was my payment declined?",
    answer:
      "Payment declines can happen for several reasons: insufficient funds, card expired, wrong card details, or your bank blocking online transactions. Try: (1) Check your card details are correct, (2) Ensure you have sufficient funds, (3) Contact your bank to enable online payments, (4) Try a different payment method. If the issue persists, contact our support team.",
  },
  {
    id: "p4",
    category: "payments",
    question: "When will I receive my refund?",
    answer:
      "Refunds are processed within 24–48 hours of approval. The time it takes to appear in your account depends on your bank: Card payments: 3–5 business days, Bank transfers: 1–2 business days, OPay/mobile wallets: instant to 24 hours. You'll receive an email confirmation when your refund is processed.",
  },
  {
    id: "p5",
    category: "payments",
    question: "Are there any hidden fees?",
    answer:
      "Evently charges a transparent 5% service fee per ticket, which is shown clearly in the price breakdown before you confirm your purchase. There are no other hidden charges. Organizers set their own ticket prices and Evently's fee is added on top. Free events have no fees whatsoever.",
  },

  // Organizers
  {
    id: "og1",
    category: "organizers",
    question: "How do I start selling tickets as an organizer?",
    answer:
      "Visit /organizers to learn how to get started. Click 'Create Your First Event', fill in your event details, set up your ticket tiers and pricing, and publish. Your event will be live immediately. We recommend reading our Organizer Guide at /organizer/resources for tips on maximizing ticket sales.",
  },
  {
    id: "og2",
    category: "organizers",
    question: "How and when do organizers get paid?",
    answer:
      "Organizers receive payouts after their event concludes (or for large events, rolling payouts can be arranged). Funds are settled via bank transfer to your registered account within 2–3 business days after the event. Evently deducts the platform fee before settlement. You can view your earnings in the Organizer Dashboard.",
  },
  {
    id: "og3",
    category: "organizers",
    question: "Can I manage attendees and check them in on event day?",
    answer:
      "Yes! The Organizer Dashboard includes an attendee management section where you can view the full attendee list, export it as CSV, and send announcements. For check-in, attendees' QR codes can be scanned using any QR code scanner app. We're working on a dedicated check-in app for organizers.",
  },
  {
    id: "og4",
    category: "organizers",
    question: "What are Evently's fees for organizers?",
    answer:
      "Evently offers three plans: Free (5% per ticket), Pro at ₦5,000/month (3% per ticket), and Premium at ₦15,000/month (1.5% per ticket). All plans include unlimited attendee management and basic analytics. Visit /organizer/pricing for a full feature comparison.",
  },
  {
    id: "og5",
    category: "organizers",
    question: "How do I edit my event after publishing?",
    answer:
      "Go to your Organizer Dashboard, find your event, and click the Edit button. You can update details like description, location, and ticket prices. Note that you cannot change the event date within 48 hours of the event.",
  },
  {
    id: "og6",
    category: "organizers",
    question: "Can I cancel an event?",
    answer:
      "Yes, go to your event settings and select 'Cancel Event'. All ticket holders will automatically receive a full refund. We recommend notifying attendees before cancelling.",
  },
  {
    id: "og7",
    category: "organizers",
    question: "How do I view event analytics?",
    answer:
      "Your Organizer Dashboard shows real-time analytics including ticket sales, revenue, attendee demographics, and sales channels. Export reports as CSV for further analysis.",
  },

  // Creating Events
  {
    id: "og8",
    category: "organizers",
    question: "How do I create my first event?",
    answer:
      "Go to /organizer/create-event and fill in the event details: title, description, date, time, location, and tickets. Add a cover image and publish when ready.",
  },
  {
    id: "og9",
    category: "organizers",
    question: "Can I create a free event?",
    answer:
      "Yes! Set your ticket price to ₦0 for a free event. Attendees will still need to register and get a ticket for entry.",
  },
  {
    id: "og10",
    category: "organizers",
    question: "What image should I use for my event?",
    answer:
      "Use a high-quality image (minimum 1200x630px) that represents your event. Avoid using text heavily on images as it may not display well across devices.",
  },

  // Promoting Events
  {
    id: "og11",
    category: "organizers",
    question: "How do I promote my event on social media?",
    answer:
      "Share your event link on Twitter, Instagram, and Facebook. Use eye-catching images and a clear call-to-action. Evently provides shareable event pages optimized for social media.",
  },
  {
    id: "og12",
    category: "organizers",
    question: "Should I offer early bird discounts?",
    answer:
      "Yes! Early bird pricing creates urgency and rewards early buyers. Offer 10-20% off for the first week or first 50 tickets to boost initial sales.",
  },
  {
    id: "og13",
    category: "organizers",
    question: "How do I track my promotion success?",
    answer:
      "Use unique links or promo codes for different channels. Monitor ticket sales by source in your Dashboard to see what's working.",
  },
  {
    id: "og14",
    category: "organizers",
    question: "When do I receive my earnings?",
    answer:
      "Payouts are processed 2-3 business days after your event ends. Funds are transferred directly to your registered bank account.",
  },
  {
    id: "og14_2",
    category: "organizers",
    question: "What fees does Evently charge?",
    answer:
      "Evently offers three plans: Free (5% per ticket), Pro at ₦5,000/month (3% per ticket), and Premium at ₦15,000/month (1.5% per ticket).",
  },

  // Becoming an Organizer
  {
    id: "og15",
    category: "organizers",
    question: "How do I become an event organizer on Evently?",
    answer:
      "Sign up for an account, verify your email, and complete your organizer profile. Once approved (usually within 24 hours), you can start creating and selling tickets for your events.",
  },
  {
    id: "og16",
    category: "organizers",
    question: "Is there a fee to become an organizer?",
    answer:
      "No! Joining Evently as an organizer is free. We charge a small platform fee per ticket sold (5% on the Free plan), but there are no upfront costs or monthly fees on our starter plan.",
  },
  {
    id: "og17",
    category: "organizers",
    question: "How long does it take to get approved?",
    answer:
      "Most organizer applications are approved within 24 hours. If we need additional verification, it may take up to 48 hours. You'll receive an email once your account is activated.",
  },
  {
    id: "og18",
    category: "organizers",
    question: "What types of events can I organize?",
    answer:
      "You can organize any type of event: concerts, conferences, workshops, meetups, sports events, comedy shows, festivals, private parties, and more.",
  }
];

const TYPE_CONFIG: Record<
  ResourceType,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  guide: {
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/15",
    label: "Guide",
  },
  tutorial: {
    icon: Video,
    color: "text-pink-500",
    bg: "bg-pink-500/15",
    label: "Tutorial",
  },
  template: {
    icon: Download,
    color: "text-emerald-500",
    bg: "bg-emerald-500/15",
    label: "Template",
  },
};

const CATEGORIES = [
  "All",
  "Getting Started",
  "Marketing",
  "Operations",
  "Analytics",
  "Finance",
  "Sponsorship",
];

const TYPE_FILTERS: { id: ResourceType | "all"; label: string }[] = [
  { id: "all", label: "All Resources" },
  { id: "guide", label: "Guides" },
  { id: "tutorial", label: "Tutorials" },
  { id: "template", label: "Templates" },
];

// ─── Resource Card ─────────────────────────────────────────────────────────────

const ResourceCard = ({
  resource,
  index,
}: {
  resource: Resource;
  index: number;
}) => {
  const config = TYPE_CONFIG[resource.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card transition-all hover:border-primary/30 hover:shadow-glow/5"
    >
      {/* Featured badge */}
      {resource.featured && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full gradient-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-glow">
          <Star className="h-3 w-3 fill-current" />
          Featured
        </div>
      )}

      {/* Card header */}
      <div className="flex items-start gap-4 p-5 pb-3">
        {/* Type icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.bg}`}
        >
          <Icon className={`h-5 w-5 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Type + category badges */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.color}`}
            >
              {config.label}
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {resource.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {resource.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="flex-1 px-5 pb-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {resource.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/30 px-5 py-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {resource.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {resource.duration}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {resource.views >= 1000
              ? `${(resource.views / 1000).toFixed(1)}K`
              : resource.views}
          </span>
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-current" />
            {resource.rating}
          </span>
        </div>

        {/* Action button */}
        {resource.downloadable ? (
          <button className="flex items-center gap-1.5 rounded-full gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-90 transition-opacity">
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        ) : (
          <button className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors">
            <Video className="h-3.5 w-3.5 text-primary" />
            Watch
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // Featured resources
  const featured = RESOURCES.filter((r) => r.featured);

  // Filter logic
  const filtered = RESOURCES.filter((r) => {
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    const matchesCategory =
      categoryFilter === "All" || r.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const hasActiveFilters =
    typeFilter !== "all" || categoryFilter !== "All" || !!searchQuery.trim();

  const clearFilters = () => {
    setTypeFilter("all");
    setCategoryFilter("All");
    setSearchQuery("");
  };

  const pill = (active: boolean) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
      active
        ? "gradient-primary text-white shadow-glow"
        : "bg-secondary text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-20 left-1/4 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Link
              to="/help"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Help Center
            </Link>

            <div className="mb-6 flex items-center justify-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                <BookOpen className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="rounded-full gradient-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-glow">
                Help Resources
              </span>
            </div>
            <h1 className="mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
              Guides, tutorials, and templates to help you succeed
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Everything you need to plan, promote, and run better events.
              Find step-by-step guides, video tutorials, and downloadable templates.
            </p>

            {/* Search */}
            <div className="mx-auto mb-12 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search resources and FAQs…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 rounded-2xl border-border/50 bg-card pl-12 text-base shadow-card focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                { value: "9+", label: "Resources" },
                { value: "3", label: "Categories" },
                { value: "Free", label: "All access" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="font-display font-bold text-gradient text-xl">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-24 relative z-10 max-w-4xl mx-auto"
        >
          {/* Article Content */}
          <div className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
              The Complete Guide to Event Planning Success
            </h2>

            <div className="prose prose-lg max-w-none text-secondary-foreground/80">
              <p className="text-lg leading-relaxed mb-6">
                Planning an event can be both exciting and overwhelming. Whether you're organizing your first community meetup or a large-scale conference, having the right resources and knowledge is crucial for success. This comprehensive guide covers everything you need to know about event planning, from initial concept to post-event follow-up.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Understanding Your Event Goals</h3>
              <p className="mb-4">
                Before diving into logistics, it's essential to define what you want to achieve. Are you looking to build community, generate revenue, educate attendees, or celebrate an occasion? Your goals will shape every decision you make throughout the planning process.
              </p>
              <p className="mb-6">
                Take time to write down your objectives, target audience, and desired outcomes. This clarity will help you make better decisions about venue selection, pricing, marketing strategies, and content creation.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Budgeting and Financial Planning</h3>
              <p className="mb-4">
                Financial planning is the backbone of successful event management. Start by estimating all potential costs, including venue rental, equipment, marketing, staff, and contingency funds. Don't forget to factor in Evently's transparent 5% platform fee.
              </p>
              <p className="mb-6">
                Use our downloadable budget templates to track expenses and revenue projections. Remember that most events operate on thin margins, so accurate financial planning can make the difference between profit and loss.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Venue Selection and Logistics</h3>
              <p className="mb-4">
                Choosing the right venue can make or break your event. Consider capacity, location accessibility, amenities, and technical capabilities. For virtual or hybrid events, ensure you have reliable streaming equipment and backup internet connections.
              </p>
              <p className="mb-6">
                Book your venue early, especially for popular dates or locations. Visit the space in person if possible, and discuss all requirements with venue staff beforehand to avoid last-minute surprises.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Marketing and Promotion</h3>
              <p className="mb-4">
                Effective marketing is crucial for attracting attendees. Leverage social media, email campaigns, and partnerships to spread the word. Create compelling event descriptions that highlight unique value propositions and use eye-catching visuals.
              </p>
              <p className="mb-6">
                Start marketing 6-8 weeks in advance for smaller events and 3-6 months for larger ones. Use Evently's built-in marketing tools and consider early bird pricing to create urgency and boost initial ticket sales.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Content and Programming</h3>
              <p className="mb-4">
                Your event's content is what attendees will remember most. Develop a clear agenda with engaging speakers, activities, and networking opportunities. Consider the flow of your event and how different elements will work together.
              </p>
              <p className="mb-6">
                For multi-session events, include breaks and interactive elements to keep energy levels high. Always have backup plans for technical issues or speaker cancellations.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Day-Of Execution</h3>
              <p className="mb-4">
                The day of your event requires careful coordination. Arrive early to set up, greet attendees warmly, and ensure everything runs smoothly. Have a clear communication plan for your team and be prepared to handle unexpected challenges.
              </p>
              <p className="mb-6">
                Use Evently's attendee management tools for check-in and real-time updates. Keep an eye on attendance numbers and be ready to adjust your approach based on actual turnout.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Post-Event Follow-Up</h3>
              <p className="mb-4">
                The work doesn't end when attendees leave. Send thank-you emails, gather feedback through surveys, and analyze what worked well and what could be improved. Share photos and highlights on social media to maintain engagement.
              </p>
              <p className="mb-6">
                Use post-event analytics to inform future planning. Strong follow-up can turn one-time attendees into loyal community members and help build your reputation as a reliable event organizer.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Common Challenges and Solutions</h3>
              <p className="mb-4">
                Every event organizer faces challenges, but most can be anticipated and managed. Low attendance, technical issues, and budget overruns are among the most common problems. Having contingency plans and maintaining flexibility can help you navigate these challenges successfully.
              </p>
              <p className="mb-6">
                Remember that even "failed" events provide valuable learning experiences. Use our troubleshooting guides and community forums to get advice from experienced organizers who've faced similar situations.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-8">
                <h4 className="text-lg font-semibold text-foreground mb-3">Key Takeaways</h4>
                <ul className="space-y-2 text-secondary-foreground/80">
                  <li>• Define clear goals and understand your audience before planning</li>
                  <li>• Create a realistic budget and track expenses carefully</li>
                  <li>• Choose the right venue and plan logistics thoroughly</li>
                  <li>• Market early and consistently using multiple channels</li>
                  <li>• Focus on creating valuable, engaging content</li>
                  <li>• Prepare for challenges and have backup plans</li>
                  <li>• Follow up with attendees to build long-term relationships</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 rounded-2xl border border-border/50 bg-card p-8"
          >
            <h3 className="mb-6 font-display text-xl font-bold text-foreground">
              Related Resources
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/help/create-events"
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Create Your First Event</p>
                  <p className="text-sm text-muted-foreground">Step-by-step guide</p>
                </div>
              </Link>
              <Link
                to="/help/manage-attendees"
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Manage Attendees</p>
                  <p className="text-sm text-muted-foreground">Check-in and communication</p>
                </div>
              </Link>
              <Link
                to="/help/become-organizer"
                className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Become an Organizer</p>
                  <p className="text-sm text-muted-foreground">Get started today</p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* ── FAQ section ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mt-16 max-w-3xl"
          >
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-muted-foreground">
                Quick answers to common questions about Evently
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.filter(faq => 
                searchQuery === "" || 
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((faq, i) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`overflow-hidden rounded-2xl border transition-all ${
                      isOpen
                        ? "border-primary/30 bg-primary/5"
                        : "border-border/50 bg-card hover:border-primary/20"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="flex w-full items-start gap-4 p-5 text-left"
                    >
                      <div className="flex-1">
                        <p
                          className={`font-medium transition-colors ${
                            isOpen ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {faq.question}
                        </p>
                      </div>
                      <div className="shrink-0 mt-0.5">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-primary" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/30 px-5 pb-5 pt-4">
                            <p className="text-sm leading-relaxed text-secondary-foreground/80">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-16" />
      <Footer />
    </div>
  );
};

export default Resources;