import { useState } from "react";
import { Save, Building2, Bell, Shield, Globe } from "lucide-react";
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

  const save = () => toast.success("Settings saved");

  return (
    <DashboardLayout title="Organizer Settings" subtitle="Customize your organizer brand and preferences" menu={organizerMenu}>
      <div className="space-y-6">
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
              <Input defaultValue="Nigeria" className="mt-1" />
            </div>
            <div>
              <Label>Currency</Label>
              <Input defaultValue="NGN (₦)" className="mt-1" />
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
