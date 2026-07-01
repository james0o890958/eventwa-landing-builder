import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Eye, Users, Ticket, Loader2, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { organizerMenu } from "@/config/dashboardMenus";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const fmt = (n: number) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `₦${(n / 1_000).toFixed(1)}K` : `₦${n.toLocaleString()}`;

interface AnalyticsData {
  page_views: { total: number; growth_percentage: number };
  total_attendees: { total: number; growth_percentage: number };
  tickets_sold: { total: number; growth_percentage: number };
  revenue: { total: number; growth_percentage: number };
  event_performance: { title: string; percentage: number }[];
}

const OrganizerAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("organizer_token") || localStorage.getItem("access_token") || undefined;
    setLoading(true);
    api
      .get("organizer/analytics", undefined, token)
      .then((res) => {
        setAnalytics(res.analytics ?? res);
      })
      .catch((err) => {
        console.error("Failed to load analytics:", err);
        setError(err.message || "Failed to load analytics.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Analytics" subtitle="Track performance across all your events" menu={organizerMenu}>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !analytics) {
    return (
      <DashboardLayout title="Analytics" subtitle="Track performance across all your events" menu={organizerMenu}>
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-muted-foreground text-sm">{error || "No analytics data available."}</p>
        </div>
      </DashboardLayout>
    );
  }

  const formatGrowth = (g: number) => `${g >= 0 ? "+" : ""}${g.toFixed(1)}%`;

  const KPIS = [
    { Icon: Eye, label: "Page Views", value: analytics.page_views.total.toLocaleString(), trend: formatGrowth(analytics.page_views.growth_percentage) },
    { Icon: Users, label: "Total Attendees", value: analytics.total_attendees.total.toLocaleString(), trend: formatGrowth(analytics.total_attendees.growth_percentage) },
    { Icon: Ticket, label: "Tickets Sold", value: analytics.tickets_sold.total.toLocaleString(), trend: formatGrowth(analytics.tickets_sold.growth_percentage) },
    { Icon: BarChart3, label: "Revenue", value: fmt(analytics.revenue.total), trend: formatGrowth(analytics.revenue.growth_percentage) },
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
        {analytics.event_performance.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No events to display yet.</p>
        ) : (
          <div className="space-y-4">
            {analytics.event_performance.map((e, i) => (
              <div key={i}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="truncate text-foreground">{e.title}</span>
                  <span className="text-muted-foreground">{e.percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${e.percentage}%` }}
                    transition={{ duration: 0.8, delay: i * 0.05 }}
                    className="h-full gradient-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerAnalytics;
