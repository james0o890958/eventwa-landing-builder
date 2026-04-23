import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Megaphone, TrendingUp, Sparkles, Target, Check, ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { mockEvents } from "@/data/mockEvents";
import { toast } from "sonner";

const PACKAGES = [
  { id: "boost", name: "Boost", price: "₦5,000", reach: "5K", Icon: TrendingUp, features: ["Featured for 3 days", "Homepage carousel", "Push notifications"] },
  { id: "spotlight", name: "Spotlight", price: "₦15,000", reach: "25K", Icon: Sparkles, features: ["Featured for 7 days", "Top of search", "Email blast", "Social media post"], popular: true },
  { id: "premium", name: "Premium", price: "₦35,000", reach: "100K+", Icon: Target, features: ["Featured for 14 days", "All Spotlight perks", "Influencer mentions", "Dedicated banner"] },
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
    </DashboardLayout>
  );
};

export default PromoteEvent;
