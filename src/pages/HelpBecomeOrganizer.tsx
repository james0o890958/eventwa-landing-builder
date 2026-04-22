import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Star,
  Shield,
  TrendingUp,
  Zap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How do I become an event organizer on Evently?",
    answer:
      "Sign up for an account, verify your email, and complete your organizer profile. Once approved (usually within 24 hours), you can start creating and selling tickets for your events.",
  },
  {
    question: "Is there a fee to become an organizer?",
    answer:
      "No! Joining Evently as an organizer is free. We charge a small platform fee per ticket sold (5% on the Free plan), but there are no upfront costs or monthly fees on our starter plan.",
  },
  {
    question: "Do I need a business account to sell tickets?",
    answer:
      "You can start with a personal account and upgrade to a business account later. For larger events or regular ticketing, we recommend a business account for credibility and tax purposes.",
  },
  {
    question: "How long does it take to get approved?",
    answer:
      "Most organizer applications are approved within 24 hours. If we need additional verification, it may take up to 48 hours. You'll receive an email once your account is activated.",
  },
  {
    question: "Can I sell tickets for free events?",
    answer:
      "Yes! You can create free events with ₦0 tickets. Even for free events, Evently charges a small platform fee to cover payment processing.",
  },
  {
    question: "What types of events can I organize?",
    answer:
      "You can organize any type of event: concerts, conferences, workshops, meetups, sports events, comedy shows, festivals, private parties, and more. Just ensure the event is real and you can deliver on your promises.",
  },
  {
    question: "How do I build trust as a new organizer?",
    answer:
      "Complete your organizer profile with a photo, bio, and social links. Respond to attendee questions promptly. Start with smaller events and build reviews over time.",
  },
];

const STEPS = [
  {
    step: 1,
    title: "Create your Evently account",
    desc: "Sign up with your email or Google account. Verify your email address.",
    icon: Users,
  },
  {
    step: 2,
    title: "Complete your organizer profile",
    desc: "Add your photo, bio, organization name, and social media links.",
    icon: Star,
  },
  {
    step: 3,
    title: "Submit for verification",
    desc: "Our team reviews your application (usually within 24 hours).",
    icon: Shield,
  },
  {
    step: 4,
    title: "Create your first event",
    desc: "Add event details, set ticket prices, and publish your event.",
    icon: Zap,
  },
  {
    step: 5,
    title: "Start selling tickets",
    desc: "Share your event link and track sales from your dashboard.",
    icon: TrendingUp,
  },
];

const HelpBecomeOrganizer = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        <Link
          to="/help"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Becoming an Organizer
          </h1>
          <p className="mt-3 text-muted-foreground">
            How to start selling tickets and grow your events on Evently
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 grid gap-4 sm:grid-cols-2"
        >
          <Link to="/organizers" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Organizer Page
                </p>
                <p className="text-xs text-muted-foreground">
                  Learn more about Evently
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
          <Link to="/organizer/create-event" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Start Creating
                </p>
                <p className="text-xs text-muted-foreground">
                  Create your first event
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            Step-by-Step Guide
          </h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex gap-4 rounded-2xl border border-border/50 bg-card p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <step.icon className="h-5 w-5 text-primary" />
                    <p className="font-medium text-foreground">{step.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 rounded-2xl border border-border/50 bg-card p-6"
        >
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
            Why Choose Evently?
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Shield, text: "Secure payments with 256-bit encryption" },
              { icon: TrendingUp, text: "Real-time analytics and reporting" },
              { icon: Users, text: "Unlimited attendees on all plans" },
              { icon: Zap, text: "Instant ticket delivery to buyers" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3"
              >
                <item.icon className="h-5 w-5 text-primary" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
        >
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
            Ready to get started?
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Join thousands of organizers selling tickets on Evently.
          </p>
          <Link to="/become-organizer">
            <Button className="gradient-primary text-primary-foreground shadow-glow">
              Apply to Become an Organizer
            </Button>
          </Link>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpBecomeOrganizer;