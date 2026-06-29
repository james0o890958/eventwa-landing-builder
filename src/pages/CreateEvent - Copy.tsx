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
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/mockEvents";
import { api } from "@/lib/api";
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
    set("agenda", [
      ...form.agenda,
      {
        id: `a${Date.now()}`,
        title: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
      },
    ]);

  const updateAgenda = (
    index: number,
    field: keyof Omit<AgendaItem, "id">,
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

  // ── Meals ──────────────────────────────────────────────────────────────────

  const toggleMeal = (meal: string) => {
    const exists = form.mealOptions.includes(meal);
    set(
      "mealOptions",
      exists
        ? form.mealOptions.filter((m) => m !== meal)
        : [...form.mealOptions, meal],
    );
  };

  // ── Dress code image upload (local preview) ────────────────────────────────

  const onDressImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    set("dressCodeImageUrl", url);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("You must be logged in to create an event.");
        navigate("/login");
        return;
      }

      const startDateTime = `${form.date}T${form.time || "00:00"}`;
      const endDateTime = form.endDate
        ? `${form.endDate}T${form.endTime || "23:59"}`
        : `${form.date}T${form.endTime || form.time || "23:59"}`;

      const calculatedPrice = form.isFree ? 0 : (Number(form.ticketTiers[0]?.price) || 0);
      const calculatedCapacity = Number(form.totalCapacity) || 
        form.ticketTiers.reduce((acc, t) => acc + (Number(t.quantity) || 0), 0) || 100;

      const payload = {
        title: form.title,
        description: form.description,
        start_date: startDateTime,
        end_date: endDateTime,
        category: form.category,
        location_type: form.locationType,
        location_name: form.locationType === "physical" ? form.location : "Online",
        location_address: form.locationType === "physical" ? form.location : (form.onlineLink || "Online"),
        online_link: form.locationType === "online" ? form.onlineLink : undefined,
        price: calculatedPrice,
        capacity: calculatedCapacity,
        image_url: form.bannerUrl.trim() || null,
        status: "published",
      };

      await api.post("events", payload, token);

      toast.success("Event created successfully! 🎉", {
        description: "Your event is now live on Evently.",
      });
      navigate("/organizer/dashboard");
    } catch (error: any) {
      console.error("Failed to create event:", error);
      toast.error(error.message || "Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

                {/* Agenda — multi-session with start/end dates & times */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-foreground">
                    Event Schedule / Agenda
                  </Label>
                  <p className="text-xs text-muted-foreground -mt-1">
                    Add one or more sessions, each with its own start and end date & time.
                  </p>
                  <div className="space-y-3">
                    {form.agenda.map((item, i) => (
                      <div
                        key={item.id}
                        className="relative rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">
                            Session {i + 1}
                          </p>
                          {form.agenda.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeAgenda(i)}
                              className="rounded-full p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <Input
                          placeholder="Session title (e.g. Opening Keynote)"
                          value={item.title}
                          onChange={(e) =>
                            updateAgenda(i, "title", e.target.value)
                          }
                          className={inputCls}
                        />

                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Start Date</Label>
                            <Input
                              type="date"
                              value={item.startDate}
                              onChange={(e) =>
                                updateAgenda(i, "startDate", e.target.value)
                              }
                              className={inputCls}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Start Time</Label>
                            <Input
                              type="time"
                              value={item.startTime}
                              onChange={(e) =>
                                updateAgenda(i, "startTime", e.target.value)
                              }
                              className={inputCls}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">End Date</Label>
                            <Input
                              type="date"
                              value={item.endDate}
                              onChange={(e) =>
                                updateAgenda(i, "endDate", e.target.value)
                              }
                              className={inputCls}
                              min={item.startDate || undefined}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">End Time</Label>
                            <Input
                              type="time"
                              value={item.endTime}
                              onChange={(e) =>
                                updateAgenda(i, "endTime", e.target.value)
                              }
                              className={inputCls}
                            />
                          </div>
                        </div>

                        <Textarea
                          placeholder="Brief description (optional)"
                          value={item.description}
                          onChange={(e) =>
                            updateAgenda(i, "description", e.target.value)
                          }
                          className={`${inputCls} resize-none`}
                          rows={2}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAgendaItem}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/30 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Add Another Session
                    </button>
                  </div>
                </div>

                {/* Dress Code */}
                <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Dress Code
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Specify a color theme or upload a reference image
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { v: "none" as const, label: "No Dress Code" },
                      { v: "color" as const, label: "Color Theme" },
                      { v: "image" as const, label: "Reference Image" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => set("dressCodeType", opt.v)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          form.dressCodeType === opt.v
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/50 text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {form.dressCodeType === "color" && (
                      <motion.div
                        key="color"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={form.dressCodeColor}
                            onChange={(e) =>
                              set("dressCodeColor", e.target.value)
                            }
                            className="h-12 w-16 cursor-pointer rounded-lg border border-border/50 bg-transparent"
                          />
                          <Input
                            value={form.dressCodeColor}
                            onChange={(e) =>
                              set("dressCodeColor", e.target.value)
                            }
                            className={`${inputCls} font-mono`}
                            placeholder="#000000"
                          />
                          <div
                            className="h-12 flex-1 rounded-lg border border-border/50"
                            style={{ backgroundColor: form.dressCodeColor }}
                          />
                        </div>
                        <Input
                          placeholder="e.g. All white, Black tie, Afro-luxe"
                          value={form.dressCodeNote}
                          onChange={(e) =>
                            set("dressCodeNote", e.target.value)
                          }
                          className={inputCls}
                        />
                      </motion.div>
                    )}

                    {form.dressCodeType === "image" && (
                      <motion.div
                        key="image"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background py-6 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
                          <Image className="h-5 w-5" />
                          {form.dressCodeImageUrl ? "Replace Image" : "Upload Reference Image"}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={onDressImageUpload}
                            className="hidden"
                          />
                        </label>
                        {form.dressCodeImageUrl && (
                          <div className="relative h-48 overflow-hidden rounded-xl border border-border/50">
                            <img
                              src={form.dressCodeImageUrl}
                              alt="Dress code reference"
                              className="h-full w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => set("dressCodeImageUrl", "")}
                              className="absolute right-2 top-2 rounded-full bg-destructive p-1.5 text-destructive-foreground hover:bg-destructive/90"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        <Input
                          placeholder="Optional note (e.g. Inspired by the look above)"
                          value={form.dressCodeNote}
                          onChange={(e) =>
                            set("dressCodeNote", e.target.value)
                          }
                          className={inputCls}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Meals */}
                <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🍽️</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          Meals & Refreshments
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Will food or drinks be served at this event?
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => set("mealsProvided", !form.mealsProvided)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        form.mealsProvided ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          form.mealsProvided ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <AnimatePresence>
                    {form.mealsProvided && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-3"
                      >
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            Select what will be served (multiple allowed)
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {MEAL_PRESETS.map((meal) => {
                              const selected = form.mealOptions.includes(meal);
                              return (
                                <button
                                  key={meal}
                                  type="button"
                                  onClick={() => toggleMeal(meal)}
                                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                                    selected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border/50 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                                  }`}
                                >
                                  {selected && "✓ "}
                                  {meal}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <Textarea
                          placeholder="Additional meal details (e.g. cuisine, dietary notes, drink list)"
                          value={form.mealNotes}
                          onChange={(e) => set("mealNotes", e.target.value)}
                          className={`${inputCls} resize-none`}
                          rows={2}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
