import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import {
  Bell,
  Mail,
  Smartphone,
  ArrowLeft,
  Ticket,
  MapPin,
  Megaphone,
  Star,
  Calendar,
  Save,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  email: boolean;
  push: boolean;
}

// ─── Initial settings ─────────────────────────────────────────────────────────

const INITIAL_SETTINGS: NotifSetting[] = [
  {
    id: "ticket_confirmations",
    label: "Ticket Confirmations",
    description: "Receive a notification when your ticket purchase is confirmed",
    icon: Ticket,
    iconColor: "text-emerald-500",
    email: true,
    push: true,
  },
  {
    id: "event_reminders",
    label: "Event Reminders",
    description: "Get reminded 24 hours and 1 hour before your upcoming events",
    icon: Calendar,
    iconColor: "text-blue-500",
    email: true,
    push: true,
  },
  {
    id: "nearby_events",
    label: "Events Near You",
    description: "Be notified when new events are added in your city or area",
    icon: MapPin,
    iconColor: "text-primary",
    email: false,
    push: true,
  },
  {
    id: "organizer_announcements",
    label: "Organizer Announcements",
    description: "Receive updates and announcements from event organizers",
    icon: Megaphone,
    iconColor: "text-amber-500",
    email: true,
    push: true,
  },
  {
    id: "event_recommendations",
    label: "Event Recommendations",
    description: "Personalized event suggestions based on your interests and history",
    icon: Star,
    iconColor: "text-violet-500",
    email: true,
    push: false,
  },
  {
    id: "new_followers",
    label: "New Followers",
    description: "Get notified when someone follows your organizer profile",
    icon: Bell,
    iconColor: "text-pink-500",
    email: false,
    push: true,
  },
  {
    id: "price_drops",
    label: "Price Drops & Deals",
    description: "Be alerted when events you've saved have price changes or discounts",
    icon: Ticket,
    iconColor: "text-orange-500",
    email: true,
    push: true,
  },
  {
    id: "new_events_following",
    label: "New Events from Followed Organizers",
    description: "Know immediately when organizers you follow publish new events",
    icon: Calendar,
    iconColor: "text-cyan-500",
    email: false,
    push: true,
  },
];

// ─── Toggle switch ────────────────────────────────────────────────────────────

const Toggle = ({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    aria-checked={checked}
    role="switch"
    className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
      checked ? "bg-primary" : "bg-border"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        checked ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotifSetting[]>(INITIAL_SETTINGS);
  const [globalEmail, setGlobalEmail] = useState(true);
  const [globalPush, setGlobalPush] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      try {
        const res = await api.get("profile", undefined, token);
        if (res?.preferences) {
          const { email_notifications, push_notifications, marketing_notifications } = res.preferences;
          if (email_notifications !== undefined) setGlobalEmail(!!email_notifications);
          if (push_notifications !== undefined) setGlobalPush(!!push_notifications);
        }
      } catch (e) {
        console.error("Failed to load notification settings", e);
      }
    };
    fetchPrefs();
  }, []);

  const toggleChannel = (
    id: string,
    channel: "email" | "push",
  ) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [channel]: !s[channel] } : s,
      ),
    );
    setSaved(false);
  };

  const toggleAll = async (channel: "email" | "push", value: boolean) => {
    if (channel === "email") {
      setGlobalEmail(value);
      setSettings((prev) => prev.map((s) => ({ ...s, email: value })));
    } else {
      setGlobalPush(value);
      setSettings((prev) => prev.map((s) => ({ ...s, push: value })));
    }
    setSaved(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
    try {
      await api.patch("profile/notifications", {
        email_notifications: globalEmail,
        push_notifications: globalPush,
      }, token);
      setSaved(true);
      toast.success("Notification preferences saved!");
    } catch (err) {
      toast.error("Failed to save preferences");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 pt-24 pb-16">
        {/* Back */}
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Bell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Notification Settings
              </h1>
              <p className="text-muted-foreground text-sm">
                Choose how and when you want to be notified
              </p>
            </div>
          </div>
        </motion.div>

        {/* Channel overview cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 grid gap-4 sm:grid-cols-2"
        >
          {/* Email notifications master toggle */}
          <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-card">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15">
              <Mail className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground">
                {settings.filter((s) => s.email).length} of {settings.length} enabled
              </p>
            </div>
            <Toggle
              checked={globalEmail}
              onChange={() => toggleAll("email", !globalEmail)}
            />
          </div>

          {/* Push notifications master toggle */}
          <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-5 shadow-card">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
              <Smartphone className="h-5 w-5 text-violet-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-xs text-muted-foreground">
                {settings.filter((s) => s.push).length} of {settings.length} enabled
              </p>
            </div>
            <Toggle
              checked={globalPush}
              onChange={() => toggleAll("push", !globalPush)}
            />
          </div>
        </motion.div>

        {/* Column headers */}
        <div className="mb-2 flex items-center justify-end gap-6 pr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            Email
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5" />
            Push
          </div>
        </div>

        {/* Individual notification settings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card"
        >
          {settings.map((setting, i) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.04 }}
              className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-secondary/30 ${
                i < settings.length - 1 ? "border-b border-border/30" : ""
              }`}
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                <setting.icon className={`h-5 w-5 ${setting.iconColor}`} />
              </div>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {setting.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {setting.description}
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 shrink-0">
                <Toggle
                  checked={setting.email && globalEmail}
                  onChange={() => toggleChannel(setting.id, "email")}
                  disabled={!globalEmail}
                />
                <Toggle
                  checked={setting.push && globalPush}
                  onChange={() => toggleChannel(setting.id, "push")}
                  disabled={!globalPush}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quiet hours */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-card"
        >
          <h2 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
            <Bell className="h-4 w-4 text-primary" />
            Quiet Hours
          </h2>

          <p className="mb-4 text-sm text-muted-foreground">
            Pause push notifications during specific hours. Email notifications
            are unaffected.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                From
              </span>
              <select
                defaultValue="22:00"
                className="flex-1 rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-foreground"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option
                    key={i}
                    value={`${String(i).padStart(2, "0")}:00`}
                  >{`${String(i).padStart(2, "0")}:00`}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                To
              </span>
              <select
                defaultValue="08:00"
                className="flex-1 rounded-lg border border-border/50 bg-secondary px-3 py-2 text-sm text-foreground"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option
                    key={i}
                    value={`${String(i).padStart(2, "0")}:00`}
                  >{`${String(i).padStart(2, "0")}:00`}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            All times are in your local timezone (WAT — UTC+1).
          </p>
        </motion.div>

        {/* Unsubscribe notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5 rounded-2xl border border-border/50 bg-secondary/30 px-5 py-4"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tip:</span> You can
            also unsubscribe from any individual email by clicking the
            "Unsubscribe" link at the bottom of any notification email we send
            you.
          </p>
        </motion.div>

        {/* Save button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-8 flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            {saved ? (
              <span className="flex items-center gap-1.5 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
                Preferences saved successfully
              </span>
            ) : (
              "Unsaved changes"
            )}
          </p>

          <Button
            onClick={handleSave}
            className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 gap-2"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </Button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationSettings;
