import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  X,
  Zap,
  ArrowRight,
  HelpCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Plan data ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Free",
    price: { monthly: "₦0", annual: "₦0" },
    commission: "5%",
    desc: "Perfect for individuals trying out event hosting",
    highlight: false,
    badge: null,
    features: [
      { text: "Up to 3 events per month", included: true },
      { text: "Basic attendee management", included: true },
      { text: "Standard event page", included: true },
      { text: "Email support", included: true },
      { text: "Ticket QR codes", included: true },
      { text: "5% commission per ticket", included: true },
      { text: "Advanced analytics", included: false },
      { text: "Custom branding", included: false },
      { text: "Featured listing", included: false },
      { text: "Priority support", included: false },
      { text: "Promotional tools", included: false },
      { text: "API access", included: false },
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: { monthly: "₦5,000", annual: "₦48,000" },
    commission: "3%",
    desc: "For growing organizers who need more power",
    highlight: true,
    badge: "Most Popular",
    features: [
      { text: "Unlimited events", included: true },
      { text: "Advanced attendee management", included: true },
      { text: "Custom event page", included: true },
      { text: "Priority support", included: true },
      { text: "Ticket QR codes", included: true },
      { text: "3% commission per ticket", included: true },
      { text: "Advanced analytics dashboard", included: true },
      { text: "Custom branding", included: true },
      { text: "Featured listing (2/month)", included: true },
      { text: "Promotional tools", included: true },
      { text: "Attendee CSV export", included: true },
      { text: "API access", included: false },
    ],
    cta: "Start Pro",
    ctaVariant: "primary" as const,
  },
  {
    name: "Premium",
    price: { monthly: "₦15,000", annual: "₦144,000" },
    commission: "1.5%",
    desc: "For large-scale organizers and enterprises",
    highlight: false,
    badge: "Best Value",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom domain", included: true },
      { text: "24/7 phone support", included: true },
      { text: "Ticket QR codes", included: true },
      { text: "1.5% commission per ticket", included: true },
      { text: "White-label analytics", included: true },
      { text: "Full custom branding", included: true },
      { text: "Unlimited featured listings", included: true },
      { text: "Advanced promotional tools", included: true },
      { text: "Attendee CSV export", included: true },
      { text: "API access", included: true },
    ],
    cta: "Go Premium",
    ctaVariant: "outline" as const,
  },
];

const COMMISSION_TIERS = [
  {
    range: "₦0 – ₦500,000",
    free: "5%",
    pro: "3%",
    premium: "1.5%",
  },
  {
    range: "₦500,001 – ₦2,000,000",
    free: "5%",
    pro: "2.5%",
    premium: "1.2%",
  },
  {
    range: "₦2,000,001 – ₦10,000,000",
    free: "5%",
    pro: "2%",
    premium: "1%",
  },
  {
    range: "₦10,000,001+",
    free: "Contact Us",
    pro: "1.5%",
    premium: "0.8%",
  },
];

const FAQS = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades apply at your next billing cycle.",
  },
  {
    q: "What does the commission fee cover?",
    a: "The commission covers payment processing, fraud protection, customer support for ticket buyers, and platform infrastructure. There are no additional hidden fees.",
  },
  {
    q: "Do free events still incur a commission?",
    a: "No. If your event is completely free (₦0 tickets), there is no commission charged regardless of your plan.",
  },
  {
    q: "How quickly are funds paid out?",
    a: "Funds are settled to your bank account within 2-3 business days after your event ends. Pro and Premium organizers get next-day settlement.",
  },
  {
    q: "Is there a setup fee or long-term contract?",
    a: "Absolutely not. All plans are month-to-month with no setup fees. Annual billing offers a significant discount with no lock-in.",
  },
  {
    q: "What payment methods can I accept from attendees?",
    a: "Evently supports all major Nigerian payment options: OPay, Kuda, PalmPay, Flutterwave, bank transfer, Visa, Mastercard, and Verve cards.",
  },
  {
    q: "Can I offer discount codes or promo pricing?",
    a: "Yes! Pro and Premium plans include the ability to create unlimited promo codes and early-bird pricing tiers for your events.",
  },
  {
    q: "What happens to my events if I cancel my subscription?",
    a: "Your published events remain live and accessible. You'll revert to the Free plan limits for new events, but existing events and ticket data are never deleted.",
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

const Pricing = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-5 inline-block rounded-full gradient-primary px-5 py-1.5 text-sm font-semibold text-primary-foreground shadow-glow">
              💳 Pricing
            </span>
            <h1 className="mb-4 font-display text-5xl font-bold text-foreground sm:text-6xl">
              Simple,{" "}
              <span className="text-gradient">Transparent</span> Pricing
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
              Start for free, upgrade when you're ready. No hidden fees, no
              surprises — just tools to help you host better events.
            </p>

            {/* Billing toggle */}
            <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-border/50 bg-secondary p-1.5">
              <button
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  billing === "monthly"
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  billing === "annual"
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annual
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-500">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>

          {/* ── Plan cards ──────────────────────────────────────────────── */}
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`relative flex flex-col overflow-hidden rounded-3xl border p-8 shadow-card transition-all ${
                  plan.highlight
                    ? "border-primary bg-card ring-2 ring-primary/30 scale-105"
                    : "border-border/50 bg-card hover:border-primary/30"
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className={`absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-bold ${
                      plan.highlight
                        ? "gradient-primary text-primary-foreground shadow-glow"
                        : "bg-amber-500/20 text-amber-500"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6 text-left">
                  <h2 className="font-display text-2xl font-bold text-foreground">
                    {plan.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.desc}
                  </p>
                  <div className="mt-5">
                    <span className="font-display text-4xl font-bold text-foreground">
                      {billing === "monthly"
                        ? plan.price.monthly
                        : plan.price.annual}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      /{billing === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Zap className="h-3 w-3" />
                    {plan.commission} per ticket sold
                  </div>
                </div>

                {/* CTA */}
                <Button
                  onClick={() => navigate("/organizer/create-event")}
                  className={`mb-7 w-full ${
                    plan.highlight
                      ? "gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                      : "border border-border/50 bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {/* Feature list */}
                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2.5">
                      {feature.included ? (
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground/50 line-through"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Commission tiers ──────────────────────────────────────────────── */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Commission Tiers
            </h2>
            <p className="mt-3 text-muted-foreground">
              The more you sell, the less you pay. Volume-based discounts apply
              automatically.
            </p>
          </motion.div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
            {/* Table header */}
            <div className="grid grid-cols-4 border-b border-border/50 bg-secondary/50 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Revenue Range</span>
              <span className="text-center">Free</span>
              <span className="text-center text-primary">Pro</span>
              <span className="text-center">Premium</span>
            </div>

            {/* Table rows */}
            {COMMISSION_TIERS.map((tier, i) => (
              <motion.div
                key={tier.range}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`grid grid-cols-4 items-center px-5 py-4 transition-colors hover:bg-secondary/30 ${
                  i < COMMISSION_TIERS.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                <span className="text-sm font-medium text-foreground">
                  {tier.range}
                </span>
                <span className="text-center text-sm text-muted-foreground">
                  {tier.free}
                </span>
                <span className="text-center text-sm font-semibold text-primary">
                  {tier.pro}
                </span>
                <span className="text-center text-sm text-muted-foreground">
                  {tier.premium}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            * Free events (₦0 ticket price) are never charged a commission on
            any plan.
          </p>
        </div>
      </section>

      {/* ── Feature comparison table ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground">
              Full Plan Comparison
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything side by side so you can make the right choice
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-border/50 bg-secondary/50 px-6 py-5">
              <span className="text-sm font-semibold text-foreground">
                Feature
              </span>
              {PLANS.map((p) => (
                <span
                  key={p.name}
                  className={`text-center text-sm font-bold ${p.highlight ? "text-primary" : "text-foreground"}`}
                >
                  {p.name}
                </span>
              ))}
            </div>

            {[
              {
                category: "Events",
                rows: [
                  { feature: "Events per month", values: ["3", "Unlimited", "Unlimited"] },
                  { feature: "Attendees per event", values: ["500", "5,000", "Unlimited"] },
                  { feature: "Ticket types", values: ["2", "10", "Unlimited"] },
                  { feature: "Free events", values: ["✓", "✓", "✓"] },
                ],
              },
              {
                category: "Ticketing",
                rows: [
                  { feature: "QR code tickets", values: ["✓", "✓", "✓"] },
                  { feature: "Promo codes", values: ["—", "✓", "✓"] },
                  { feature: "Early bird pricing", values: ["—", "✓", "✓"] },
                  { feature: "Ticket transfers", values: ["—", "✓", "✓"] },
                  { feature: "Ticket resale", values: ["—", "—", "✓"] },
                ],
              },
              {
                category: "Marketing",
                rows: [
                  { feature: "Featured listing", values: ["—", "2/month", "Unlimited"] },
                  { feature: "Sponsored placement", values: ["—", "—", "✓"] },
                  { feature: "Email campaigns", values: ["—", "✓", "✓"] },
                  { feature: "Social sharing tools", values: ["✓", "✓", "✓"] },
                ],
              },
              {
                category: "Analytics",
                rows: [
                  { feature: "Basic sales report", values: ["✓", "✓", "✓"] },
                  { feature: "Advanced dashboard", values: ["—", "✓", "✓"] },
                  { feature: "Attendee insights", values: ["—", "✓", "✓"] },
                  { feature: "Revenue forecasting", values: ["—", "—", "✓"] },
                ],
              },
              {
                category: "Support",
                rows: [
                  { feature: "Email support", values: ["✓", "✓", "✓"] },
                  { feature: "Priority support", values: ["—", "✓", "✓"] },
                  { feature: "Dedicated manager", values: ["—", "—", "✓"] },
                  { feature: "24/7 phone support", values: ["—", "—", "✓"] },
                ],
              },
            ].map((section, si) => (
              <div key={section.category}>
                <div className="bg-secondary/30 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/30">
                  {section.category}
                </div>
                {section.rows.map((row, ri) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-4 items-center px-6 py-3.5 transition-colors hover:bg-secondary/20 ${
                      ri < section.rows.length - 1
                        ? "border-b border-border/20"
                        : ""
                    }`}
                  >
                    <span className="text-sm text-foreground">
                      {row.feature}
                    </span>
                    {row.values.map((val, vi) => (
                      <span
                        key={vi}
                        className={`text-center text-sm ${
                          val === "—"
                            ? "text-muted-foreground/30"
                            : val === "✓"
                              ? "text-emerald-500 font-bold"
                              : vi === 1
                                ? "font-medium text-primary"
                                : "text-foreground"
                        }`}
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto max-w-3xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <HelpCircle className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="font-display text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about Evently pricing
            </p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-secondary/30"
                >
                  <span className="font-medium text-foreground text-sm pr-4">
                    {faq.q}
                  </span>
                  <span
                    className={`shrink-0 text-primary text-lg font-bold transition-transform duration-200 ${
                      openFaq === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="border-t border-border/30 px-5 py-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl gradient-primary p-12 text-center shadow-glow"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h2 className="mb-4 font-display text-4xl font-bold text-white">
                Start for Free Today
              </h2>
              <p className="mb-8 text-lg text-white/70">
                No credit card required. Create your first event in minutes and
                upgrade only when you're ready.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate("/organizer/create-event")}
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
                    Talk to Sales
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

export default Pricing;
