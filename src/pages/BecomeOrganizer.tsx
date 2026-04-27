import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Store,
  Users,
  TrendingUp,
  Building2,
  Bell,
  Shield,
  Globe,
  Save,
  Image as ImageIcon,
  Share2,
  MapPin,
  Upload,
  X,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const BecomeOrganizer = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Brand profile (mirrors OrganizerSettings)
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);

  // Privacy
  const [publicProfile, setPublicProfile] = useState(true);

  // Logo
  const [logo, setLogo] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Social media
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");

  // Location
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Region
  const [country, setCountry] = useState("Nigeria");
  const [currency, setCurrency] = useState("NGN (₦)");

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Redirect to auth if not logged in
  if (!session) {
    navigate("/auth?redirect=/become-organizer");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Organization name is required");
      return;
    }
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      toast.success("You're now an organizer! 🎉");
      navigate("/organizer/create-event");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: Store,
      title: "Create Unlimited Events",
      desc: "Host as many events as you want with full control over ticketing and pricing.",
    },
    {
      icon: Users,
      title: "Reach Thousands",
      desc: "Tap into our growing community of event-goers across Nigeria.",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      desc: "Track ticket sales, attendance, and revenue with detailed insights.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Become an Organizer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Set up your organizer profile. You can fine-tune everything later in
              your Organizer Settings.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4">
                      <benefit.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{benefit.title}</CardTitle>
                    <CardDescription>{benefit.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Setup form — mirrors OrganizerSettings sections */}
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            {/* Brand */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
                <Building2 className="h-4 w-4 text-primary" /> Brand Profile
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="org-name">Organization name *</Label>
                  <Input
                    id="org-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Lagos Events Co."
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://..."
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Bringing unforgettable experiences to Nigeria."
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
                <Bell className="h-4 w-4 text-primary" /> Notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Email alerts</p>
                    <p className="text-xs text-muted-foreground">
                      Ticket sales, messages, and reminders
                    </p>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Push notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Real-time updates on your device
                    </p>
                  </div>
                  <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} />
                </div>
              </div>
            </section>

            {/* Privacy */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
                <Shield className="h-4 w-4 text-primary" /> Privacy
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Public organizer profile</p>
                  <p className="text-xs text-muted-foreground">
                    Show your profile in the organizers directory
                  </p>
                </div>
                <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
              </div>
            </section>

            {/* Region */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
                <Globe className="h-4 w-4 text-primary" /> Region
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Input value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1" />
                </div>
              </div>
            </section>

            <CardContent className="px-0">
              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary text-primary-foreground shadow-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Setting up your organizer profile...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Become an Organizer
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                By continuing you agree to our{" "}
                <a href="/terms" className="text-primary hover:underline">Terms</a> and{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              </p>
            </CardContent>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default BecomeOrganizer;
