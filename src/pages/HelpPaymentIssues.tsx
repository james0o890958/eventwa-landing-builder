import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  DollarSign,
  ShieldCheck,
  Building2,
  Smartphone,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Why was my payment declined?",
    answer:
      "Payment declines can happen for several reasons: insufficient funds, card expired, wrong card details, or your bank blocking online transactions. Try a different payment method or contact your bank.",
  },
  {
    question: "How long does a refund take?",
    answer:
      "Refunds are processed within 24-48 hours of approval. Card payments take 3-5 business days, bank transfers 1-2 days, and mobile wallets are instant to 24 hours.",
  },
  {
    question: "I was charged but didn't get my ticket",
    answer:
      "Check your email for a confirmation. If you don't see one, visit /help/find-tickets to retrieve your ticket. If still no ticket, contact support with your payment reference.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Refund policies depend on the organizer. Generally, refunds are available up to 48 hours before the event. If the event is cancelled, you'll receive a full refund automatically.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Evently accepts Debit/Credit cards (Visa, Mastercard, Verve), Bank transfers, OPay wallet, and mobile money apps like Kuda and PalmPay.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes! All transactions are secured with 256-bit SSL encryption. We are PCI-DSS compliant and never store your card details on our servers.",
  },
  {
    question: "How do I request a refund?",
    answer:
      "Go to your ticket details and click 'Request Refund'. If the option isn't available, the refund period has passed or the organizer doesn't allow refunds.",
  },
  {
    question: "I was double-charged for my ticket",
    answer:
      "Contact support immediately with your payment reference. We'll investigate and refund any duplicate charges within 24 hours.",
  },
];

const STEPS = [
  {
    step: 1,
    title: "Check your payment method",
    desc: "Ensure your card has sufficient funds and online transactions are enabled.",
    icon: CreditCard,
  },
  {
    step: 2,
    title: "Try a different payment method",
    desc: "If one method fails, try OPay, bank transfer, or a different card.",
    icon: RefreshCw,
  },
  {
    step: 3,
    title: "Contact your bank",
    desc: "Some banks block online payments by default. Call to enable.",
    icon: Building2,
  },
  {
    step: 4,
    title: "Save your payment info",
    desc: "Create an account to save payment methods for faster checkout.",
    icon: ShieldCheck,
  },
  {
    step: 5,
    title: "Contact support if issue persists",
    desc: "Our team can help troubleshoot and process manual payments.",
    icon: Smartphone,
  },
];

const HelpPaymentIssues = () => {
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Payment Issues
          </h1>
          <p className="mt-3 text-muted-foreground">
            Troubleshoot payment problems and request refunds
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 grid gap-4 sm:grid-cols-2"
        >
          <Link to="/my-tickets" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  View My Tickets
                </p>
                <p className="text-xs text-muted-foreground">
                  Access your purchased tickets
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
          <Link to="/help/find-tickets" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-md">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Find Lost Tickets
                </p>
                <p className="text-xs text-muted-foreground">
                  Retrieve tickets by email
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
            Troubleshooting Steps
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
            Still having payment issues?
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Contact our support team with your payment reference number.
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

export default HelpPaymentIssues;