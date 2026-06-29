import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Eye, Users, Ticket } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { mockEvents } from "@/data/mockEvents";

const fmt = (n: number) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `₦${(n / 1_000).toFixed(1)}K` : `₦${n.toLocaleString()}`;

const OrganizerAnalytics = () => {
  const events = mockEvents.slice(0, 6);
  const totalAttendees = events.reduce((s, e) => s + e.attendees, 0);
  const revenue = events.reduce((s, e) => s + e.price * Math.floor(e.attendees * 0.7), 0);

  const KPIS = [
    { Icon: Eye, label: "Page Views", value: "24.3K", trend: "+12%" },
    { Icon: Users, label: "Total Attendees", value: totalAttendees.toLocaleString(), trend: "+8%" },
    { Icon: Ticket, label: "Tickets Sold", value: Math.floor(totalAttendees * 0.7).toLocaleString(), trend: "+15%" },
    { Icon: BarChart3, label: "Revenue", value: fmt(revenue), trend: "+22%" },
  ];

  return (
    <DashboardLayout title="Analytics" subtitle="Track performance across all your events" menu={organizerMenu}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {KPIS.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border/50 bg-card p-5 shadow-card"
          >
            <k.Icon className="mb-2 h-5 w-5 text-primary" />
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="font-display mt-1 text-2xl font-bold text-foreground">{k.value}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
              <TrendingUp className="h-3 w-3" /> {k.trend} this month
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border/50 bg-card p-6 shadow-card">
        <h3 className="mb-4 font-display font-semibold text-foreground">Event Performance</h3>
        <div className="space-y-4">
          {events.map((e, i) => {
            const sold = Math.floor(e.attendees * 0.7);
            const pct = Math.min(100, Math.round((sold / e.attendees) * 100));
            return (
              <div key={e.id}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="truncate text-foreground">{e.title}</span>
                  <span className="text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="h-full gradient-primary"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerAnalytics;
