import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  Smartphone,
  Users,
  Ticket,
  CheckCircle,
  ExternalLink,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How do I buy tickets?",
    answer:
      "Browse events on Evently, select the event you want to attend, choose your ticket type and quantity, then proceed to checkout. You can pay with card, bank transfer, or mobile money.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Evently accepts: Debit/Credit cards (Visa, Mastercard, Verve), Bank transfers, OPay wallet, and mobile money apps like Kuda and PalmPay. All transactions are secured with 256-bit encryption.",
  },
  {
    question: "Can I buy tickets for someone else?",
    answer:
      "Yes! You can purchase tickets for friends or family. During checkout, enter their details or the attendee information. They'll receive their ticket via email after purchase.",
  },
  {
    question: "When will I receive my ticket after purchase?",
    answer:
      "Your ticket is instantly available in your 'My Tickets' page after purchase. You'll also receive a confirmation email with your QR code within a few minutes.",
  },
  {
    question: "Are there any booking fees?",
    answer:
      "Evently charges a transparent 5% service fee per ticket, shown clearly in the price breakdown before checkout. There are no hidden charges.",
  },
  {
    question: "Can I get a refund if I can't attend?",
    answer:
      "Refund policies vary by organizer. Some events allow refunds up to 48 hours before the event. Check the event's refund policy on the event page before purchasing.",
  },
  {
    question: "What if the event is cancelled?",
    answer:
      "If an organizer cancels an event, you'll automatically receive a full refund within 3-5 business days. You'll also be notified via email.",
  },
  {
    question: "How do I use a discount code?",
    answer:
      "If you have a discount code, enter it at checkout before completing your payment. The discount will be applied to your total automatically.",
  },
];

const PURCHASE_STEPS = [
  {
    step: 1,
    title: "Find an event",
    desc: "Browse or search for events on Evently. Use filters to find events by date, location, or category.",
    icon: Ticket,
  },
  {
    step: 2,
    title: "Select your tickets",
    desc: "Choose the ticket type (e.g., General, VIP) and the number of tickets you need.",
    icon: Users,
  },
  {
    step: 3,
    title: "Proceed to checkout",
    desc: "Review your order, enter your details, and choose your preferred payment method.",
    icon: ShoppingCart,
  },
  {
    step: 4,
    title: "Complete payment",
    desc: "Pay securely using card, bank transfer, or mobile money. Your ticket will be ready instantly.",
    icon: CreditCard,
  },
  {
    step: 5,
    title: "Access your ticket",
    desc: "Find your ticket in 'My Tickets' or check your email. Download the PDF or screenshot your QR code.",
    icon: Smartphone,
  },
];

const HelpPurchaseTickets = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        {/* Back */}
        <Link
          to="/help"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-md">
            <ShoppingCart className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Purchasing Event Tickets
          </h1>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about buying tickets on Evently
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 grid gap-4 sm:grid-cols-2"
        >
          <Link to="/explore" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-md">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Browse Events
                </p>
                <p className="text-xs text-muted-foreground">
                  Find events near you
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
          <Link to="/my-tickets" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-md">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  My Tickets
                </p>
                <p className="text-xs text-muted-foreground">
                  View your purchased tickets
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        </motion.div>

        {/* How to Purchase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            How to Purchase Tickets
          </h2>
          <div className="space-y-4">
            {PURCHASE_STEPS.map((step, i) => (
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

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12 rounded-2xl border border-border/50 bg-card p-6"
        >
          <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-foreground">
            <CreditCard className="h-6 w-6 text-primary" />
            Accepted Payment Methods
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: "Debit/Credit Cards", detail: "Visa, Mastercard, Verve" },
              { name: "Bank Transfer", detail: "Direct bank transfers" },
              { name: "OPay Wallet", detail: "Pay with OPay balance" },
              { name: "Mobile Money", detail: "Kuda, PalmPay, and more" },
            ].map((method) => (
              <div
                key={method.name}
                className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3"
              >
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {method.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{method.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-primary/5 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-xs text-muted-foreground">
              All payments are secured with 256-bit SSL encryption. We never store your card details.
            </p>
          </div>
        </motion.div>

        {/* FAQs */}
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

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center"
        >
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
            Have more questions?
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Contact the event organizer directly or reach our support team.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/help/contact-organizer">
              <Button variant="outline" className="border-border/50">
                Contact Organizer
              </Button>
            </Link>
            <Button className="gradient-primary text-primary-foreground shadow-glow">
              Contact Support
            </Button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpPurchaseTickets;