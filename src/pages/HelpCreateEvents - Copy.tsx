import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  PlusCircle,
  ExternalLink,
  AlertCircle,
  Calendar,
  MapPin,
  Ticket,
  Image,
  Video,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How do I create my first event?",
    answer:
      "Go to /organizer/create-event and fill in the event details: title, description, date, time, location, and tickets. Add a cover image and publish when ready.",
  },
  {
    question: "Can I create a free event?",
    answer:
      "Yes! Set your ticket price to ₦0 for a free event. Attendees will still need to register and get a ticket for entry.",
  },
  {
    question: "What image should I use for my event?",
    answer:
      "Use a high-quality image (minimum 1200x630px) that represents your event. Avoid using text heavily on images as it may not display well across devices.",
  },
  {
    question: "Can I schedule an event for a future date?",
    answer:
      "Yes! You can schedule events months in advance. Your event will go live immediately but will only appear in 'Upcoming' searches until the date arrives.",
  },
  {
    question: "Can I create a recurring event?",
    answer:
      "Currently, each occurrence is created separately. We're working on recurring event support. For now, create each date as a separate event.",
  },
  {
    question: "What if my event is online?",
    answer:
      "Select 'Online Event' as the location type and enter the meeting link or streaming platform details. Attendees will receive the link before the event.",
  },
  {
    question: "Can I save my event as a draft?",
    answer:
      "Yes! Click 'Save as Draft' to publish later. Your draft events are visible only to you in the Dashboard.",
  },
];

const STEPS = [
  {
    step: 1,
    title: "Go to Create Event page",
    desc: "Click 'Create Event' from your Dashboard or the Organizers page.",
    icon: PlusCircle,
  },
  {
    step: 2,
    title: "Fill in event details",
    desc: "Add title, description, date, time, and location. Be specific and clear.",
    icon: Calendar,
  },
  {
    step: 3,
    title: "Upload a cover image",
    desc: "Add a high-quality image that represents your event.",
    icon: Image,
  },
  {
    step: 4,
    title: "Set up tickets",
    desc: "Create ticket tiers (General, VIP) and set prices or free entry.",
    icon: Ticket,
  },
  {
    step: 5,
    title: "Preview and publish",
    desc: "Review your event and click Publish. Your event goes live immediately!",
    icon: CheckCircle,
  },
];

const HelpCreateEvents = () => {
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-md">
            <PlusCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Creating an Event
          </h1>
          <p className="mt-3 text-muted-foreground">
            Step-by-step guide to creating and publishing your event
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Link to="/organizer/create-event" className="group block">
            <div className="flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5 transition-all hover:border-primary/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-md">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Create Your Event Now
                </p>
                <p className="text-xs text-muted-foreground">
                  Start the event creation form
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-primary" />
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
            Contact our support team for event creation assistance.
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

export default HelpCreateEvents;