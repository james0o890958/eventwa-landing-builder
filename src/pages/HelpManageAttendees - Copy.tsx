import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Mail,
  QrCode,
  Download,
  UserPlus,
  Search,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How do I see who bought tickets?",
    answer:
      "Go to the Attendees section of your event. You'll see a list of all ticket holders with their name, email, ticket type, and purchase date.",
  },
  {
    question: "Can I check in attendees at the event?",
    answer:
      "Yes! Ask attendees to show their QR code on their phone or print their ticket. You can scan the QR code with any QR scanner app to verify attendance.",
  },
  {
    question: "How do I export the attendee list?",
    answer:
      "In the Attendees section, click 'Export CSV' to download a spreadsheet with all attendee details. Useful for name tags, seating, or third-party check-in systems.",
  },
  {
    question: "Can I manually add an attendee?",
    answer:
      "Yes, you can add attendees manually from the Attendees section. Enter their name, email, and ticket type. They'll receive a confirmation email.",
  },
  {
    question: "What if someone loses their ticket?",
    answer:
      "Direct them to /help/find-tickets to retrieve their ticket using their email or ticket reference number. You can also look up their ticket from your attendee list.",
  },
  {
    question: "How do I send messages to all attendees?",
    answer:
      "Use the 'Send Announcement' feature to email all ticket holders at once. Great for updates, reminders, or day-of instructions.",
  },
  {
    question: "Can I remove someone from the attendee list?",
    answer:
      "Yes, but this cancels their ticket. Refund their payment first if applicable, then remove them. They'll lose access to the event automatically.",
  },
];

const STEPS = [
  {
    step: 1,
    title: "Go to your event's Attendees page",
    desc: "Find your event in the Dashboard and click 'Attendees'.",
    icon: Users,
  },
  {
    step: 2,
    title: "View the full attendee list",
    desc: "See all ticket holders with their details and ticket types.",
    icon: Search,
  },
  {
    step: 3,
    title: "Check in attendees on event day",
    desc: "Scan QR codes or look up tickets by email/reference number.",
    icon: QrCode,
  },
  {
    step: 4,
    title: "Export or share the list",
    desc: "Download CSV for printing name tags or using external tools.",
    icon: Download,
  },
  {
    step: 5,
    title: "Send announcements",
    desc: "Email all attendees with updates or reminders.",
    icon: Mail,
  },
];

const HelpManageAttendees = () => {
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Managing Attendees
          </h1>
          <p className="mt-3 text-muted-foreground">
            How to view, check in, and manage your event attendees
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Organizer Dashboard
                </p>
                <p className="text-xs text-muted-foreground">
                  Access your attendee lists
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
          <Link to="/help/find-tickets" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-md">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Find Lost Tickets
                </p>
                <p className="text-xs text-muted-foreground">
                  Help attendees find their tickets
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
            Contact our support team for assistance with attendee management.
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

export default HelpManageAttendees;