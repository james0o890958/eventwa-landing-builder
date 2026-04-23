import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Image,
  Users,
  DollarSign,
  Plus,
  Trash2,
  CheckCircle2,
  Ticket,
  FileText,
  Wifi,
  WifiOff,
  Handshake,
  Shirt,
  UtensilsCrossed,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/mockEvents";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TicketTier {
  id: string;
  name: string;
  price: string;
  quantity: string;
  description: string;
}

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

interface FormData {
  // Step 1 — Basic Info
  title: string;
  description: string;
  category: string;
  tags: string;

  // Step 2 — Date & Location
  date: string;
  time: string;
  endDate: string;
  endTime: string;
  locationType: "physical" | "online";
  location: string;
  onlineLink: string;

  // Step 3 — Tickets
  isFree: boolean;
  ticketTiers: TicketTier[];
  totalCapacity: string;

  // Step 4 — Media & Extras
  bannerUrl: string;
  websiteUrl: string;
  openForSponsorship: boolean;
  sponsorshipDetails: string;
  agenda: AgendaItem[];
  rules: string;

  // Dress code
  dressCodeType: "none" | "color" | "image";
  dressCodeColor: string;
  dressCodeNote: string;
  dressCodeImageUrl: string;

  // Meals
  mealsProvided: boolean;
  mealOptions: string[];
  mealNotes: string;
}

// ─── Steps config ─────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Basic Info", icon: FileText },
  { id: 2, label: "Date & Location", icon: MapPin },
  { id: 3, label: "Tickets", icon: Ticket },
  { id: 4, label: "Media & Extras", icon: Image },
];

// ─── Default state ────────────────────────────────────────────────────────────

const DEFAULT_TICKET: TicketTier = {
  id: "t1",
  name: "General Admission",
  price: "",
  quantity: "",
  description: "",
};

const MEAL_PRESETS = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Buffet",
  "Cocktails",
  "Vegetarian",
  "Vegan",
  "Halal",
  "Gluten-Free",
];

const INITIAL: FormData = {
  title: "",
  description: "",
  category: "",
  tags: "",
  date: "",
  time: "",
  endDate: "",
  endTime: "",
  locationType: "physical",
  location: "",
  onlineLink: "",
  isFree: false,
  ticketTiers: [{ ...DEFAULT_TICKET }],
  totalCapacity: "",
  bannerUrl: "",
  websiteUrl: "",
  openForSponsorship: false,
  sponsorshipDetails: "",
  agenda: [
    {
      id: "a1",
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    },
  ],
  rules: "",
  dressCodeType: "none",
  dressCodeColor: "#1a1a1a",
  dressCodeNote: "",
  dressCodeImageUrl: "",
  mealsProvided: false,
  mealOptions: [],
  mealNotes: "",
};

// ─── Main component ───────────────────────────────────────────────────────────

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof FormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }));

  // ── Step validation ────────────────────────────────────────────────────────

  const validateStep = (s: number) => {
    if (s === 1) {
      if (!form.title.trim()) { toast.error("Event title is required."); return false; }
      if (!form.description.trim()) { toast.error("Event description is required."); return false; }
      if (!form.category) { toast.error("Please select a category."); return false; }
    }
    if (s === 2) {
      if (!form.date) { toast.error("Event date is required."); return false; }
      if (!form.time) { toast.error("Event time is required."); return false; }
      if (form.locationType === "physical" && !form.location.trim()) {
        toast.error("Venue address is required for physical events.");
        return false;
      }
      if (form.locationType === "online" && !form.onlineLink.trim()) {
        toast.error("Online link is required for online events.");
        return false;
      }
    }
    if (s === 3) {
      if (!form.isFree) {
        for (const t of form.ticketTiers) {
          if (!t.name.trim()) { toast.error("All ticket tiers need a name."); return false; }
          if (!t.price || isNaN(Number(t.price)) || Number(t.price) < 0) {
            toast.error("Please enter a valid price for each ticket tier.");
            return false;
          }
          if (!t.quantity || isNaN(Number(t.quantity)) || Number(t.quantity) < 1) {
            toast.error("Please enter a valid quantity for each ticket tier.");
            return false;
          }
        }
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(4, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Ticket tiers ───────────────────────────────────────────────────────────

  const addTier = () =>
    set("ticketTiers", [
      ...form.ticketTiers,
      {
        id: `t${Date.now()}`,
        name: "",
        price: "",
        quantity: "",
        description: "",
      },
    ]);

  const removeTier = (id: string) =>
    set(
      "ticketTiers",
      form.ticketTiers.filter((t) => t.id !== id),
    );

  const updateTier = (id: string, field: keyof TicketTier, value: string) =>
    set(
      "ticketTiers",
      form.ticketTiers.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );

  // ── Agenda ─────────────────────────────────────────────────────────────────

  const addAgendaItem = () =>
    set("agenda", [...form.agenda, { time: "", title: "", description: "" }]);

  const updateAgenda = (
    index: number,
    field: "time" | "title" | "description",
    value: string,
  ) =>
    set(
      "agenda",
      form.agenda.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
    );

  const removeAgenda = (index: number) =>
    set(
      "agenda",
      form.agenda.filter((_, i) => i !== index),
    );

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    toast.success("Event created successfully! 🎉", {
      description: "Your event is now live on Evently.",
    });
    navigate("/organizer/dashboard");
  };

  // ── Field helpers ──────────────────────────────────────────────────────────

  const field = (
    label: string,
    children: React.ReactNode,
    hint?: string,
    required = false,
  ) => (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  const inputCls = "bg-secondary border-border/50 text-foreground placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        {/* Back */}
        <Link
          to="/organizer/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="mb-2 font-display text-4xl font-bold text-foreground">
          Create Event
        </h1>
        <p className="mb-10 text-muted-foreground">
          Fill in the details below to publish your event on Evently.
        </p>

        {/* Step indicator */}
        <div className="mb-10 flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center">
              <button
                onClick={() => step > s.id && setStep(s.id)}
                className={`flex flex-col items-center gap-1 ${step > s.id ? "cursor-pointer" : "cursor-default"}`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    step === s.id
                      ? "gradient-primary border-primary text-primary-foreground shadow-glow"
                      : step > s.id
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-border/50 bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s.id ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    step === s.id ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 mx-2 h-px transition-all ${
                    step > s.id ? "bg-primary" : "bg-border/50"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── Step 1: Basic Info ──────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-6 rounded-2xl border border-border/50 bg-card p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Basic Information
                </h2>

                {field(
                  "Event Title",
                  <Input
                    placeholder="e.g. Burna Boy Live in Lagos"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    className={inputCls}
                    maxLength={100}
                  />,
                  `${form.title.length}/100 characters`,
                  true,
                )}

                {field(
                  "Description",
                  <Textarea
                    placeholder="Tell attendees what makes this event special…"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className={`${inputCls} resize-none`}
                    rows={5}
                    maxLength={2000}
                  />,
                  `${form.description.length}/2000 characters`,
                  true,
                )}

                {field(
                  "Category",
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => set("category", cat.id)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                          form.category === cat.id
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/50 hover:border-primary/40"
                        }`}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-xs font-medium text-foreground">
                          {cat.label}
                        </span>
                      </button>
                    ))}
                  </div>,
                  undefined,
                  true,
                )}

                {field(
                  "Tags",
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="afrobeats, lagos, nightlife (comma-separated)"
                      value={form.tags}
                      onChange={(e) => set("tags", e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>,
                  "Add up to 5 tags to help people discover your event.",
                )}
              </div>
            )}

            {/* ── Step 2: Date & Location ─────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6 rounded-2xl border border-border/50 bg-card p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Date & Location
                </h2>

                {/* Date / Time */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {field(
                    "Start Date",
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        value={form.date}
                        onChange={(e) => set("date", e.target.value)}
                        className={`${inputCls} pl-10`}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>,
                    undefined,
                    true,
                  )}

                  {field(
                    "Start Time",
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="time"
                        value={form.time}
                        onChange={(e) => set("time", e.target.value)}
                        className={`${inputCls} pl-10`}
                      />
                    </div>,
                    undefined,
                    true,
                  )}

                  {field(
                    "End Date",
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="date"
                        value={form.endDate}
                        onChange={(e) => set("endDate", e.target.value)}
                        className={`${inputCls} pl-10`}
                        min={form.date || new Date().toISOString().split("T")[0]}
                      />
                    </div>,
                    "Leave blank for single-day events.",
                  )}

                  {field(
                    "End Time",
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="time"
                        value={form.endTime}
                        onChange={(e) => set("endTime", e.target.value)}
                        className={`${inputCls} pl-10`}
                      />
                    </div>,
                  )}
                </div>

                {/* Location type toggle */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-foreground">
                    Event Type <span className="text-destructive">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "physical" as const,
                        icon: WifiOff,
                        label: "Physical Event",
                        desc: "In-person venue",
                      },
                      {
                        value: "online" as const,
                        icon: Wifi,
                        label: "Online Event",
                        desc: "Virtual/livestream",
                      },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => set("locationType", opt.value)}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                          form.locationType === opt.value
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border/50 hover:border-primary/40"
                        }`}
                      >
                        <opt.icon
                          className={`h-5 w-5 mt-0.5 shrink-0 ${
                            form.locationType === opt.value
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {opt.label}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Physical or Online fields */}
                <AnimatePresence mode="wait">
                  {form.locationType === "physical" ? (
                    <motion.div
                      key="physical"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {field(
                        "Venue / Address",
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="e.g. Eko Convention Centre, Victoria Island, Lagos"
                            value={form.location}
                            onChange={(e) => set("location", e.target.value)}
                            className={`${inputCls} pl-10`}
                          />
                        </div>,
                        "Enter the full venue name and address.",
                        true,
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="online"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {field(
                        "Online Link",
                        <div className="relative">
                          <Wifi className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="https://zoom.us/j/... or YouTube Live link"
                            value={form.onlineLink}
                            onChange={(e) => set("onlineLink", e.target.value)}
                            className={`${inputCls} pl-10`}
                          />
                        </div>,
                        "This link will be shared with ticket holders only.",
                        true,
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── Step 3: Tickets ─────────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-6 rounded-2xl border border-border/50 bg-card p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  Tickets & Pricing
                </h2>

                {/* Free toggle */}
                <div className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/50 p-4">
                  <div>
                    <p className="font-medium text-foreground">Free Event</p>
                    <p className="text-xs text-muted-foreground">
                      No ticket price — attendees register for free
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => set("isFree", !form.isFree)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      form.isFree ? "bg-primary" : "bg-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        form.isFree ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Ticket tiers (only if paid) */}
                <AnimatePresence>
                  {!form.isFree && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-4"
                    >
                      {form.ticketTiers.map((tier, i) => (
                        <div
                          key={tier.id}
                          className="relative rounded-xl border border-border/50 bg-secondary/30 p-4"
                        >
                          {/* Remove button */}
                          {form.ticketTiers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTier(tier.id)}
                              className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}

                          <p className="mb-3 text-sm font-semibold text-foreground">
                            Ticket Tier {i + 1}
                          </p>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">
                                Tier Name *
                              </Label>
                              <Input
                                placeholder="e.g. General, VIP, Early Bird"
                                value={tier.name}
                                onChange={(e) =>
                                  updateTier(tier.id, "name", e.target.value)
                                }
                                className={inputCls}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">
                                Price (₦) *
                              </Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="5000"
                                  min="0"
                                  value={tier.price}
                                  onChange={(e) =>
                                    updateTier(tier.id, "price", e.target.value)
                                  }
                                  className={`${inputCls} pl-10`}
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">
                                Available Quantity *
                              </Label>
                              <div className="relative">
                                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="500"
                                  min="1"
                                  value={tier.quantity}
                                  onChange={(e) =>
                                    updateTier(
                                      tier.id,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  className={`${inputCls} pl-10`}
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs text-muted-foreground">
                                Tier Description
                              </Label>
                              <Input
                                placeholder="What's included?"
                                value={tier.description}
                                onChange={(e) =>
                                  updateTier(
                                    tier.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                className={inputCls}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {form.ticketTiers.length < 5 && (
                        <button
                          type="button"
                          onClick={addTier}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 py-3 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Add Another Ticket Tier
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Total capacity */}
                {field(
                  "Total Event Capacity",
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="e.g. 1000"
                      min="1"
                      value={form.totalCapacity}
                      onChange={(e) => set("totalCapacity", e.target.value)}
                      className={`${inputCls} pl-10`}
                    />
                  </div>,
                  "Maximum number of attendees allowed.",
                )}
              </div>
            )}

            {/* ── Step 4: Media & Extras ──────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-6 rounded-2xl border border-border/50 bg-card p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  Media & Extras
                </h2>

                {/* Banner image */}
                {field(
                  "Banner Image URL",
                  <div className="space-y-3">
                    <div className="relative">
                      <Image className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="https://example.com/banner.jpg"
                        value={form.bannerUrl}
                        onChange={(e) => set("bannerUrl", e.target.value)}
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                    {form.bannerUrl && (
                      <div className="h-40 overflow-hidden rounded-xl border border-border/50">
                        <img
                          src={form.bannerUrl}
                          alt="Banner preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}
                  </div>,
                  "Recommended size: 1920×1080px (16:9 ratio).",
                )}

                {/* Website */}
                {field(
                  "Event Website / Social Link",
                  <Input
                    placeholder="https://yourwebsite.com or Instagram link"
                    value={form.websiteUrl}
                    onChange={(e) => set("websiteUrl", e.target.value)}
                    className={inputCls}
                  />,
                  "Optional external link for more information.",
                )}

                {/* Agenda */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Event Schedule / Agenda
                  </Label>
                  <div className="space-y-3">
                    {form.agenda.map((item, i) => (
                      <div
                        key={i}
                        className="grid gap-2 rounded-xl border border-border/50 bg-secondary/30 p-3 sm:grid-cols-[auto_1fr_1fr_auto]"
                      >
                        <Input
                          placeholder="7:00 PM"
                          value={item.time}
                          onChange={(e) =>
                            updateAgenda(i, "time", e.target.value)
                          }
                          className={`${inputCls} w-24`}
                        />
                        <Input
                          placeholder="Session title"
                          value={item.title}
                          onChange={(e) =>
                            updateAgenda(i, "title", e.target.value)
                          }
                          className={inputCls}
                        />
                        <Input
                          placeholder="Brief description (optional)"
                          value={item.description}
                          onChange={(e) =>
                            updateAgenda(i, "description", e.target.value)
                          }
                          className={inputCls}
                        />
                        {form.agenda.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAgenda(i)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAgendaItem}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Schedule Item
                    </button>
                  </div>
                </div>

                {/* Rules */}
                {field(
                  "Rules & Guidelines",
                  <Textarea
                    placeholder="Enter each rule on a new line e.g.&#10;No outside food or drinks&#10;Dress code: Smart casual&#10;Strictly 18+"
                    value={form.rules}
                    onChange={(e) => set("rules", e.target.value)}
                    className={`${inputCls} resize-none`}
                    rows={4}
                  />,
                  "One rule per line. These will be displayed on the event page.",
                )}

                {/* Sponsorship */}
                <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Handshake className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Open for Sponsorship
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Allow brands and businesses to sponsor your event
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        set("openForSponsorship", !form.openForSponsorship)
                      }
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        form.openForSponsorship ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          form.openForSponsorship
                            ? "translate-x-5"
                            : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {form.openForSponsorship && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <Textarea
                          placeholder="Describe what sponsorship packages you offer, e.g. Logo on banners, booth space, social media shout-outs…"
                          value={form.sponsorshipDetails}
                          onChange={(e) =>
                            set("sponsorshipDetails", e.target.value)
                          }
                          className={`${inputCls} resize-none`}
                          rows={3}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={step === 1}
            className="border-border/50 gap-2 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Step {step} of {STEPS.length}
          </span>

          {step < 4 ? (
            <Button
              onClick={goNext}
              className="gradient-primary text-primary-foreground shadow-glow gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="gradient-primary text-primary-foreground shadow-glow gap-2 disabled:opacity-60 min-w-[140px]"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Publishing…
                </span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Publish Event
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreateEvent;
