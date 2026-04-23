import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

export interface MenuItem {
  label: string;
  to: string;
  Icon: LucideIcon;
  badge?: number | string;
  end?: boolean;
}

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  menu: MenuItem[];
  menuTitle?: string;
  children: ReactNode;
}

const DashboardLayout = ({ title, subtitle, menu, menuTitle = "Menu", children }: DashboardLayoutProps) => {
  const location = useLocation();

  const isActive = (item: MenuItem) =>
    item.end ? location.pathname === item.to : location.pathname === item.to || location.pathname.startsWith(item.to + "/");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/50 bg-card p-3 shadow-card">
              <p className="mb-2 px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {menuTitle}
              </p>
              <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                {menu.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                        active
                          ? "gradient-primary text-primary-foreground shadow-glow"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      <item.Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 whitespace-nowrap">{item.label}</span>
                      {item.badge !== undefined && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                            active ? "bg-white/20 text-white" : "bg-primary/10 text-primary",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
