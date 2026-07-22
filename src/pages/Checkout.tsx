import { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Ticket,
  Tag,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { mockEvents } from "@/data/mockEvents";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const PROMO_CODES: Record<string, number> = {
  EVENTLY10: 10,
  LAGOS20: 20,
  FIRSTTIME: 15,
};

const PAYMENT_METHODS = [
  {
    id: "opay",
    label: "OPay",
    icon: Smartphone,
    desc: "Pay with OPay wallet or USSD",
  },
  {
    id: "card",
    label: "Debit / Credit Card",
    icon: CreditCard,
    desc: "Visa, Mastercard, Verve",
  },
  {
    id: "transfer",
    label: "Bank Transfer",
    icon: Building2,
    desc: "Direct bank transfer",
  },
  {
    id: "kuda",
    label: "Kuda / PalmPay",
    icon: Smartphone,
    desc: "Pay via mobile money",
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const eventId = searchParams.get("eventId") ?? "1";
  const ticketTypeName = searchParams.get("ticketType") ?? "";
  const initialQty = Number(searchParams.get("qty") ?? "1");

  const event = mockEvents.find((e) => e.id === eventId);
  const ticketTypeIndex = event?.ticketTypes?.findIndex(
    (t) => t.name === ticketTypeName,
  ) ?? 0;
  const ticketType = event?.ticketTypes?.[ticketTypeIndex >= 0 ? ticketTypeIndex : 0];
  const unitPrice = ticketType?.price ?? event?.price ?? 0;

  const hasEnded = useMemo(() => {
    if (!event) return false;
    const endStr = event.end_date || event.start_date || event.date;
    if (!endStr) return false;
    const endDate = new Date(endStr);
    return !isNaN(endDate.getTime()) && endDate < new Date();
  }, [event]);

  // ── state ───────────────────────────────────────────────────────────────────
  const [qty, setQty] = useState(Math.max(1, initialQty));
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("opay");
  const [showOrderSummary, setShowOrderSummary] = useState(true);
  const [processing, setProcessing] = useState(false);

  // ── card details (for card payment) ────────────────────────────────────────
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // ── billing info ────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState(
    user?.user_metadata?.display_name?.split(" ")[0] ?? "",
  );
  const [lastName, setLastName] = useState(
    user?.user_metadata?.display_name?.split(" ").slice(1).join(" ") ?? "",
  );
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Event not found
            </h1>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (hasEnded) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">
              This event has ended
            </h1>
            <p className="text-muted-foreground mt-2">
              Registration for this event is closed because the event date has passed.
            </p>
            <Link to={`/event/${eventId}`} className="mt-4 inline-block text-primary hover:underline font-semibold">
              Back to Event Details
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── price calculations ──────────────────────────────────────────────────────
  const subtotal = unitPrice * qty;
  const discountPct = appliedPromo?.discount ?? 0;
  const discountAmount = Math.round((subtotal * discountPct) / 100);
  const serviceFee = subtotal > 0 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discountAmount + serviceFee;

  // ── promo code ──────────────────────────────────────────────────────────────
  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (!code) return;
    if (appliedPromo?.code === code) {
      setPromoError("This code is already applied.");
      return;
    }
    const discount = PROMO_CODES[code];
    if (discount) {
      setAppliedPromo({ code, discount });
      setPromoError("");
      toast(`Promo code applied — ${discount}% off! 🎉`);
    } else {
      setPromoError("Invalid or expired promo code.");
    }
  };

  // ── place order ─────────────────────────────────────────────────────────────
  const handleCheckout = async () => {
    if (!firstName || !lastName || !email || !phone) {
      toast.error("Please fill in all contact details.");
      return;
    }
    if (selectedPayment === "card" && (!cardNumber || !cardExpiry || !cardCvv || !cardName)) {
      toast.error("Please fill in your card details.");
      return;
    }

    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessing(false);

    // Generate a mock ticket ID and navigate to confirmation
    const ticketId = `EVT-${Date.now().toString(36).toUpperCase()}`;
    navigate(
      `/ticket-confirmation?ticketId=${ticketId}&eventId=${eventId}&qty=${qty}&total=${total}`,
    );
  };

  // ── card number formatter ───────────────────────────────────────────────────
  const formatCardNumber = (val: string) =>
    val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Back */}
        <Link
          to={`/event/${eventId}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to event
        </Link>

        <h1 className="mb-8 font-display text-3xl font-bold text-foreground">
          Checkout
        </h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── LEFT: Forms ───────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/50 bg-card p-6 shadow-card"
            >
              <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
                Contact Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground">First Name</Label>
                  <Input
                    placeholder="Emeka"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-secondary border-border/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground">Last Name</Label>
                  <Input
                    placeholder="Okonkwo"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-secondary border-border/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary border-border/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-secondary border-border/50"
                  />
                </div>
              </div>
            </motion.div>

            {/* Ticket Quantity */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border border-border/50 bg-card p-6 shadow-card"
            >
              <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
                Ticket Details
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                    <Ticket className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {ticketType?.name ?? "General Admission"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₦{unitPrice.toLocaleString()} per ticket
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 text-foreground hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-6 text-center font-semibold text-foreground">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 text-foreground hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Promo Code */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border/50 bg-card p-6 shadow-card"
            >
              <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
                Promo Code{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  (optional)
                </span>
              </h2>

              {appliedPromo ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">
                      {appliedPromo.code} — {appliedPromo.discount}% off applied
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedPromo(null);
                      setPromoCode("");
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        setPromoError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                      className="pl-10 bg-secondary border-border/50 uppercase"
                    />
                  </div>
                  <Button
                    onClick={applyPromo}
                    variant="outline"
                    className="border-border/50 shrink-0"
                  >
                    Apply
                  </Button>
                </div>
              )}
              {promoError && (
                <p className="mt-2 text-xs text-destructive">{promoError}</p>
              )}
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-border/50 bg-card p-6 shadow-card"
            >
              <h2 className="mb-5 font-display text-lg font-semibold text-foreground">
                Payment Method
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                      selectedPayment === method.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border/50 hover:border-primary/40"
                    }`}
                  >
                    <method.icon
                      className={`h-5 w-5 mt-0.5 shrink-0 ${
                        selectedPayment === method.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {method.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {method.desc}
                      </p>
                    </div>
                    {selectedPayment === method.id && (
                      <CheckCircle2 className="ml-auto h-4 w-4 text-primary shrink-0 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>

              {/* Card details */}
              <AnimatePresence>
                {selectedPayment === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-5 space-y-4 overflow-hidden"
                  >
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground">
                        Name on Card
                      </Label>
                      <Input
                        placeholder="Emeka Okonkwo"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="bg-secondary border-border/50"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm text-foreground">
                        Card Number
                      </Label>
                      <Input
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        className="bg-secondary border-border/50 font-mono"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm text-foreground">
                          Expiry Date
                        </Label>
                        <Input
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) =>
                            setCardExpiry(formatExpiry(e.target.value))
                          }
                          className="bg-secondary border-border/50 font-mono"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm text-foreground">CVV</Label>
                        <Input
                          placeholder="123"
                          type="password"
                          value={cardCvv}
                          onChange={(e) =>
                            setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                          }
                          className="bg-secondary border-border/50 font-mono"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── RIGHT: Order Summary ──────────────────────────────────────── */}
          <div>
            <div className="sticky top-20">
              {/* Event summary */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden"
              >
                <div className="relative h-32">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-foreground line-clamp-2 text-sm">
                    {event.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {event.time}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                    {event.location}
                  </p>
                </div>
              </motion.div>

              {/* Price breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="rounded-2xl border border-border/50 bg-card p-5 shadow-card"
              >
                {/* Collapsible summary header */}
                <button
                  onClick={() => setShowOrderSummary((v) => !v)}
                  className="flex w-full items-center justify-between mb-4"
                >
                  <span className="font-display font-semibold text-foreground text-sm">
                    Order Summary
                  </span>
                  {showOrderSummary ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {showOrderSummary && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {ticketType?.name ?? "General"} × {qty}
                          </span>
                          <span className="text-foreground">
                            ₦{subtotal.toLocaleString()}
                          </span>
                        </div>
                        {appliedPromo && (
                          <div className="flex justify-between text-emerald-600">
                            <span>
                              Promo ({appliedPromo.code}) −
                              {appliedPromo.discount}%
                            </span>
                            <span>−₦{discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Service fee (5%)
                          </span>
                          <span className="text-foreground">
                            ₦{serviceFee.toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-border/50 pt-3" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mb-5">
                  <span className="font-display font-bold text-foreground">
                    Total
                  </span>
                  <span className="font-display text-2xl font-bold text-foreground">
                    {total === 0 ? "Free" : `₦${total.toLocaleString()}`}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-6 text-base font-semibold disabled:opacity-60"
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing…
                    </span>
                  ) : total === 0 ? (
                    "Confirm Registration"
                  ) : (
                    `Pay ₦${total.toLocaleString()}`
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                  Secured by Evently Pay — 256-bit encryption
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
