import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Megaphone, TrendingUp, Sparkles, Target, Check, ArrowLeft, Eye, MousePointerClick, Users } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockEvents } from "@/data/mockEvents";
import { toast } from "sonner";

const PACKAGES = [
  { id: "boost", name: "Boost", price: "₦5,000", reach: "5K", Icon: TrendingUp, features: ["Featured for 3 days", "Homepage carousel", "Push notifications"] },
  { id: "spotlight", name: "Spotlight", price: "₦15,000", reach: "25K", Icon: Sparkles, features: ["Featured for 7 days", "Top of search", "Email blast", "Social media post"], popular: true },
  { id: "premium", name: "Premium", price: "₦35,000", reach: "100K+", Icon: Target, features: ["Featured for 14 days", "All Spotlight perks", "Influencer mentions", "Dedicated banner"] },
];

const CURRENT_PROMOTIONS = [
  {
    id: "cp1",
    eventTitle: "Felabration 2026",
    package: "Spotlight",
    daysLeft: 4,
    totalDays: 7,
    impressions: 18420,
    targetImpressions: 25000,
    clicks: 642,
    ticketsFromAd: 38,
    status: "active" as const,
  },
  {
    id: "cp2",
    eventTitle: "Lagos Tech Summit",
    package: "Boost",
    daysLeft: 1,
    totalDays: 3,
    impressions: 4210,
    targetImpressions: 5000,
    clicks: 187,
    ticketsFromAd: 12,
    status: "active" as const,
  },
  {
    id: "cp3",
    eventTitle: "Detty December",
    package: "Premium",
    daysLeft: 0,
    totalDays: 14,
    impressions: 112400,
    targetImpressions: 100000,
    clicks: 4310,
    ticketsFromAd: 287,
    status: "completed" as const,
  },
];

const PromoteEvent = () => {
  const { id } = useParams();
  const event = id ? mockEvents.find((e) => e.id === id) : null;
  const [selected, setSelected] = useState("spotlight");

  return (
    <DashboardLayout
      title={event ? `Promote: ${event.title}` : "Promote Your Events"}
      subtitle="Reach more attendees with our promotion packages"
      menu={organizerMenu}
    >
      {event && (
        <Link to="/organizer/events" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to events
        </Link>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {PACKAGES.map((pkg) => {
          const isSelected = selected === pkg.id;
          return (
            <button
              key={pkg.id}
              onClick={() => setSelected(pkg.id)}
              className={`relative rounded-2xl border-2 bg-card p-6 text-left transition-all ${
                isSelected ? "border-primary shadow-glow" : "border-border/50 hover:border-primary/30"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  Most Popular
                </span>
              )}
              <pkg.Icon className="mb-3 h-7 w-7 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">{pkg.name}</h3>
              <p className="mt-1 text-2xl font-bold text-foreground">{pkg.price}</p>
              <p className="mt-1 text-xs text-muted-foreground">Reach ~{pkg.reach} attendees</p>
              <ul className="mt-4 space-y-2">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary" /> {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={() => toast.success("Promotion activated! Your event is now boosted.")}
          className="gradient-primary text-primary-foreground shadow-glow"
        >
          <Megaphone className="mr-2 h-4 w-4" /> Activate Promotion
        </Button>
      </div>

      {/* Current Promotions */}
      <div className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Current Promotions</h2>
            <p className="text-sm text-muted-foreground">How your live campaigns are going</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CURRENT_PROMOTIONS.map((p) => {
            const pct = Math.min(100, Math.round((p.impressions / p.targetImpressions) * 100));
            const ctr = ((p.clicks / Math.max(p.impressions, 1)) * 100).toFixed(2);
            return (
              <div key={p.id} className="rounded-2xl border border-border/50 bg-card p-5 shadow-card">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="line-clamp-1 font-display text-base font-semibold text-foreground">
                      {p.eventTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.package} package</p>
                  </div>
                  <Badge
                    variant={p.status === "active" ? "default" : "secondary"}
                    className={p.status === "active" ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20" : ""}
                  >
                    {p.status === "active" ? `${p.daysLeft}d left` : "Completed"}
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Reach progress</span>
                    <span className="font-medium text-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.impressions.toLocaleString()} / {p.targetImpressions.toLocaleString()} impressions
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-secondary/40 p-2">
                    <Eye className="mx-auto mb-1 h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-semibold text-foreground">{(p.impressions / 1000).toFixed(1)}K</p>
                    <p className="text-[10px] text-muted-foreground">Views</p>
                  </div>
                  <div className="rounded-lg bg-secondary/40 p-2">
                    <MousePointerClick className="mx-auto mb-1 h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-semibold text-foreground">{ctr}%</p>
                    <p className="text-[10px] text-muted-foreground">CTR</p>
                  </div>
                  <div className="rounded-lg bg-secondary/40 p-2">
                    <Users className="mx-auto mb-1 h-3.5 w-3.5 text-primary" />
                    <p className="text-xs font-semibold text-foreground">{p.ticketsFromAd}</p>
                    <p className="text-[10px] text-muted-foreground">Tickets</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PromoteEvent;
