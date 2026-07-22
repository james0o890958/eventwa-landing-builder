import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Ticket,
  Users,
  BarChart3,
  Megaphone,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  HeadphonesIcon,
  UserPlus,
  UserCheck,
  ChevronRight,
  LogIn,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { organizerSlug } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockEvents } from "@/data/mockEvents";
import { useAuth } from "@/contexts/AuthContext";

// ─── Derived organizer list ───────────────────────────────────────────────────

interface OrganizerCard {
  id: string;
  name: string;
  initials: string;
  totalEvents: number;
  totalAttendees: number;
  category: string;
  color: string;
}

const GRADIENT_COLORS = [
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-green-500 to-emerald-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-emerald-600",
  "from-indigo-500 to-blue-600",
  "from-red-500 to-pink-600",
];

function deriveOrganizers(): OrganizerCard[] {
  const map: Record<
    string,
    { totalEvents: number; totalAttendees: number; category: string }
  > = {};
  for (const event of mockEvents) {
    if (!map[event.organizer]) {
      map[event.organizer] = {
        totalEvents: 0,
        totalAttendees: 0,
        category: event.category,
      };
    }
    map[event.organizer].totalEvents += 1;
    map[event.organizer].totalAttendees += event.attendees;
  }
  return Object.entries(map)
    .map(([name, stats], i) => ({
      id: organizerSlug(name),
      name,
      initials: name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase(),
      totalEvents: stats.totalEvents,
      totalAttendees: stats.totalAttendees,
      category: stats.category,
      color: GRADIENT_COLORS[i % GRADIENT_COLORS.length],
    }))
    .sort((a, b) => b.totalAttendees - a.totalAttendees)
    .slice(0, 8);
}

const topOrganizers = deriveOrganizers();

// ─── Static content ───────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Account",
    desc: "Sign up for free and set up your organizer profile in minutes. No technical skills required.",
  },
  {
    step: "02",
    icon: Ticket,
    title: "Create Your Event",
    desc: "Fill in your event details — name, date, venue, description, and ticket types with custom pricing.",
  },
  {
    step: "03",
    icon: Megaphone,
    title: "Promote & Sell",
    desc: "Share your event with Evently's built-in marketing tools and start selling tickets immediately.",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Track & Manage",
    desc: "Monitor ticket sales, manage attendees, and view real-time analytics from your dashboard.",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Setup",
    desc: "Launch your event page in under 5 minutes. Our intuitive builder guides you every step of the way.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Track ticket sales, revenue, and attendance with a beautiful dashboard updated in real time.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Megaphone,
    title: "Built-in Marketing",
    desc: "Promote your events with featured listings, sponsored placements, and email campaigns.",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Users,
    title: "Attendee Management",
    desc: "View, export, and communicate with your attendee list. Send announcements with one click.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Accept payments via OPay, Kuda, bank transfer, and card — all secured and settled fast.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    desc: "Our dedicated team is always available to help you plan, promote, and run successful events.",
    color: "from-teal-500 to-emerald-600",
  },
  {
    icon: Globe,
    title: "Reach More People",
    desc: "Tap into Evently's growing community of event-goers across Lagos, Abuja, PH and beyond.",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Brand",
    desc: "Build a following, showcase your past events, and establish yourself as a top organizer.",
    color: "from-red-500 to-pink-600",
  },
];

const TESTIMONIALS = [
  {
    name: "Chioma Okafor",
    role: "Music Event Organizer",
    initials: "CO",
    color: "from-pink-500 to-rose-600",
    rating: 5,
    quote:
      "Evently transformed how I run my events. Ticket sales are seamless and the analytics help me understand my audience. I sold out my last 3 events!",
  },
  {
    name: "Yusuf Abdullahi",
    role: "Tech Conference Host",
    initials: "YA",
    color: "from-blue-500 to-cyan-600",
    rating: 5,
    quote:
      "The platform is incredibly easy to use. I set up my TechHub conference in an afternoon and had 500 registrations within the first week.",
  },
  {
    name: "Adaeze Nwosu",
    role: "Festival Curator",
    initials: "AN",
    color: "from-violet-500 to-purple-600",
    rating: 5,
    quote:
      "Managing 10,000+ attendees used to be a nightmare. Evently's attendee tools and real-time check-in made the Calabar Festival run perfectly.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    desc: "Perfect for getting started",
    highlight: false,
    features: [
      "Up to 3 events/month",
      "Basic attendee management",
      "5% per ticket sold",
      "Standard event page",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: "₦5,000",
    period: "per month",
    desc: "For growing organizers",
    highlight: true,
    features: [
      "Unlimited events",
      "Advanced analytics",
      "3% per ticket sold",
      "Custom event page",
      "Priority support",
      "Promotional tools",
      "Attendee export (CSV)",
    ],
  },
  {
    name: "Premium",
    price: "₦15,000",
    period: "per month",
    desc: "For large-scale organizers",
    highlight: false,
    features: [
      "Everything in Pro",
      "1.5% per ticket sold",
      "Featured listing",
      "Dedicated account manager",
      "Custom branding",
      "API access",
      "Sponsorship tools",
    ],
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const OrganizersPage = () => {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  const token = localStorage.getItem("access_token");
  const { data: profileRes } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => (token ? api.get("profile", undefined, token) : null),
    enabled: !!token,
  });

  const isOrganizer = !!(
    user?.organizer ||
    profileRes?.user?.organizer ||
    profileRes?.organizer ||
    (session?.user as any)?.is_organizer ||
    session?.user?.user_metadata?.is_organizer ||
    localStorage.getItem("organizer_profile")
  );

  const toggleFollow = (name: string) => {
    setFollowed((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Handler for "Start Hosting" and "Create Event" buttons
  const handleStartHosting = () => {
    if (!token && !session) {
      // Not logged in - go to auth page with redirect to become organizer
      navigate('/login?redirect=/become-organizer');
    } else if (isOrganizer) {
      navigate('/organizer/dashboard');
    } else {
      navigate('/become-organizer');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-1/4 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-6 inline-block rounded-full gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              🎟️ For Event Organizers
            </span>
            <h1 className="mb-6 font-display text-5xl font-bold text-foreground sm:text-6xl lg:text-7xl">
              Host Events That{" "}
              <span className="text-gradient">Move People</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Create, promote, and manage unforgettable events across Nigeria.
              Join thousands of organizers who trust Evently to sell tickets,
              reach audiences, and deliver world-class experiences.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={handleStartHosting}
                className="gradient-primary px-8 text-primary-foreground shadow-glow hover:opacity-90 text-base"
              >
                {isOrganizer ? "Go to Organizer Dashboard" : "Start Hosting for Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/organizer/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/50 text-foreground hover:bg-secondary text-base px-8"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card required · Free to get started
            </p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 rounded-2xl border border-border/50 bg-card/80 p-6 backdrop-blur-xl sm:grid-cols-4"
          >
            {[
              { value: "2,400+", label: "Events Hosted" },
              { value: "₦2.1B+", label: "Tickets Sold" },
              { value: "580K+", label: "Happy Attendees" },
              { value: "1,200+", label: "Organizers" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className="text-center"
              >
                <p className="font-display text-2xl font-bold text-gradient">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              From idea to sold-out event in four simple steps
            </p>
          </motion.div>

          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connecting line */}
            <div className="absolute top-10 left-1/4 right-1/4 hidden h-px bg-gradient-to-r from-primary/30 via-primary to-primary/30 lg:block" />

            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                  <step.icon className="h-9 w-9 text-primary-foreground" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border/50 text-xs font-bold text-primary">
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Everything You Need to Succeed
            </h2>
            <p className="mt-3 text-muted-foreground">
              Powerful tools built specifically for Nigerian event organizers
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-md`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-display text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing preview ───────────────────────────────────────────────── */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start free, scale as you grow. No hidden fees.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border p-6 shadow-card transition-all ${
                  plan.highlight
                    ? "border-primary bg-card"
                    : "border-border/50 bg-card"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute right-4 top-4 rounded-full gradient-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground shadow-glow">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display text-xl font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.desc}
                </p>
                <div className="my-5">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
                <ul className="mb-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.highlight
                      ? "gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                      : "border border-border/50 bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                  onClick={handleStartHosting}
                >
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/organizer/pricing">
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                View full pricing details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Trusted by Nigeria's Best Organizers
            </h2>
            <p className="mt-3 text-muted-foreground">
              Hear from real organizers who've grown with Evently
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-border/50 bg-card p-6 shadow-card"
              >
                <div className="mb-4 flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-secondary-foreground/80 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${t.color} text-xs font-bold text-white`}
                    >
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Organizers List ────────────────────────────────────────── */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Meet Our Top Organizers
            </h2>
            <p className="mt-3 text-muted-foreground">
              Follow the people behind Nigeria's most exciting events
            </p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topOrganizers.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border/50 bg-card p-5 text-center transition-all hover:border-primary/30 hover:shadow-card"
              >
                <Link
                  to={`/organizer/${org.id}`}
                  className="mb-4 block cursor-pointer text-center transition hover:text-primary"
                >
                  <Avatar className="mx-auto mb-3 h-16 w-16">
                    <AvatarFallback
                      className={`bg-gradient-to-br ${org.color} text-lg font-bold text-white`}
                    >
                      {org.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="mb-0.5 font-display font-semibold text-foreground line-clamp-1 text-sm hover:text-primary transition-colors">
                    {org.name}
                  </p>
                  <p className="mb-1 text-xs capitalize text-muted-foreground">
                    {org.category}
                  </p>
                  <p className="mb-4 text-xs text-muted-foreground">
                    {org.totalEvents} event{org.totalEvents !== 1 ? "s" : ""} ·{" "}
                    {org.totalAttendees >= 1000
                      ? `${(org.totalAttendees / 1000).toFixed(0)}K`
                      : org.totalAttendees.toLocaleString()}{" "}
                    attendees
                  </p>
                </Link>
                
                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-border/50 text-xs"
                    onClick={() => navigate(`/organizer/${org.id}`)}
                  >
                    View
                  </Button>
                  {session ? (
                    <Button
                      size="sm"
                      onClick={() => toggleFollow(org.name)}
                      className={`flex-1 text-xs ${
                        followed[org.name]
                          ? "bg-secondary text-foreground hover:bg-secondary/80"
                          : "gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                      }`}
                    >
                      {followed[org.name] ? (
                        <>
                          <UserCheck className="mr-1 h-3.5 w-3.5" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-1 h-3.5 w-3.5" />
                          Follow
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/50 text-xs text-muted-foreground"
                      onClick={() => navigate('/login?redirect=/organizers')}
                    >
                      <LogIn className="mr-1 h-3.5 w-3.5" />
                      Login to Follow
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl gradient-primary p-12 text-center shadow-glow"
          >
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <h2 className="mb-4 font-display text-4xl font-bold text-white sm:text-5xl">
                Ready to Host Your First Event?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-lg text-white/70">
                Join over 1,200 organizers already growing with Evently. Start
                for free — no credit card needed.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={handleStartHosting}
                  className="bg-white px-8 text-primary hover:bg-white/90 text-base font-semibold"
                >
                  Create Your First Event
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link to="/help">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 text-base px-8"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrganizersPage;
