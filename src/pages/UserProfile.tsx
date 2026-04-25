import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User as UserIcon,
  Lock,
  ShieldCheck,
  Bell,
  EyeOff,
  Trash2,
  Camera,
  Check,
  Smartphone,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Section =
  | "personal"
  | "password"
  | "twofa"
  | "notifications"
  | "privacy"
  | "danger";

const SECTIONS: {
  id: Section;
  label: string;
  Icon: React.ElementType;
  desc: string;
}[] = [
  { id: "personal", label: "Personal Info", Icon: UserIcon, desc: "Edit your profile details" },
  { id: "password", label: "Password", Icon: Lock, desc: "Change your password" },
  { id: "twofa", label: "Two-Factor Auth", Icon: ShieldCheck, desc: "Extra account security" },
  { id: "notifications", label: "Notifications", Icon: Bell, desc: "Manage email & push alerts" },
  { id: "privacy", label: "Privacy", Icon: EyeOff, desc: "Control your visibility" },
  { id: "danger", label: "Danger Zone", Icon: Trash2, desc: "Delete your account" },
];

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const [active, setActive] = useState<Section>("personal");

  // Personal info
  const initialName =
    (user?.user_metadata?.display_name as string) ||
    user?.email?.split("@")[0] ||
    "Your Name";
  const [displayName, setDisplayName] = useState(initialName);
  const [username, setUsername] = useState(
    user?.email?.split("@")[0] || "username",
  );
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("Music lover & event enthusiast 🎵");
  const [location, setLocation] = useState("Lagos, Nigeria");

  // Password
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // 2FA
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState<"sms" | "app">("app");

  // Notifications quick toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [marketingNotif, setMarketingNotif] = useState(false);

  // Privacy
  const [hideInChatrooms, setHideInChatrooms] = useState(false);
  const [hideInAttendeeList, setHideInAttendeeList] = useState(false);
  const [hideAttendedEvents, setHideAttendedEvents] = useState(false);
  const [hideHostedEvents, setHideHostedEvents] = useState(false);
  const [allowDMsFromAnyone, setAllowDMsFromAnyone] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const savePersonal = () => toast.success("Profile updated successfully");
  const savePassword = () => {
    if (!currentPwd || !newPwd) return toast.error("Fill in all password fields");
    if (newPwd !== confirmPwd) return toast.error("New passwords don't match");
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters");
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    toast.success("Password changed successfully");
  };
  const savePrivacy = () => toast.success("Privacy settings saved");
  const handleDelete = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }
    toast.success("Account deletion scheduled. You can cancel within 30 days.");
    await signOut();
  };

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-6xl px-4 pb-10">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Profile Settings
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account information, security, and preferences.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar nav */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {SECTIONS.map((s) => {
                const isActive = active === s.id;
                const isDanger = s.id === "danger";
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all lg:w-full ${
                      isActive
                        ? isDanger
                          ? "bg-destructive/10 text-destructive border border-destructive/30"
                          : "gradient-primary text-primary-foreground shadow-glow"
                        : isDanger
                          ? "text-destructive/80 hover:bg-destructive/5"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <s.Icon className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">{s.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content panel */}
          <main className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl border border-border/50 bg-card p-6 shadow-card sm:p-8"
              >
                {/* PERSONAL */}
                {active === "personal" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Personal Information
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Update how others see you on Eventwa.
                      </p>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-5">
                      <Avatar className="h-20 w-20 border-2 border-border">
                        <AvatarFallback className="gradient-primary text-primary-foreground text-xl font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Camera className="h-4 w-4" />
                          Change Photo
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">
                          JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label>Display Name</Label>
                        <Input
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Username</Label>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Email Address</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Phone Number</Label>
                        <Input
                          type="tel"
                          placeholder="+234 ..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label>Location</Label>
                        <Input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label>Bio</Label>
                        <Textarea
                          rows={4}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          maxLength={200}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                          {bio.length}/200 characters
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={savePersonal}
                        className="gradient-primary text-primary-foreground shadow-glow gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {/* PASSWORD */}
                {active === "password" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Change Password
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Use a strong password you don't use anywhere else.
                      </p>
                    </div>

                    <div className="space-y-4 max-w-md">
                      <div className="space-y-1.5">
                        <Label>Current Password</Label>
                        <Input
                          type="password"
                          value={currentPwd}
                          onChange={(e) => setCurrentPwd(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>New Password</Label>
                        <Input
                          type="password"
                          value={newPwd}
                          onChange={(e) => setNewPwd(e.target.value)}
                          placeholder="At least 8 characters"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Confirm New Password</Label>
                        <Input
                          type="password"
                          value={confirmPwd}
                          onChange={(e) => setConfirmPwd(e.target.value)}
                          placeholder="Re-enter new password"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={savePassword}
                        className="gradient-primary text-primary-foreground shadow-glow gap-2"
                      >
                        <Lock className="h-4 w-4" />
                        Update Password
                      </Button>
                    </div>
                  </div>
                )}

                {/* 2FA */}
                {active === "twofa" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Two-Factor Authentication
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account.
                      </p>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Enable 2FA
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {twoFAEnabled ? "Your account is protected" : "Currently disabled"}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={twoFAEnabled}
                        onCheckedChange={(v) => {
                          setTwoFAEnabled(v);
                          toast.success(v ? "2FA enabled" : "2FA disabled");
                        }}
                      />
                    </div>

                    <AnimatePresence>
                      {twoFAEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden space-y-3"
                        >
                          <Label>Verification Method</Label>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {[
                              { v: "app" as const, Icon: ShieldCheck, label: "Authenticator App", desc: "Google Authenticator, Authy" },
                              { v: "sms" as const, Icon: Smartphone, label: "SMS Code", desc: "Text to your phone number" },
                            ].map((m) => (
                              <button
                                key={m.v}
                                type="button"
                                onClick={() => setTwoFAMethod(m.v)}
                                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                                  twoFAMethod === m.v
                                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                                    : "border-border/50 hover:border-primary/40"
                                }`}
                              >
                                <m.Icon className="h-5 w-5 mt-0.5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {m.label}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {m.desc}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* NOTIFICATIONS */}
                {active === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Notification Preferences
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Choose which updates you want to receive.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Email Notifications", desc: "Tickets, reminders, account alerts", val: emailNotif, set: setEmailNotif },
                        { label: "Push Notifications", desc: "Real-time alerts on your device", val: pushNotif, set: setPushNotif },
                        { label: "Marketing & Promotions", desc: "Deals, new features and recommended events", val: marketingNotif, set: setMarketingNotif },
                      ].map((n) => (
                        <div
                          key={n.label}
                          className="flex items-center justify-between rounded-xl border border-border/50 p-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{n.label}</p>
                            <p className="text-xs text-muted-foreground">{n.desc}</p>
                          </div>
                          <Switch checked={n.val} onCheckedChange={n.set} />
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-border/50 bg-secondary/30 p-4 text-sm text-muted-foreground">
                      For per-event notification controls, visit{" "}
                      <Link
                        to="/notifications/settings"
                        className="font-medium text-primary hover:underline"
                      >
                        advanced notification settings
                      </Link>
                      .
                    </div>
                  </div>
                )}

                {/* PRIVACY */}
                {active === "privacy" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Privacy Settings
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Control how your identity appears across Eventwa.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Hide me in event chatrooms", desc: "You'll appear as 'Anonymous Attendee' in chatrooms", val: hideInChatrooms, set: setHideInChatrooms },
                        { label: "Hide me in attendees list", desc: "Organizers can still see you, but other attendees can't", val: hideInAttendeeList, set: setHideInAttendeeList },
                        { label: "Hide events I've attended", desc: "Don't show attended events on my public profile", val: hideAttendedEvents, set: setHideAttendedEvents },
                        { label: "Hide events I've hosted", desc: "Don't show hosted events on my public profile", val: hideHostedEvents, set: setHideHostedEvents },
                        { label: "Allow direct messages from anyone", desc: "If off, only people you follow can message you", val: allowDMsFromAnyone, set: setAllowDMsFromAnyone },
                        { label: "Show online status", desc: "Let others see when you're active", val: showOnlineStatus, set: setShowOnlineStatus },
                      ].map((p) => (
                        <div
                          key={p.label}
                          className="flex items-center justify-between rounded-xl border border-border/50 p-4"
                        >
                          <div className="pr-4">
                            <p className="text-sm font-medium text-foreground">{p.label}</p>
                            <p className="text-xs text-muted-foreground">{p.desc}</p>
                          </div>
                          <Switch checked={p.val} onCheckedChange={p.set} />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={savePrivacy}
                        className="gradient-primary text-primary-foreground shadow-glow gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Save Privacy Settings
                      </Button>
                    </div>
                  </div>
                )}

                {/* DANGER */}
                {active === "danger" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-destructive">
                        Danger Zone
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Permanent and irreversible actions.
                      </p>
                    </div>

                    <div className="rounded-xl border-2 border-destructive/30 bg-destructive/5 p-5">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            Delete your account
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            This will permanently delete your profile, tickets,
                            messages, and all associated data. You have 30 days
                            to cancel this action.
                          </p>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="mt-4 gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone after 30 days. All
                                  your data, including tickets, messages, saved
                                  events, and hosted events will be permanently
                                  removed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <div className="space-y-2">
                                <Label>
                                  Type <span className="font-bold text-destructive">DELETE</span> to confirm
                                </Label>
                                <Input
                                  value={deleteConfirm}
                                  onChange={(e) => setDeleteConfirm(e.target.value)}
                                  placeholder="DELETE"
                                />
                              </div>

                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteConfirm("")}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Permanently
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
