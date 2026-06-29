import { useState } from "react";
import { Check, CreditCard, Download, Crown } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PLANS = [
  { id: "starter", name: "Starter", price: 0, period: "Free forever", features: ["Up to 3 events / month", "Basic analytics", "Email support"] },
  { id: "pro", name: "Pro", price: 9_900, period: "/month", features: ["Unlimited events", "Advanced analytics", "Custom branding", "Priority support"], popular: true },
  { id: "business", name: "Business", price: 29_900, period: "/month", features: ["Everything in Pro", "Multiple team seats", "API access", "Dedicated manager"] },
];

const INVOICES = [
  { id: "INV-1042", date: "Mar 15, 2026", amount: "₦9,900", status: "Paid" },
  { id: "INV-1018", date: "Feb 15, 2026", amount: "₦9,900", status: "Paid" },
  { id: "INV-0987", date: "Jan 15, 2026", amount: "₦9,900", status: "Paid" },
];

const OrganizerSubscriptions = () => {
  const [current, setCurrent] = useState("pro");
  return (
    <DashboardLayout
      title="Subscriptions & Billing"
      subtitle="Manage your plan, payment method, and invoices"
      menu={organizerMenu}
    >
      <div className="mb-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-accent/5 p-5 shadow-card">
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Current plan</p>
            <p className="font-display text-xl font-bold text-foreground">Pro — Renews Apr 15, 2026</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const isCurrent = current === p.id;
          return (
            <div key={p.id} className={`relative rounded-2xl border-2 bg-card p-6 ${p.popular ? "border-primary shadow-glow" : "border-border/50"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  Recommended
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-foreground">{p.name}</h3>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">
                {p.price === 0 ? "Free" : `₦${p.price.toLocaleString()}`}
                <span className="ml-1 text-sm font-normal text-muted-foreground">{p.period}</span>
              </p>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => {
                  setCurrent(p.id);
                  toast.success(`Switched to ${p.name} plan`);
                }}
                disabled={isCurrent}
                className={`mt-5 w-full ${p.popular && !isCurrent ? "gradient-primary text-primary-foreground" : ""}`}
                variant={isCurrent ? "secondary" : p.popular ? "default" : "outline"}
              >
                {isCurrent ? "Current Plan" : "Switch"}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-border/50 bg-card p-5 shadow-card">
        <h3 className="mb-4 flex items-center gap-2 font-display font-semibold text-foreground">
          <CreditCard className="h-4 w-4 text-primary" /> Payment Method
        </h3>
        <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Visa •••• 4242</p>
            <p className="text-xs text-muted-foreground">Expires 09/27</p>
          </div>
          <Button variant="secondary" size="sm">Update</Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
        <div className="border-b border-border/50 px-5 py-4">
          <h3 className="font-display font-semibold text-foreground">Invoices</h3>
        </div>
        {INVOICES.map((inv, i) => (
          <div key={inv.id} className={`flex items-center justify-between px-5 py-4 ${i < INVOICES.length - 1 ? "border-b border-border/30" : ""}`}>
            <div>
              <p className="text-sm font-medium text-foreground">{inv.id}</p>
              <p className="text-xs text-muted-foreground">{inv.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">{inv.amount}</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">{inv.status}</span>
              <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerSubscriptions;
