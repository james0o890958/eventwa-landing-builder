import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Megaphone,
  ExternalLink,
  AlertCircle,
  Share2,
  Twitter,
  Instagram,
  Facebook,
  Star,
  TrendingUp,
  Users,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How do I promote my event on social media?",
    answer:
      "Share your event link on Twitter, Instagram, and Facebook. Use eye-catching images and a clear call-to-action. Evently provides shareable event pages optimized for social media.",
  },
  {
    question: "Can I feature my event on Evently?",
    answer:
      "Featured events are shown on the homepage and category pages. Events are selected based on popularity and organizer history. Keep your event updated to be considered.",
  },
  {
    question: "How do I reach more people?",
    answer:
      "Use multiple channels: social media, email lists, partner organizations, and influencers. Create urgency with early bird deadlines and limited ticket availability.",
  },
  {
    question: "Should I offer early bird discounts?",
    answer:
      "Yes! Early bird pricing creates urgency and rewards early buyers. Offer 10-20% off for the first week or first 50 tickets to boost initial sales.",
  },
  {
    question: "How do I use email marketing?",
    answer:
      "Build an email list before the event. Send save-the-dates, reminders, and exclusive deals. Evently's announcement feature lets you email all ticket holders directly.",
  },
  {
    question: "Can I partner with influencers?",
    answer:
      "Partner with relevant influencers or micro-influencers in your niche. Offer them free tickets in exchange for posts or reviews.",
  },
  {
    question: "How do I track my promotion success?",
    answer:
      "Use unique links or promo codes for different channels. Monitor ticket sales by source in your Dashboard to see what's working.",
  },
  {
    question: "What makes a good event listing?",
    answer:
      "Use a high-quality image, clear title, detailed description, and competitive pricing. Add video if possible. Respond to attendee questions quickly.",
  },
];

const STEPS = [
  {
    step: 1,
    title: "Optimize your event listing",
    desc: "Use a great cover image, clear description, and competitive pricing.",
    icon: Star,
  },
  {
    step: 2,
    title: "Share on social media",
    desc: "Post on Twitter, Instagram, Facebook with the event link.",
    icon: Share2,
  },
  {
    step: 3,
    title: "Use Evently's promote feature",
    desc: "Go to /organizer/promote to boost your event visibility.",
    icon: TrendingUp,
  },
  {
    step: 4,
    title: "Build urgency",
    desc: "Add early bird deadlines or limited ticket tiers to encourage fast action.",
    icon: Users,
  },
  {
    step: 5,
    title: "Email your network",
    desc: "Send announcements to past attendees and your email list.",
    icon: Mail,
  },
];

const HelpPromoteEvents = () => {
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
            <Megaphone className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Promoting Your Event
          </h1>
          <p className="mt-3 text-muted-foreground">
            How to get the word out and sell more tickets
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 grid gap-4 sm:grid-cols-2"
        >
          <Link to="/organizer/promote" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Promote Tools
                </p>
                <p className="text-xs text-muted-foreground">
                  Access Evently's marketing tools
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
          <Link to="/organizer/dashboard" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  View Analytics
                </p>
                <p className="text-xs text-muted-foreground">
                  Track your ticket sales
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
            Share on Social Media
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3">
              <Twitter className="h-5 w-5 text-[#1DA1F2]" />
              <span className="text-sm font-medium">Twitter</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3">
              <Instagram className="h-5 w-5 text-[#E4405F]" />
              <span className="text-sm font-medium">Instagram</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3">
              <Facebook className="h-5 w-5 text-[#1877F2]" />
              <span className="text-sm font-medium">Facebook</span>
            </div>
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
            Need more promotion help?
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Contact our support team for marketing advice and featured opportunities.
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

export default HelpPromoteEvents;