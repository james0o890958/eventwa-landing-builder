import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Ticket,
  User,
  Users,
  CreditCard,
  Search,
  MessageCircle,
  Mail,
  Phone,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Settings,
  KeyRound,
  Megaphone,
  DollarSign,
  PlusCircle,
  ShoppingCart,
  MapPin,
  Calendar,
  BarChart3,
  Bell,
  Shield,
  Trash2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: any;
  category: string;
  article: {
    title: string;
    content: string;
    steps?: Array<{
      title: string;
      description: string;
    }>;
  };
  relatedFAQs: string[]; // FAQ IDs
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "All Topics", icon: HelpCircle, color: "from-violet-500 to-purple-600" },
  { id: "organizers", label: "Organizers", icon: MessageCircle, color: "from-amber-500 to-orange-600" },
  { id: "attendees", label: "Attendees", icon: Users, color: "from-blue-500 to-cyan-600" },
  { id: "tickets", label: "Tickets", icon: Ticket, color: "from-pink-500 to-rose-600" },
  { id: "account", label: "Account", icon: User, color: "from-green-500 to-emerald-600" },
  { id: "payments", label: "Payments", icon: CreditCard, color: "from-green-500 to-emerald-600" }
];

// ─── Help Articles ───────────────────────────────────────────────────────────

const HELP_ARTICLES: HelpArticle[] = [
  // Tickets Category
  {
    id: "find-tickets",
    title: "Find My Tickets",
    description: "Retrieve lost tickets by email",
    href: "/help/resources",
    color: "from-pink-500 to-rose-600",
    icon: Ticket,
    category: "tickets",
    article: {
      title: "How to Find and Retrieve Your Event Tickets",
      content: "Never lose access to your event tickets again. Evently makes it easy to find, download, and manage all your tickets in one place. Whether you purchased tickets as a guest or have an account, we have multiple ways to help you access your tickets.",
      steps: [
        {
          title: "Check Your Account Dashboard",
          description: "If you have an Evently account, log in and visit 'My Tickets' to see all your purchased tickets instantly."
        },
        {
          title: "Use the Ticket Recovery Tool",
          description: "Visit /help/find-tickets and enter your email address and ticket reference number to retrieve tickets purchased as a guest."
        },
        {
          title: "Check Your Email",
          description: "Look for the confirmation email sent immediately after purchase. It contains your ticket details and QR codes."
        },
        {
          title: "Download for Offline Access",
          description: "Save PDF copies of your tickets to your device for reliable access even without internet connection."
        }
      ]
    },
    relatedFAQs: ["t1", "t3", "t5", "t9"]
  },
  {
    id: "purchase-tickets",
    title: "Purchase Event Tickets",
    description: "How to buy tickets and attend events",
    href: "/help/resources",
    color: "from-cyan-500 to-blue-600",
    icon: ShoppingCart,
    category: "tickets",
    article: {
      title: "Complete Guide to Purchasing Event Tickets on Evently",
      content: "Buying tickets on Evently is simple and secure. Our platform supports various payment methods and provides instant confirmation. Follow this guide to successfully purchase tickets for any event.",
      steps: [
        {
          title: "Browse and Select Events",
          description: "Explore events by category, location, or date. Click on any event to view details and available tickets."
        },
        {
          title: "Choose Your Tickets",
          description: "Select ticket types (General, VIP, etc.) and quantities. Review pricing and any applicable fees."
        },
        {
          title: "Create Account or Sign In",
          description: "Sign up for a free account or log in to save your tickets and manage purchases."
        },
        {
          title: "Complete Payment",
          description: "Choose from multiple payment options including cards, mobile money, and bank transfers."
        },
        {
          title: "Receive Confirmation",
          description: "Get instant email confirmation with QR codes and ticket details."
        }
      ]
    },
    relatedFAQs: ["t6", "t8", "t1", "p1"]
  },
  {
    id: "transfer-tickets",
    title: "Transfer Tickets",
    description: "How to transfer tickets to someone else",
    href: "/help/resources",
    color: "from-green-500 to-emerald-600",
    icon: CreditCard,
    category: "tickets",
    article: {
      title: "How to Transfer Event Tickets to Another Person",
      content: "Evently allows you to easily transfer tickets to friends, family, or colleagues. This feature ensures your tickets don't go to waste if you can't attend. Note that some organizers may disable transfers for certain events.",
      steps: [
        {
          title: "Access Your Tickets",
          description: "Log in to your account and navigate to 'My Tickets' to see all your purchased tickets."
        },
        {
          title: "Select Ticket to Transfer",
          description: "Find the event ticket you want to transfer and click the 'Transfer' button."
        },
        {
          title: "Enter Recipient Details",
          description: "Provide the email address of the person you want to transfer the ticket to."
        },
        {
          title: "Confirm Transfer",
          description: "Review the details and confirm the transfer. The recipient will receive an email notification."
        }
      ]
    },
    relatedFAQs: ["t2"]
  },

  // Attendees Category
  {
    id: "register-free-events",
    title: "Register for Free Events",
    description: "How to sign up for events that are free",
    href: "/help/resources",
    color: "from-green-500 to-emerald-600",
    icon: Users,
    category: "attendees",
    article: {
      title: "How to Register for Free Events on Evently",
      content: "Many events on Evently are completely free to attend. Registration is simple and ensures you get all the important updates and access information. Free events still require registration to help organizers manage attendance.",
      steps: [
        {
          title: "Find Free Events",
          description: "Browse events and look for those marked as 'Free' or with ₦0 pricing."
        },
        {
          title: "Click Register",
          description: "On the event page, click the 'Register' or 'Get Free Ticket' button."
        },
        {
          title: "Sign In or Create Account",
          description: "You'll need an Evently account to register. Sign up if you don't have one."
        },
        {
          title: "Complete Registration",
          description: "Fill in any required attendee information and confirm your registration."
        },
        {
          title: "Receive Confirmation",
          description: "You'll get an email with your free ticket and event details."
        }
      ]
    },
    relatedFAQs: ["at1"]
  },
  {
    id: "view-event-details",
    title: "View Event Details",
    description: "Find location, schedule, and event information",
    href: "/help/resources",
    color: "from-blue-500 to-cyan-600",
    icon: MapPin,
    category: "attendees",
    article: {
      title: "Complete Guide to Viewing Event Details and Information",
      content: "Before attending any event, it's important to have all the necessary information. Evently provides comprehensive event details including venue information, schedules, and important updates.",
      steps: [
        {
          title: "Access Event Page",
          description: "Click on any event from the explore page or search results to view full details."
        },
        {
          title: "Review Basic Information",
          description: "Check date, time, location, and ticket pricing on the main event card."
        },
        {
          title: "Read Full Description",
          description: "Scroll down to see the complete event description, agenda, and what to expect."
        },
        {
          title: "Check Venue Details",
          description: "Find exact address, maps, parking information, and access instructions."
        },
        {
          title: "View Schedule",
          description: "See the event timeline, session details, and important timings."
        }
      ]
    },
    relatedFAQs: ["at2"]
  },
  {
    id: "contact-organizers",
    title: "Contact Event Organizers",
    description: "How to reach out to event organizers",
    href: "/help/resources",
    color: "from-amber-500 to-orange-600",
    icon: MessageCircle,
    category: "attendees",
    article: {
      title: "How to Contact Event Organizers on Evently",
      content: "Need to ask questions about an event? Evently provides direct communication channels with event organizers. Most organizers respond within 24 hours to help you get the information you need.",
      steps: [
        {
          title: "Find the Contact Option",
          description: "On any event page, look for the 'Contact Organizer' button or link."
        },
        {
          title: "Choose Contact Method",
          description: "Select from available options like email, phone, or in-app messaging."
        },
        {
          title: "Compose Your Message",
          description: "Write a clear, specific question about the event, tickets, or logistics."
        },
        {
          title: "Send and Wait for Response",
          description: "Submit your message and expect a response within 24 hours."
        }
      ]
    },
    relatedFAQs: ["at3"]
  },

  // Organizers Category
  {
    id: "become-organizer",
    title: "Become an Organizer",
    description: "Learn how to start selling tickets",
    href: "/help/resources",
    color: "from-blue-500 to-cyan-600",
    icon: MessageCircle,
    category: "organizers",
    article: {
      title: "Complete Guide to Becoming an Event Organizer on Evently",
      content: "Turn your event ideas into reality with Evently. Our platform makes it easy for anyone to create, promote, and sell tickets for events. Whether you're organizing your first meetup or a large conference, we provide all the tools you need.",
      steps: [
        {
          title: "Sign Up for an Account",
          description: "Create a free Evently account with your email address."
        },
        {
          title: "Complete Organizer Profile",
          description: "Fill in your organizer details and verify your identity if required."
        },
        {
          title: "Wait for Approval",
          description: "Most accounts are approved within 24 hours. You'll receive an email confirmation."
        },
        {
          title: "Create Your First Event",
          description: "Use our event creation wizard to set up your event details and ticket pricing."
        },
        {
          title: "Start Promoting",
          description: "Share your event link and use our marketing tools to attract attendees."
        }
      ]
    },
    relatedFAQs: ["og15", "og16", "og17", "og1"]
  },
  {
    id: "create-events",
    title: "Create an Event",
    description: "Learn how to create and publish events",
    href: "/help/resources",
    color: "from-fuchsia-500 to-pink-600",
    icon: PlusCircle,
    category: "organizers",
    article: {
      title: "Step-by-Step Guide to Creating Events on Evently",
      content: "Creating an event on Evently takes just minutes with our intuitive event creation wizard. We'll guide you through every step to ensure your event is set up correctly and ready to attract attendees.",
      steps: [
        {
          title: "Access Event Creation",
          description: "Log in to your organizer account and click 'Create Event' from your dashboard."
        },
        {
          title: "Enter Basic Details",
          description: "Provide event title, description, date, time, and location information."
        },
        {
          title: "Set Up Tickets",
          description: "Create ticket tiers (General, VIP, etc.) with different pricing and quantities."
        },
        {
          title: "Add Event Media",
          description: "Upload high-quality images and promotional materials for your event."
        },
        {
          title: "Configure Settings",
          description: "Set refund policies, attendee limits, and other event preferences."
        },
        {
          title: "Publish Your Event",
          description: "Review all details and publish your event to make it live."
        }
      ]
    },
    relatedFAQs: ["og8", "og9", "og10", "og5"]
  },
  {
    id: "manage-attendees",
    title: "Manage Attendees",
    description: "See who's coming and stay in control",
    href: "/help/resources",
    color: "from-teal-500 to-cyan-600",
    icon: Users,
    category: "organizers",
    article: {
      title: "Complete Guide to Managing Event Attendees",
      content: "Keep track of who's attending your events with Evently's comprehensive attendee management tools. View registrations, communicate with attendees, and manage check-ins all from your organizer dashboard.",
      steps: [
        {
          title: "Access Attendee Dashboard",
          description: "From your organizer dashboard, select an event and click 'Attendees'."
        },
        {
          title: "View Attendee List",
          description: "See all registered attendees with their contact information and ticket details."
        },
        {
          title: "Export Attendee Data",
          description: "Download attendee lists as CSV files for your records or email marketing."
        },
        {
          title: "Send Communications",
          description: "Send announcements, updates, or reminders to all or selected attendees."
        },
        {
          title: "Manage Check-ins",
          description: "Use QR code scanning for efficient check-in on event day."
        }
      ]
    },
    relatedFAQs: ["og3", "og6"]
  },

  // Account Category
  {
    id: "account-help",
    title: "Account Help",
    description: "Login, profile, and settings",
    href: "/help/resources",
    color: "from-violet-500 to-purple-600",
    icon: User,
    category: "account",
    article: {
      title: "Managing Your Evently Account",
      content: "Your Evently account is your gateway to discovering events, managing tickets, and organizing your own events. Learn how to keep your account secure and up to date with all the latest features.",
      steps: [
        {
          title: "Update Profile Information",
          description: "Keep your name, email, and profile picture current in account settings."
        },
        {
          title: "Manage Notification Preferences",
          description: "Choose what emails and notifications you want to receive."
        },
        {
          title: "Secure Your Account",
          description: "Use strong passwords and enable two-factor authentication."
        },
        {
          title: "Link Social Accounts",
          description: "Connect Google or other accounts for easier sign-in."
        }
      ]
    },
    relatedFAQs: ["ac3", "ac5", "ac1", "ac2"]
  },
  {
    id: "trouble-signing-in",
    title: "Trouble Signing In?",
    description: "Reset password and access your account",
    href: "/help/resources",
    color: "from-red-500 to-pink-600",
    icon: KeyRound,
    category: "account",
    article: {
      title: "How to Reset Your Password and Recover Account Access",
      content: "Forgot your password or having trouble signing in? Evently provides multiple ways to regain access to your account quickly and securely. Most account recovery issues can be resolved in minutes.",
      steps: [
        {
          title: "Use Forgot Password",
          description: "On the sign-in page, click 'Forgot Password?' and enter your email address."
        },
        {
          title: "Check Your Email",
          description: "Look for a password reset link in your inbox (check spam folder too)."
        },
        {
          title: "Create New Password",
          description: "Click the reset link and choose a strong, memorable password."
        },
        {
          title: "Sign In with New Password",
          description: "Return to Evently and sign in with your email and new password."
        }
      ]
    },
    relatedFAQs: ["ac2", "ac6", "ac8", "ac9"]
  },

  // Payments Category
  {
    id: "payment-issues",
    title: "Payment Issues",
    description: "Billing and refund support",
    href: "/help/resources",
    color: "from-green-500 to-emerald-600",
    icon: CreditCard,
    category: "payments",
    article: {
      title: "Resolving Payment Issues and Getting Refunds",
      content: "Payment problems can be frustrating, but Evently is here to help. Whether your payment was declined, you need a refund, or you're having other billing issues, we provide clear solutions and support.",
      steps: [
        {
          title: "Check Payment Status",
          description: "Review your purchase confirmation and payment receipt for status updates."
        },
        {
          title: "Contact Support",
          description: "Use our payment support form or contact us directly for assistance."
        },
        {
          title: "Provide Details",
          description: "Include your ticket reference number and payment information for faster resolution."
        },
        {
          title: "Wait for Resolution",
          description: "Most payment issues are resolved within 24-48 hours."
        }
      ]
    },
    relatedFAQs: ["p3", "p4", "p5"]
  },
  {
    id: "accepted-payment-methods",
    title: "Accepted Payment Methods",
    description: "What payment options are available",
    href: "/help/resources",
    color: "from-blue-500 to-cyan-600",
    icon: CreditCard,
    category: "payments",
    article: {
      title: "Payment Methods Accepted on Evently",
      content: "Evently supports a wide range of payment methods to make purchasing tickets easy and convenient. We accept both local and international payment options with industry-standard security.",
      steps: [
        {
          title: "Credit/Debit Cards",
          description: "Visa, Mastercard, and Verve cards are accepted worldwide."
        },
        {
          title: "Mobile Money",
          description: "Pay with OPay, Kuda, PalmPay, and other mobile money apps."
        },
        {
          title: "Bank Transfers",
          description: "Direct bank transfers for larger purchases or corporate accounts."
        },
        {
          title: "Digital Wallets",
          description: "Use popular digital wallet services for instant payments."
        }
      ]
    },
    relatedFAQs: ["p1", "p2"]
  }
];

// ─── Main component ───────────────────────────────────────────────────────────

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get articles for current category
  const categoryArticles = HELP_ARTICLES.filter((article) => {
    if (selectedCategory === "all") return true;
    return article.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <HelpCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mb-3 font-display text-4xl font-bold text-foreground sm:text-5xl">
              How can we help?
            </h1>
            <p className="mb-8 text-muted-foreground">
              Search our knowledge base or browse by category
            </p>

            {/* Search */}
            <div className="mx-auto max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for answers…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 rounded-2xl border-border/50 bg-card pl-12 text-base shadow-card focus-visible:ring-primary"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* ── Category chips ───────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "gradient-primary text-white shadow-glow"
                  : "border border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </motion.button>
          ))}
        </div>

        {/* ── Help Articles ────────────────────────────────────────────────── */}
        {!searchQuery && categoryArticles.length > 0 && (
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryArticles.map((article, i) => (
              <motion.a
                key={article.id}
                href={article.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={(e) => {
                  if (article.href.startsWith("#")) {
                    e.preventDefault();
                    setSelectedCategory(article.href.slice(1));
                  }
                }}
                className="group flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${article.color} shadow-md`}
                >
                  <article.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{article.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.a>
            ))}
          </div>
        )}
      </div>

        {/* ── Contact support ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 max-w-4xl"
        >
          <div className="mb-8 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Still need help?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our support team is available 7 days a week
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
            {
                icon: MessageCircle,
                label: "WhatsApp Chat",
                desc: "Chat with us on WhatsApp",
                action: "Start Chat",
                color: "from-green-500 to-emerald-600",
                available: true,
              },
              {
                icon: Mail,
                label: "Email Support",
                desc: "support@evently.ng",
                action: "Send Email",
                color: "from-blue-500 to-cyan-600",
                available: true,
              },
              {
                icon: Phone,
                label: "Phone Support",
                desc: "+234 800 EVENTLY",
                action: "Call Us",
                color: "from-green-500 to-emerald-600",
                available: false,
              },
            ].map((contact) => (
              <div
                key={contact.label}
                className="flex flex-col items-center rounded-2xl border border-border/50 bg-card p-6 text-center shadow-card"
              >
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${contact.color} shadow-md`}
                >
                  <contact.icon className="h-7 w-7 text-white" />
                </div>
                <p className="mb-1 font-display font-semibold text-foreground">
                  {contact.label}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  {contact.desc}
                </p>
                {contact.available ? (
                  <Button
                    size="sm"
                    className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                  >
                    {contact.action}
                  </Button>
                ) : (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                    Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Quick links */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link
              to="/help/find-tickets"
              className="hover:text-primary transition-colors"
            >
              Find My Tickets
            </Link>
            <span>·</span>
            <Link
              to="/help/contact-organizer"
              className="hover:text-primary transition-colors"
            >
              Contact an Organizer
            </Link>
            <span>·</span>
            <Link
              to="/organizers"
              className="hover:text-primary transition-colors"
            >
              Organizer Help
            </Link>
            <span>·</span>
            <Link
              to="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <span>·</span>
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </motion.div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
