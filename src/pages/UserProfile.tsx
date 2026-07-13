import { useState, useEffect, useRef } from "react";
import { api, getFullAvatarUrl } from "@/lib/api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LocationCombobox, LocationOption } from "@/components/LocationCombobox";
import {
  ArrowLeft,
  User as UserIcon,
  Lock,
  ShieldCheck,
  Bell,
  Eye,
  EyeOff,
  Trash2,
  Camera,
  Check,
  Smartphone,
  AlertTriangle,
  Sparkles,
  Plus,
  Pencil,
  X,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  | "recommendations"
  | "payment"
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
  { id: "recommendations", label: "Recommendations", Icon: Sparkles, desc: "Pick categories & locations you love" },
  { id: "payment", label: "Payment Methods", Icon: CreditCard, desc: "Manage your saved payment options" },
  { id: "privacy", label: "Privacy", Icon: EyeOff, desc: "Control your visibility" },
  { id: "danger", label: "Danger Zone", Icon: Trash2, desc: "Delete your account" },
];

const CATEGORY_OPTIONS = [
  { value: "sports", label: "Sports" },
  { value: "movies", label: "Movies" },
  { value: "music", label: "Music" },
  { value: "religious", label: "Religious" },
  { value: "conferences", label: "Conferences" },
  { value: "social", label: "Social" },
  { value: "festivals", label: "Festivals" },
  { value: "gaming", label: "Gaming" },
  { value: "exhibitions", label: "Exhibitions" },
];

interface RecommendationPref {
  id: string;
  category: string;
  location: string;
}

const UserProfile = () => {
  const { user, signOut, updateUser } = useAuth();
  const [active, setActive] = useState<Section>("personal");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  const [allLocationOptions, setAllLocationOptions] = useState<{ value: string, label: string, group: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      
      try {
        const locationsRes = await api.get("states_cities");
        if (locationsRes) {
          const states = locationsRes.states || [];
          const cities = locationsRes.cities || [];
          const options = states.flatMap((s: any) => [
            { value: s.name, label: s.name, group: s.name },
            ...cities
              .filter((c: any) => c.state_id === s.id)
              .map((c: any) => ({ value: `${c.name}, ${s.name}`, label: c.name, group: s.name }))
          ]);
          setAllLocationOptions(options);
        }
      } catch (err) {
        console.error("Failed to fetch locations", err);
      }

      if (!token) {
        setLoadingProfile(false);
        return;
      }

      try {
        const response = await api.get("profile", undefined, token);
        if (response.user) {
          const u = response.user;
          setDisplayName(u.name || "");
          setEmail(u.email || "");
          setUsername(u.email?.split("@")[0] || "");
          setPhone(u.phone || "");
          setBio(u.bio || "");
          setAvatarUrl(u.avatar || undefined);
          setLocation(u.city_id ? `${u.city?.name}, ${u.state?.name}` : "");
          
          // Load preferences
          if (response.preferences) {
            setEmailNotif(response.preferences.email_notifications ?? true);
            setPushNotif(response.preferences.push_notifications ?? true);
            setMarketingNotif(response.preferences.marketing_notifications ?? false);
          }
          
          // Load privacy settings
          if (response.privacy_settings) {
            setHideInChatrooms(response.privacy_settings.hide_in_chatrooms ?? false);
            setHideInAttendeeList(response.privacy_settings.hide_in_attendee_list ?? false);
            setHideAttendedEvents(response.privacy_settings.hide_attended_events ?? false);
            setHideHostedEvents(response.privacy_settings.hide_hosted_events ?? false);
            setAllowDMsFromAnyone(response.privacy_settings.allow_dms_from_anyone ?? true);
            setShowOnlineStatus(response.privacy_settings.show_online_status ?? true);
          }
          
          // Load payment methods
          if (response.payment_methods && Array.isArray(response.payment_methods)) {
            setPaymentMethods(response.payment_methods.map((pm: any) => ({
              id: pm.id,
              brand: pm.brand,
              last4: pm.last4,
              expiry: pm.expiry,
              isDefault: pm.is_default,
            })));
          }
          
          // Load recommendations
          if (response.recommendations && Array.isArray(response.recommendations)) {
            setRecommendations(response.recommendations.map((r: any) => ({
              id: r.id,
              category: r.category,
              location: r.location,
            })));
          }
          
          // Load 2FA settings
          if (u.two_fa_enabled !== undefined) {
            setTwoFAEnabled(u.two_fa_enabled ?? false);
            setTwoFAMethod(u.two_fa_method ?? "app");
          }
          
          // Sync user state with AuthContext
          updateUser(u);

          if (u.organizer) {
            const org = u.organizer;
            const organizerProfile = {
              name: org.name || "",
              bio: org.bio || "",
              logo: org.logo || null,
              address: org.address || "",
              state: org.state?.name || "",
              city: org.city?.name || ""
            };
            localStorage.setItem("organizer_profile", JSON.stringify(organizerProfile));
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile details");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchData();
  }, []);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

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

  // Recommendations
  const [recommendations, setRecommendations] = useState<RecommendationPref[]>([
    { id: "r1", category: "music", location: "Lagos" },
  ]);
  const [draftCategory, setDraftCategory] = useState<string>("");
  const [draftLocation, setDraftLocation] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Payment methods
  interface PaymentMethod {
    id: string;
    brand: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
  }
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "pm1", brand: "Visa", last4: "4242", expiry: "08/27", isDefault: true },
  ]);
  const [newCardName, setNewCardName] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvc, setNewCardCvc] = useState("");

  const addPaymentMethod = async () => {
    const digits = newCardNumber.replace(/\s/g, "");
    if (!newCardName.trim() || digits.length < 12 || !newCardExpiry || newCardCvc.length < 3) {
      toast.error("Fill all card fields");
      return;
    }
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      
      const brand = digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Card";
      const response = await api.post("profile/payment-methods", {
        brand,
        last4: digits.slice(-4),
        expiry: newCardExpiry,
      }, token);
      
      setPaymentMethods((prev) => [
        ...prev,
        {
          id: response.payment_method.id,
          brand,
          last4: digits.slice(-4),
          expiry: newCardExpiry,
          isDefault: prev.length === 0,
        },
      ]);
      setNewCardName("");
      setNewCardNumber("");
      setNewCardExpiry("");
      setNewCardCvc("");
      toast.success("Payment method added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add payment method");
    }
  };

  const setDefaultPayment = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      await api.patch(`profile/payment-methods/${id}/default`, {}, token);
      setPaymentMethods((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
      toast.success("Default payment updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update default payment");
    }
  };

  const removePayment = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      await api.delete(`profile/payment-methods/${id}`, token);
      setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
      toast.success("Payment method removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove payment method");
    }
  };



  const resetDraft = () => {
    setDraftCategory("");
    setDraftLocation("");
    setEditingId(null);
  };

  const editRecommendation = (r: RecommendationPref) => {
    setEditingId(r.id);
    setDraftCategory(r.category);
    setDraftLocation(r.location);
  };

  const addRecommendation = async () => {
    if (!draftCategory || !draftLocation) {
      toast.error("Pick a category and a location");
      return;
    }
    const dup = recommendations.some(
      (r) => r.category === draftCategory && r.location === draftLocation && r.id !== editingId,
    );
    if (dup) {
      toast.error("That combination already exists");
      return;
    }
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      
      const response = await api.post("profile/recommendations", {
        id: editingId || undefined,
        category: draftCategory,
        location: draftLocation,
      }, token);

      if (editingId) {
        setRecommendations((prev) =>
          prev.map((r) =>
            r.id === editingId ? { ...r, category: draftCategory, location: draftLocation } : r,
          ),
        );
        toast.success("Recommendation updated");
      } else {
        setRecommendations((prev) => [
          ...prev,
          { id: response.recommendation.id, category: draftCategory, location: draftLocation },
        ]);
        toast.success("Recommendation added");
      }
      resetDraft();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save recommendation");
    }
  };

  const deleteRecommendation = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      await api.delete(`profile/recommendations/${id}`, token);
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) resetDraft();
      toast.success("Recommendation removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete recommendation");
    }
  };

  const saveRecommendations = async () => {
    toast.success("Recommendation preferences saved");
  };

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState("");



  const handleAvatarUpload = async (file: File) => {
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be under 3MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setUploadingAvatar(true);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        setAvatarPreview(undefined);
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const data = await api.post("profile/avatar", formData, token);

      if (data?.user) {
        setAvatarUrl(data.user.avatar);
        setAvatarPreview(undefined);
        setAvatarFile(null);
        updateUser(data.user);
        toast.success("Profile photo updated successfully!");
      }
    } catch (err) {
      setAvatarPreview(undefined);
      toast.error(err instanceof Error ? err.message : "Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const initials = displayName
    ? displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "??";

  const savePersonal = async () => {
    setSavingPersonal(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const parts = location.split(",").map((s) => s.trim());
      const cityName = parts[0] || "";
      const stateName = parts[1] || parts[0] || "";

      let updatedUser: any;

      if (avatarFile) {
        // Use FormData if an avatar file is explicitly selected
        const formData = new FormData();
        formData.append("_method", "PATCH");
        formData.append("name", displayName);
        if (phone) formData.append("phone", phone);
        if (bio) formData.append("bio", bio);
        if (cityName) formData.append("city_name", cityName);
        if (stateName) formData.append("state_name", stateName);
        formData.append("avatar", avatarFile);

        const data = await api.post("profile/personal", formData, token);
        updatedUser = data.user;
      } else {
        // Use fast JSON request for standard text updates
        const res = await api.patch(
          "profile/personal",
          {
            name: displayName,
            phone: phone || null,
            bio: bio || null,
            city_name: cityName || null,
            state_name: stateName || null,
          },
          token
        );
        updatedUser = res.user;
      }

      if (updatedUser?.avatar) {
        setAvatarUrl(updatedUser.avatar);
        setAvatarPreview(undefined);
        setAvatarFile(null);
      }
      if (updatedUser) {
        updateUser(updatedUser);
      }
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSavingPersonal(false);
    }
  };
  const savePassword = async () => {
    if (!currentPwd || !newPwd) return toast.error("Fill in all password fields");
    if (newPwd !== confirmPwd) return toast.error("New passwords don't match");
    if (newPwd.length < 8) return toast.error("Password must be at least 8 characters");
    
    setSavingPassword(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      await api.patch("profile/password", {
        current_password: currentPwd,
        password: newPwd,
        password_confirmation: confirmPwd,
      }, token);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };
  const savePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      await api.patch("profile/privacy", {
        hide_in_chatrooms: hideInChatrooms,
        hide_in_attendee_list: hideInAttendeeList,
        hide_attended_events: hideAttendedEvents,
        hide_hosted_events: hideHostedEvents,
        allow_dms_from_anyone: allowDMsFromAnyone,
        show_online_status: showOnlineStatus,
      }, token);
      toast.success("Privacy settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save privacy settings");
    } finally {
      setSavingPrivacy(false);
    }
  };
  const handleDelete = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }
    
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Not authenticated");
        return;
      }
      await api.post("profile/schedule-deletion", {
        confirm: "DELETE",
      }, token);
      toast.success("Account deletion scheduled. You can cancel within 30 days.");
      await signOut();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule deletion");
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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

        <div className="grid gap-6 lg:grid-cols-[260px_1fr] max-w-full">
          {/* Mobile Profile Section Select Dropdown (< lg screens) */}
          {(() => {
            const activeSectionObj = SECTIONS.find((s) => s.id === active) || SECTIONS[0];
            return (
              <div className="lg:hidden mb-2 max-w-full">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-card transition-colors hover:border-primary/50 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <activeSectionObj.Icon className="h-5 w-5 shrink-0 text-primary" />
                    <span className="font-semibold text-foreground text-sm truncate">{activeSectionObj.label}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground ${mobileNavOpen ? "rotate-180" : ""}`} />
                </button>

                {mobileNavOpen && (
                  <div className="mt-2 rounded-xl border border-border/60 bg-card p-2 shadow-xl space-y-1 z-20">
                    {SECTIONS.map((s) => {
                      const isActive = active === s.id;
                      const isDanger = s.id === "danger";
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setActive(s.id);
                            setMobileNavOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                            isActive
                              ? isDanger
                                ? "bg-destructive/10 text-destructive border border-destructive/30"
                                : "gradient-primary text-primary-foreground font-semibold"
                              : isDanger
                                ? "text-destructive/80 hover:bg-destructive/5"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <s.Icon className="h-4 w-4 shrink-0" />
                          <span>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Desktop Sidebar nav (lg+ screens) */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start max-w-full">
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((s) => {
                const isActive = active === s.id;
                const isDanger = s.id === "danger";
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all w-full ${
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
          <main className="min-w-0 max-w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl border border-border/50 bg-card p-4 sm:p-8 shadow-card max-w-full"
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
                      <div
                        onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
                        className="relative h-20 w-20 cursor-pointer group rounded-full overflow-hidden border-2 border-border transition-all hover:border-primary hover:shadow-glow shrink-0"
                        title="Click circle to upload profile photo"
                      >
                        <Avatar className="h-full w-full">
                          <AvatarImage src={avatarPreview ?? getFullAvatarUrl(avatarUrl)} alt={displayName} />
                          <AvatarFallback className="gradient-primary text-primary-foreground text-xl font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white transition-opacity ${uploadingAvatar ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                          {uploadingAvatar ? (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <>
                              <Camera className="h-5 w-5" />
                              <span className="text-[9px] font-semibold mt-0.5">Upload</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpg,image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAvatarUpload(file);
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          type="button"
                          disabled={uploadingAvatar}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Camera className="h-4 w-4" />
                          {uploadingAvatar ? "Uploading..." : "Change Photo"}
                        </Button>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Click circle or button to upload JPG, PNG or WebP. Max 3MB.
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
                        disabled={savingPersonal}
                        className="gradient-primary text-primary-foreground shadow-glow gap-2"
                      >
                        {savingPersonal ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
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
                        <div className="relative">
                          <Input
                            type={showCurrentPwd ? "text" : "password"}
                            value={currentPwd}
                            onChange={(e) => setCurrentPwd(e.target.value)}
                            placeholder="••••••••"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          >
                            {showCurrentPwd ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>New Password</Label>
                        <div className="relative">
                          <Input
                            type={showNewPwd ? "text" : "password"}
                            value={newPwd}
                            onChange={(e) => setNewPwd(e.target.value)}
                            placeholder="At least 8 characters"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPwd(!showNewPwd)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          >
                            {showNewPwd ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            type={showConfirmPwd ? "text" : "password"}
                            value={confirmPwd}
                            onChange={(e) => setConfirmPwd(e.target.value)}
                            placeholder="Re-enter new password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                          >
                            {showConfirmPwd ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={savePassword}
                        disabled={savingPassword}
                        className="gradient-primary text-primary-foreground shadow-glow gap-2"
                      >
                        {savingPassword ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4" />
                            Update Password
                          </>
                        )}
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
                        onCheckedChange={async (v) => {
                          try {
                            const token = localStorage.getItem("access_token");
                            if (!token) {
                              toast.error("Not authenticated");
                              return;
                            }
                            await api.patch("profile/2fa", {
                              two_fa_enabled: v,
                              two_fa_method: twoFAMethod,
                            }, token);
                            setTwoFAEnabled(v);
                            toast.success(v ? "2FA enabled" : "2FA disabled");
                          } catch (err) {
                            toast.error(err instanceof Error ? err.message : "Failed to update 2FA");
                          }
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
                                onClick={async () => {
                                  try {
                                    setTwoFAMethod(m.v);
                                    const token = localStorage.getItem("access_token");
                                    if (token) {
                                      await api.patch("profile/2fa", {
                                        two_fa_enabled: twoFAEnabled,
                                        two_fa_method: m.v,
                                      }, token);
                                      toast.success(`Verification method updated to ${m.label}`);
                                    }
                                  } catch (err) {
                                    toast.error(err instanceof Error ? err.message : "Failed to update verification method");
                                  }
                                }}
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
                        { label: "Email Notifications", desc: "Tickets, reminders, account alerts", val: emailNotif, set: setEmailNotif, key: "email_notifications" },
                        { label: "Push Notifications", desc: "Real-time alerts on your device", val: pushNotif, set: setPushNotif, key: "push_notifications" },
                        { label: "Marketing & Promotions", desc: "Deals, new features and recommended events", val: marketingNotif, set: setMarketingNotif, key: "marketing_notifications" },
                      ].map((n) => (
                        <div
                          key={n.label}
                          className="flex items-center justify-between rounded-xl border border-border/50 p-4"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{n.label}</p>
                            <p className="text-xs text-muted-foreground">{n.desc}</p>
                          </div>
                          <Switch checked={n.val} onCheckedChange={async (v) => {
                            const prevVal = n.val;
                            n.set(v);
                            try {
                              const token = localStorage.getItem("access_token");
                              if (!token) {
                                n.set(prevVal);
                                toast.error("Not authenticated");
                                return;
                              }
                              await api.patch("profile/notifications", {
                                [n.key]: v,
                              }, token);
                              toast.success("Notification preference updated");
                            } catch (err) {
                              n.set(prevVal);
                              toast.error(err instanceof Error ? err.message : "Failed to update preferences");
                            }
                          }} />
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

                {/* RECOMMENDATIONS */}
                {active === "recommendations" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Recommendation Preferences
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Choose the event categories and locations you want us to surface for you.
                      </p>
                    </div>

                    {/* Existing recommendations */}
                    <div className="space-y-3">
                      {recommendations.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                          No preferences yet. Add your first recommendation below.
                        </div>
                      ) : (
                        recommendations.map((r) => {
                          const cat = CATEGORY_OPTIONS.find((c) => c.value === r.category);
                          const isEditing = editingId === r.id;
                          return (
                            <div
                              key={r.id}
                              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 transition-all ${
                                isEditing
                                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                                  : "border-border/50 bg-secondary/20"
                              }`}
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="capitalize">
                                  {cat?.label ?? r.category}
                                </Badge>
                                <span className="text-muted-foreground">in</span>
                                <Badge variant="outline">{r.location}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => editRecommendation(r)}
                                  className="gap-1"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Update
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteRecommendation(r.id)}
                                  className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Add / Edit row */}
                    <div className="rounded-xl border border-border/50 bg-card p-4">
                      <p className="mb-3 text-sm font-medium text-foreground">
                        {editingId ? "Edit recommendation" : "Add a recommendation"}
                      </p>
                      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Category</Label>
                          <Select value={draftCategory} onValueChange={setDraftCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORY_OPTIONS.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Location</Label>
                          <LocationCombobox
                            options={allLocationOptions}
                            value={draftLocation}
                            onSelect={setDraftLocation}
                            onAddCustomLocation={(newLoc) => {
                              setAllLocationOptions((prev) => [newLoc, ...prev]);
                              toast.success(`Added "${newLoc.value}" as a custom location option`);
                            }}
                            placeholder="Search or add location..."
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <Button
                            onClick={addRecommendation}
                            className="gradient-primary text-primary-foreground shadow-glow gap-1"
                          >
                            {editingId ? (
                              <>
                                <Check className="h-4 w-4" />
                                Update
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4" />
                                Add
                              </>
                            )}
                          </Button>
                          {editingId && (
                            <Button
                              variant="ghost"
                              onClick={resetDraft}
                              className="gap-1"
                            >
                              <X className="h-4 w-4" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={saveRecommendations}
                        className="gradient-primary text-primary-foreground shadow-glow gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                )}

                {/* PAYMENT */}
                {active === "payment" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Payment Methods
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Manage cards used for ticket purchases.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {paymentMethods.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                          No payment methods on file.
                        </div>
                      ) : (
                        paymentMethods.map((pm) => (
                          <div
                            key={pm.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-secondary/20 p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-14 items-center justify-center rounded-md bg-card border border-border/50">
                                <CreditCard className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {pm.brand} •••• {pm.last4}
                                </p>
                                <p className="text-xs text-muted-foreground">Expires {pm.expiry}</p>
                              </div>
                              {pm.isDefault && (
                                <Badge variant="secondary" className="ml-2">Default</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {!pm.isDefault && (
                                <Button size="sm" variant="outline" onClick={() => setDefaultPayment(pm.id)}>
                                  Set default
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removePayment(pm.id)}
                                className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="rounded-xl border border-border/50 bg-card p-4">
                      <p className="mb-3 text-sm font-medium text-foreground">Add a new card</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label className="text-xs text-muted-foreground">Cardholder name</Label>
                          <Input value={newCardName} onChange={(e) => setNewCardName(e.target.value)} placeholder="Name on card" />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label className="text-xs text-muted-foreground">Card number</Label>
                          <Input
                            value={newCardNumber}
                            onChange={(e) => setNewCardNumber(e.target.value)}
                            placeholder="1234 5678 9012 3456"
                            inputMode="numeric"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">Expiry (MM/YY)</Label>
                          <Input value={newCardExpiry} onChange={(e) => setNewCardExpiry(e.target.value)} placeholder="MM/YY" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">CVC</Label>
                          <Input value={newCardCvc} onChange={(e) => setNewCardCvc(e.target.value)} placeholder="123" inputMode="numeric" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button onClick={addPaymentMethod} className="gradient-primary text-primary-foreground shadow-glow gap-2">
                          <Plus className="h-4 w-4" />
                          Add Card
                        </Button>
                      </div>
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
                        disabled={savingPrivacy}
                        className="gradient-primary text-primary-foreground shadow-glow gap-2"
                      >
                        {savingPrivacy ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4" />
                            Save Privacy Settings
                          </>
                        )}
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
