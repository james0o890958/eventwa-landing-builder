import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  User,
  Moon,
  Sun,
  Globe,
  LogOut,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";

interface SettingsItemProps {
  Icon: React.ElementType;
  label: string;
  desc?: string;
  to?: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
}

const SettingsItem = ({
  Icon,
  label,
  desc,
  to,
  onClick,
  rightElement,
}: SettingsItemProps) => {
  const content = (
    <div className="group flex items-center gap-4 rounded-xl border border-border/40 bg-card p-5 transition-all hover:border-primary/50 hover:bg-secondary/60 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 group-hover:bg-primary/15 group-hover:ring-primary/30 transition-colors">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-foreground tracking-slight">{label}</p>
        {desc && (
          <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
            {desc}
          </p>
        )}
      </div>
      {rightElement || (
        <ChevronRight className="h-5 w-5 text-muted-foreground/70 group-hover:text-primary transition-colors" />
      )}
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
};

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const isDark = resolvedTheme === "dark";

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          Icon: User,
          label: "Profile Information",
          desc: "Update your name, email, avatar, and payment methods",
          to: "/profile",
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          Icon: Shield,
          label: "Privacy Settings",
          desc: "Control your data and visibility",
          to: "/privacy-settings",
        },
        {
          Icon: Bell,
          label: "Notification Preferences",
          desc: "Choose how you receive updates",
          to: "/notifications/settings",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          Icon: isDark ? Moon : Sun,
          label: isDark ? "Dark Mode" : "Light Mode",
          desc: isDark
            ? "Currently using dark theme"
            : "Currently using light theme",
          rightElement: (
            <Switch
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
              className="data-[state=checked]:bg-primary"
            />
          ),
        },
        {
          Icon: Globe,
          label: "Language & Region",
          desc: "Set your preferred language and timezone",
          onClick: () => {},
        },
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mx-auto max-w-2xl"
        >
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-6 gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {/* Header */}
          <div className="mb-10">
            <h1 className="mb-2 font-display text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Manage your account preferences and privacy settings
            </p>
          </div>

          {/* Settings sections */}
          <div className="space-y-10">
            {settingsSections.map((section, sIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: sIndex * 0.05 }}
              >
                {/* Section header */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px w-8 bg-primary/50" />
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    {section.title}
                  </h2>
                  <div className="h-px flex-1 bg-border/50" />
                </div>

                {/* Section items */}
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <SettingsItem key={item.label} {...item} />
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Sign out */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-destructive/50" />
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-destructive">
                  Account
                </h2>
                <div className="h-px flex-1 bg-border/50" />
              </div>

              <button
                onClick={handleSignOut}
                className="group flex w-full items-center gap-4 rounded-xl border-2 border-destructive/30 bg-destructive/5 p-5 text-left transition-all hover:border-destructive/50 hover:bg-destructive/10 hover:shadow-lg hover:shadow-destructive/10"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 group-hover:bg-destructive/20 group-hover:ring-2 group-hover:ring-destructive/30 transition-all">
                  <LogOut className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-destructive">Sign Out</p>
                  <p className="text-sm text-muted-foreground">
                    Sign out of your account
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground/70 group-hover:text-destructive transition-colors" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
