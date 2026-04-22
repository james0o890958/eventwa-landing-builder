import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  KeyRound,
  Mail,
  Smartphone,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    question: "I can't sign in to my account",
    answer:
      "First, try clearing your browser cache and cookies, then restart your browser. If that doesn't work, use the 'Forgot Password' link on the sign-in page to reset your password. Make sure you're using the correct email address associated with your account.",
  },
  {
    question: "I didn't receive the verification email",
    answer:
      "Verification emails can take up to 10 minutes to arrive. Check your spam/junk folder. If you still haven't received it, click 'Resend Email' on the verification page or contact support@evently.ng with your account email.",
  },
  {
    question: "My account is locked",
    answer:
      "Accounts get locked after 5 failed login attempts. Wait 30 minutes and try again, or use the 'Forgot Password' option to reset your password and unlock your account automatically.",
  },
  {
    question: "I'm having trouble with two-factor authentication",
    answer:
      "Make sure your device's time is synced correctly (2FA codes are time-based). If you lost access to your authenticator app, click 'Use Backup Code' or contact support to verify your identity manually.",
  },
  {
    question: "My password isn't working",
    answer:
      "Passwords are case-sensitive. Check that Caps Lock is off and try copying/pasting your password from a saved password manager. If you've forgotten it, use the 'Forgot Password' link to set a new one.",
  },
  {
    question: "I think my account has been compromised",
    answer:
      "Immediately use the 'Forgot Password' link to change your password. Check your account settings for any unauthorized changes. Contact support@evently.ng immediately and we'll secure your account.",
  },
];

const TROUBLESHOOTING_STEPS = [
  {
    step: 1,
    title: "Clear your browser cache and cookies",
    desc: "Go to your browser settings and clear cache and cookies for Evently. Then restart your browser.",
    icon: RefreshCw,
  },
  {
    step: 2,
    title: "Use the 'Forgot Password' link",
    desc: "On the sign-in page, click 'Forgot Password?' and enter your email to receive a reset link.",
    icon: KeyRound,
  },
  {
    step: 3,
    title: "Check your email for the reset link",
    desc: "The password reset link is valid for 1 hour. If you don't see it, check your spam folder.",
    icon: Mail,
  },
  {
    step: 4,
    title: "Create a new password",
    desc: "Follow the link in the email and set a new strong password. Try signing in again.",
    icon: Lock,
  },
];

const HelpTroubleshooting = () => {
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-md">
            <KeyRound className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Trouble Signing In?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Follow these steps to regain access to your Evently account
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 grid gap-4 sm:grid-cols-2"
        >
          <Link to="/auth" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Sign In
                </p>
                <p className="text-xs text-muted-foreground">
                  Go to sign-in page
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
          <Link to="/reset-password" className="group">
            <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md">
                <KeyRound className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Reset Password
                </p>
                <p className="text-xs text-muted-foreground">
                  Get a reset link via email
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        </motion.div>

        {/* Troubleshooting Steps */}
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
            {TROUBLESHOOTING_STEPS.map((step, i) => (
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
            Still having trouble?
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Our support team is available 7 days a week to help you regain access to your account.
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

export default HelpTroubleshooting;