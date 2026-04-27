import { useState, useRef } from "react";
import {
  Save,
  Building2,
  Bell,
  Shield,
  Globe,
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
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const OrganizerSettings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.display_name ?? "My Brand");
  const [bio, setBio] = useState("Bringing unforgettable experiences to Nigeria.");
  const [website, setWebsite] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
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

  const save = () => toast.success("Settings saved");

  return (
    <DashboardLayout title="Organizer Settings" subtitle="Customize your organizer brand and preferences" menu={organizerMenu}>
      <div className="space-y-6">
        {/* Logo */}
        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
            <ImageIcon className="h-4 w-4 text-primary" /> Organization Logo
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-border/50 bg-muted flex items-center justify-center">
              {logo ? (
                <img src={logo} alt="Organization logo" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input ref={fileRef} type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload logo
              </Button>
              {logo && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setLogo(null)}>
                  <X className="mr-2 h-4 w-4" /> Remove
                </Button>
              )}
              <p className="text-xs text-muted-foreground">PNG or JPG, square recommended (min 256×256).</p>
            </div>
          </div>
        </section>

        {/* Brand */}
        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
            <Building2 className="h-4 w-4 text-primary" /> Brand Profile
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="org-name">Organization name</Label>
              <Input id="org-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="mt-1" />
            </div>
          </div>
        </section>

        {/* Social media */}
        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
            <Share2 className="h-4 w-4 text-primary" /> Social Media Profiles
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="ig" className="flex items-center gap-2"><Instagram className="h-3.5 w-3.5" /> Instagram</Label>
              <Input id="ig" placeholder="@yourhandle" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="tw" className="flex items-center gap-2"><Twitter className="h-3.5 w-3.5" /> X (Twitter)</Label>
              <Input id="tw" placeholder="@yourhandle" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="fb" className="flex items-center gap-2"><Facebook className="h-3.5 w-3.5" /> Facebook</Label>
              <Input id="fb" placeholder="facebook.com/yourpage" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="li" className="flex items-center gap-2"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</Label>
              <Input id="li" placeholder="linkedin.com/company/..." value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="yt" className="flex items-center gap-2"><Youtube className="h-3.5 w-3.5" /> YouTube</Label>
              <Input id="yt" placeholder="youtube.com/@yourchannel" value={youtube} onChange={(e) => setYoutube(e.target.value)} className="mt-1" />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
          <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
            <MapPin className="h-4 w-4 text-primary" /> Location
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="address">Street address</Label>
              <Input id="address" placeholder="123 Event Avenue" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Lagos" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="state">State / Region</Label>
              <Input id="state" placeholder="Lagos State" value={state} onChange={(e) => setState(e.target.value)} className="mt-1" />
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
                <p className="text-xs text-muted-foreground">Ticket sales, messages, and reminders</p>
              </div>
              <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Push notifications</p>
                <p className="text-xs text-muted-foreground">Real-time updates on your device</p>
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
              <p className="text-xs text-muted-foreground">Show your profile in the organizers directory</p>
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

        <div className="flex justify-end">
          <Button onClick={save} className="gradient-primary text-primary-foreground shadow-glow">
            <Save className="mr-2 h-4 w-4" /> Save changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerSettings;
