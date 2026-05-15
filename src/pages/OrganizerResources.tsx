import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Video,
  Headphones,
  Download,
  ExternalLink,
  Search,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Play,
  ArrowLeft,
  Star,
  Users,
  Filter,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

type ResourceType = "guide" | "tutorial" | "webinar" | "template";

interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  duration?: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  featured?: boolean;
  downloadable?: boolean;
  videoUrl?: string;
  rating: number;
  views: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const RESOURCES: Resource[] = [
  // Guides
  {
    id: "g1",
    type: "guide",
    title: "The Complete Guide to Hosting Your First Event in Nigeria",
    description:
      "Everything you need to know to plan, promote, and execute a successful event from scratch. Covers venue selection, ticketing, marketing, and day-of logistics.",
    duration: "25 min read",
    level: "Beginner",
    category: "Getting Started",
    featured: true,
    downloadable: true,
    rating: 4.9,
    views: 12400,
  },
  {
    id: "g2",
    type: "guide",
    title: "Ticket Pricing Strategies That Maximize Revenue",
    description:
      "Learn how to set the right ticket price for your event using data-driven strategies, tiered pricing models, and early bird discounts that actually work.",
    duration: "15 min read",
    level: "Intermediate",
    category: "Ticketing",
    downloadable: true,
    rating: 4.7,
    views: 8900,
  },
  {
    id: "g3",
    type: "guide",
    title: "How to Market Your Event on Social Media",
    description:
      "A step-by-step playbook for promoting your event on Instagram, Twitter/X, WhatsApp, and TikTok. Includes templates, posting schedules, and paid ad tips.",
    duration: "20 min read",
    level: "Beginner",
    category: "Marketing",
    downloadable: true,
    rating: 4.8,
    views: 15600,
  },
  {
    id: "g4",
    type: "guide",
    title: "Managing Large-Scale Events: A Practical Handbook",
    description:
      "Detailed operational guide for events with 1,000+ attendees. Covers crowd management, security, vendor coordination, volunteer management, and contingency planning.",
    duration: "35 min read",
    level: "Advanced",
    category: "Operations",
    downloadable: true,
    rating: 4.6,
    views: 5200,
  },
  {
    id: "g5",
    type: "guide",
    title: "Securing Sponsorships for Your Event",
    description:
      "How to identify potential sponsors, create a compelling sponsorship deck, negotiate deals, and deliver value to sponsors before, during, and after your event.",
    duration: "18 min read",
    level: "Intermediate",
    category: "Sponsorship",
    downloadable: true,
    rating: 4.7,
    views: 7300,
  },
  {
    id: "g6",
    type: "guide",
    title: "Virtual & Hybrid Event Best Practices",
    description:
      "Everything you need to run a professional online or hybrid event in Nigeria. Platform selection, streaming setup, audience engagement, and technical troubleshooting.",
    duration: "22 min read",
    level: "Intermediate",
    category: "Online Events",
    rating: 4.5,
    views: 4100,
  },

  // Tutorials
  {
    id: "t1",
    type: "tutorial",
    title: "Setting Up Your First Event on Evently — Step by Step",
    description:
      "A complete walkthrough of the Evently event creation flow. Learn how to set up your event page, ticket tiers, promo codes, and publish in under 10 minutes.",
    duration: "12 min",
    level: "Beginner",
    category: "Getting Started",
    featured: true,
    videoUrl: "#",
    rating: 4.9,
    views: 22000,
  },
  {
    id: "t2",
    type: "tutorial",
    title: "Customizing Your Event Page for Maximum Conversions",
    description:
      "How to write event descriptions that sell, choose the right banner image, and structure your page to convert visitors into ticket buyers.",
    duration: "8 min",
    level: "Beginner",
    category: "Marketing",
    videoUrl: "#",
    rating: 4.8,
    views: 11200,
  },
  {
    id: "t3",
    type: "tutorial",
    title: "Using the Organizer Analytics Dashboard",
    description:
      "Deep dive into Evently's analytics tools. How to read your ticket sales data, track conversion rates, understand your audience demographics, and spot trends.",
    duration: "15 min",
    level: "Intermediate",
    category: "Analytics",
    videoUrl: "#",
    rating: 4.7,
    views: 6800,
  },
  {
    id: "t4",
    type: "tutorial",
    title: "Managing Attendees & Check-In on Event Day",
    description:
      "How to use the attendee list, export data, send announcements, and run smooth QR code check-ins on the day of your event.",
    duration: "10 min",
    level: "Beginner",
    category: "Operations",
    videoUrl: "#",
    rating: 4.8,
    views: 9400,
  },
  {
    id: "t5",
    type: "tutorial",
    title: "Setting Up Multiple Ticket Tiers & Early Bird Pricing",
    description:
      "Learn how to create General, VIP, and Early Bird ticket tiers with different prices, quantities, and availability windows to maximize revenue.",
    duration: "7 min",
    level: "Beginner",
    category: "Ticketing",
    videoUrl: "#",
    rating: 4.9,
    views: 14700,
  },

  // Webinars
  {
    id: "w1",
    type: "webinar",
    title: "Grow Your Event Business in 2026: Expert Panel",
    description:
      "Industry experts share insights on event trends in Nigeria, emerging opportunities, and strategies for scaling your event business over the next 12 months.",
    duration: "90 min",
    level: "Intermediate",
    category: "Business Growth",
    featured: true,
    videoUrl: "#",
    rating: 4.8,
    views: 3400,
  },
  {
    id: "w2",
    type: "webinar",
    title: "Mastering Event Marketing in the Digital Age",
    description:
      "Live Q&A with a leading Nigerian event marketing strategist. Topics include influencer partnerships, email marketing, and running profitable Facebook/Instagram ads.",
    duration: "75 min",
    level: "Intermediate",
    category: "Marketing",
    videoUrl: "#",
    rating: 4.7,
    views: 2900,
  },
  {
    id: "w3",
    type: "webinar",
    title: "How to Run Profitable Festival Events in Nigeria",
    description:
      "A case study walkthrough with organizers of Lagos Carnival and Calabar Festival. Learn the operational, financial, and marketing secrets behind Nigeria's biggest festivals.",
    duration: "60 min",
    level: "Advanced",
    category: "Festivals",
    videoUrl: "#",
    rating: 4.9,
    views: 5100,
  },
  {
    id: "w4",
    type: "webinar",
    title: "Tech Events & Conferences: From Idea to Sellout",
    description:
      "Everything you need to know about running tech conferences in Nigeria — speakers, sponsorships, content curation, and building a loyal attendee community.",
    duration: "65 min",
    level: "Intermediate",
    category: "Conferences",
    videoUrl: "#",
    rating: 4.6,
    views: 2200,
  },

  // Templates
  {
    id: "tmpl1",
    type: "template",
    title: "Event Budget Planning Spreadsheet",
    description:
      "A comprehensive Excel/Google Sheets template for planning your event budget. Covers venue, catering, marketing, staffing, logistics, and contingency costs.",
    level: "Beginner",
    category: "Finance",
    downloadable: true,
    rating: 4.9,
    views: 8700,
  },
  {
    id: "tmpl2",
    type: "template",
    title: "Sponsorship Proposal Deck (PowerPoint)",
    description:
      "A professional, customizable sponsorship deck template designed specifically for Nigerian event organizers. Includes all the sections sponsors expect to see.",
    level: "Intermediate",
    category: "Sponsorship",
    downloadable: true,
    rating: 4.8,
    views: 6200,
  },
  {
    id: "tmpl3",
    type: "template",
    title: "Event Run-of-Show Template",
    description:
      "A detailed minute-by-minute event timeline template used by professional event managers. Keep your team coordinated and your event running on schedule.",
    level: "Intermediate",
    category: "Operations",
    downloadable: true,
    rating: 4.7,
    views: 5500,
  },
  {
    id: "tmpl4",
    type: "template",
    title: "Post-Event Survey Template",
    description:
      "Ready-to-use attendee feedback survey with 20+ proven questions. Understand what worked, what didn't, and how to make your next event even better.",
    level: "Beginner",
    category: "Analytics",
    downloadable: true,
    rating: 4.6,
    views: 4300,
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
      "Click 'Sign Up' on any page or visit /signup. You can sign up with your email address or use Google sign-in for faster registration. Once registered, you'll receive a verification email — click the link to activate your account. After verification, you can immediately start browsing and buying tickets.",
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
  webinar: {
    icon: Headphones,
    color: "text-violet-500",
    bg: "bg-violet-500/15",
    label: "Webinar",
  },
  template: {
    icon: Download,
    color: "text-emerald-500",
    bg: "bg-emerald-500/15",
    label: "Template",
  },
};

const LEVEL_CONFIG = {
  Beginner: "bg-emerald-500/15 text-emerald-600",
  Intermediate: "bg-amber-500/15 text-amber-600",
  Advanced: "bg-red-500/15 text-red-500",
};

const CATEGORIES = [
  "All",
  "Getting Started",
  "Marketing",
  "Ticketing",
  "Operations",
  "Analytics",
  "Sponsorship",
  "Finance",
  "Online Events",
  "Business Growth",
  "Conferences",
  "Festivals",
];

const TYPE_FILTERS: { id: ResourceType | "all"; label: string }[] = [
  { id: "all", label: "All Resources" },
  { id: "guide", label: "Guides" },
  { id: "tutorial", label: "Tutorials" },
  { id: "webinar", label: "Webinars" },
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
          {/* Type + level badges */}
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.color}`}
            >
              {config.label}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_CONFIG[resource.level]}`}
            >
              {resource.level}
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
        ) : resource.videoUrl ? (
          <button className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors">
            <Play className="h-3.5 w-3.5 text-primary" />
            Watch
          </button>
        ) : (
          <button className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors">
            Read
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const OrganizerResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
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
          <Link
            to="/organizer/dashboard"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                <BookOpen className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="rounded-full gradient-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-glow">
                Organizer Hub
              </span>
            </div>
            <h1 className="mb-4 font-display text-5xl font-bold text-foreground">
              Resources &{" "}
              <span className="text-gradient">Learning Center</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Guides, video tutorials, live webinars, and downloadable templates
              — everything you need to plan, promote, and run better events.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              {[
                { value: "50+", label: "Resources" },
                { value: "25+", label: "Video tutorials" },
                { value: "12", label: "Webinars" },
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

      <div className="container mx-auto px-4 pb-20">
        {/* ── Featured resources ────────────────────────────────────────────── */}
        {!hasActiveFilters && (
          <section className="mb-16">
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
              ⭐ Featured Resources
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((resource, i) => (
                <ResourceCard key={resource.id} resource={resource} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── Filters ───────────────────────────────────────────────────────── */}
        <div className="mb-8 rounded-2xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm">
          {/* Search */}
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-border/50 bg-secondary px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Search guides, tutorials, webinars…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent p-0 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 h-8"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Type filter */}
          <div className="mb-3 flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                className={pill(typeFilter === f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Category filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filter by category
            <ChevronRight
              className={`h-4 w-4 transition-transform ${showFilters ? "rotate-90" : ""}`}
            />
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex flex-wrap gap-2 border-t border-border/30 pt-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={pill(categoryFilter === cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results + clear */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center justify-between border-t border-border/30 pt-3">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                resource{filtered.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                ✕ Clear filters
              </button>
            </div>
          )}
        </div>

        {/* ── Resource grid ─────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/20" />
            <p className="font-display text-xl font-semibold text-foreground">
              No resources found
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search term or{" "}
              <button onClick={clearFilters} className="text-primary underline">
                clear your filters
              </button>
              .
            </p>
          </div>
        ) : (
          <>
            {/* Section by type when no type filter is active */}
            {typeFilter === "all" && !searchQuery && categoryFilter === "All" ? (
              <>
                {(["guide", "tutorial", "webinar", "template"] as ResourceType[]).map(
                  (type) => {
                    const typeResources = filtered.filter((r) => r.type === type);
                    if (typeResources.length === 0) return null;
                    const config = TYPE_CONFIG[type];
                    const Icon = config.icon;
                    return (
                      <section key={type} className="mb-14">
                        <div className="mb-6 flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}
                          >
                            <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <h2 className="font-display text-2xl font-bold text-foreground">
                            {config.label}s
                          </h2>
                          <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-semibold text-muted-foreground">
                            {typeResources.length}
                          </span>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                          {typeResources.map((resource, i) => (
                            <ResourceCard
                              key={resource.id}
                              resource={resource}
                              index={i}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  },
                )}
              </>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((resource, i) => (
                  <ResourceCard key={resource.id} resource={resource} index={i} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ── FAQ Section ─────────────────────────────────────────────────── */}
        <section className="mt-20">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Quick answers to common questions about organizing events on Evently
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {FAQS.filter(faq => faq.category === 'organizers' || faq.category === 'payments').map((faq, i) => {
              const isOpen = openFaqId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`overflow-hidden rounded-2xl border transition-all ${
                    isOpen
                      ? "border-primary/30 bg-primary/5 shadow-glow/5"
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
                          <p className="text-sm leading-relaxed text-muted-foreground">
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

          <div className="mt-10 text-center">
            <Link
              to="/help"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <HelpCircle className="h-4 w-4" />
              View all Help Center FAQs
            </Link>
          </div>
        </section>

        {/* ── Newsletter CTA ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 overflow-hidden rounded-3xl gradient-primary p-10 text-center shadow-glow"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
              <Headphones className="h-7 w-7 text-white" />
            </div>
            <h2 className="mb-3 font-display text-3xl font-bold text-white">
              Never Miss a New Resource
            </h2>
            <p className="mb-6 text-white/70">
              Get notified when we publish new guides, tutorials, and webinars.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="h-12 flex-1 rounded-xl border border-white/30 bg-white/15 px-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <Button className="h-12 bg-white px-6 font-semibold text-primary hover:bg-white/90">
                Subscribe
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-3 text-xs text-white/50">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default OrganizerResources;
