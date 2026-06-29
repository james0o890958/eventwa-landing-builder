import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  DollarSign,
  ExternalLink,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Percent,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How do I set ticket prices?",
    answer:
      "When creating or editing your event, go to 'Tickets' and add ticket tiers (e.g., General, VIP). Set a price for each tier. You can also create early bird discounts.",
  },
  {
    question: "When do I receive my earnings?",
    answer:
      "Payouts are processed 2-3 business days after your event ends. Funds are transferred directly to your registered bank account.",
  },
  {
    question: "What fees does Evently charge?",
    answer:
      "Evently offers three plans: Free (5% per ticket), Pro at ₦5,000/month (3% per ticket), and Premium at ₦15,000/month (1.5% per ticket).",
  },
  {
    question: "Can I offer free tickets?",
    answer:
      "Yes! You can set tickets to free (₦0). Great for community events, charity events, or lead generation. Evently still charges a small fee per ticket.",
  },
  {
    question: "How do I add a promo code or discount?",
    answer:
      "In your event settings, go to 'Discounts' and create a promo code. Set a percentage or fixed amount discount, and optionally limit usage.",
  },
  {
    question: "What payment methods can attendees use?",
    answer:
      "Attendees can pay with Debit/Credit cards, Bank transfer, OPay wallet, and mobile money. All transactions are secured with 256-bit encryption.",
  },
  {
    question: "Can I charge different prices for different ticket types?",
    answer:
      "Yes! Create multiple ticket tiers with different prices. Common tiers include Early Bird, General Admission, VIP, and Table bookings.",
  },
  {
    question: "What if someone requests a refund?",
    answer:
      "You can approve or deny refund requests from the Orders section. If approved, the refund is processed automatically within 3-5 business days.",
  },
];

const STEPS = [
  {
    step: 1,
    title: "Set your ticket prices",
    desc: "Create ticket tiers with different price points (e.g., General, VIP).",
    icon: DollarSign,
  },
  {
    step: 2,
    title: "Choose your pricing plan",
    desc: "Compare Evently's plans and pick the one that works for your event size.",
    icon: Percent,
  },
  {
    step: 3,
    title: "Add early bird or group discounts",
    desc: "Create promo codes or time-limited discounts to boost early sales.",
    icon: TrendingUp,
  },
  {
    step: 4,
    title: "Monitor ticket sales and revenue",
    desc: "Track earnings in real-time from your Organizer Dashboard.",
    icon: CreditCard,
  },
  {
    step: 5,
    title: "Receive your payout",
    desc: "Get paid directly to your bank account 2-3 days after the event.",
    icon: Zap,
  },
];

const HelpMonetizeEvents = () => {
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Monetizing Your Events
          </h1>
          <p className="mt-3 text-muted-foreground">
            How to set prices, earn revenue, and manage payments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 grid gap-4 sm:grid-cols-2"
        >
          <Link to="/organizer/pricing" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md">
                <Percent className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  View Pricing Plans
                </p>
                <p className="text-xs text-muted-foreground">
                  Compare Evently's plans and fees
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
          <Link to="/organizer/create-event" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Create an Event
                </p>
                <p className="text-xs text-muted-foreground">
                  Set up tickets and start selling
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
            Contact our support team for monetization and payout assistance.
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

export default HelpMonetizeEvents;