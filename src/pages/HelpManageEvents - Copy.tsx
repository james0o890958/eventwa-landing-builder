import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How do I edit my event after publishing?",
    answer:
      "Go to your Organizer Dashboard, find your event, and click the Edit button. You can update details like description, location, and ticket prices. Note that you cannot change the event date within 48 hours of the event.",
  },
  {
    question: "Can I cancel an event?",
    answer:
      "Yes, go to your event settings and select 'Cancel Event'. All ticket holders will automatically receive a full refund. We recommend notifying attendees before cancelling.",
  },
  {
    question: "How do I view event analytics?",
    answer:
      "Your Organizer Dashboard shows real-time analytics including ticket sales, revenue, attendee demographics, and sales channels. Export reports as CSV for further analysis.",
  },
  {
    question: "Can I change the event date after tickets are sold?",
    answer:
      "Yes, but you'll need to notify all ticket holders. If any attendee requests a refund due to the date change, you must honor it. Use the announcements feature to communicate changes.",
  },
  {
    question: "How do I make my event private?",
    answer:
      "In event settings, toggle 'Private Event'. Only people with the direct link can find and RSVP. Your event won't appear in search results.",
  },
  {
    question: "What happens when my event ends?",
    answer:
      "Your event automatically moves to 'Past Events' in your dashboard. You'll receive a summary report with attendance data and final revenue within 48 hours.",
  },
];

const STEPS = [
  {
    step: 1,
    title: "Go to your Organizer Dashboard",
    desc: "Sign in and click 'Dashboard' to see all your events at a glance.",
    icon: BarChart3,
  },
  {
    step: 2,
    title: "Find the event you want to manage",
    desc: "Filter by 'Upcoming', 'Draft', or 'Past' to locate your event quickly.",
    icon: Eye,
  },
  {
    step: 3,
    title: "Edit event details",
    desc: "Click 'Edit' to update description, location, tickets, and settings.",
    icon: Edit3,
  },
  {
    step: 4,
    title: "Monitor ticket sales",
    desc: "Track sales in real-time. See who bought tickets and revenue collected.",
    icon: Calendar,
  },
  {
    step: 5,
    title: "Communicate with attendees",
    desc: "Send announcements or updates directly to all ticket holders.",
    icon: Settings,
  },
];

const HelpManageEvents = () => {
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Managing Your Events
          </h1>
          <p className="mt-3 text-muted-foreground">
            How to edit, update, and manage your published events
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 grid gap-4 sm:grid-cols-2"
        >
          <Link to="/organizer/dashboard" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Organizer Dashboard
                </p>
                <p className="text-xs text-muted-foreground">
                  View and manage all your events
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
                  Create New Event
                </p>
                <p className="text-xs text-muted-foreground">
                  Set up and publish a new event
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
            Need more help?
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Contact our support team for assistance with event management.
          </p>
          <Button className="gradient-primary text-primary-foreground shadow-glow">
            Contact Support
          </Button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpManageEvents;