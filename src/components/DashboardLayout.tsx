import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon, ChevronDown } from "lucide-react";
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
  title?: string;
  subtitle?: string;
  menu: MenuItem[];
  menuTitle?: string;
  children: ReactNode;
}

const DashboardLayout = ({ title, subtitle, menu, menuTitle = "Menu", children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (item: MenuItem) =>
    item.end ? location.pathname === item.to : location.pathname === item.to || location.pathname.startsWith(item.to + "/");

  const activeItem = menu.find((item) => isActive(item)) || menu[0];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 sm:pt-24 pb-16 max-w-full">
        {title && (
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}

        {/* Mobile Navigation Dropdown (< lg screens) */}
        <div className="lg:hidden mb-6 max-w-full">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {menuTitle}
          </p>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 shadow-card transition-colors hover:border-primary/50 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <activeItem.Icon className="h-5 w-5 shrink-0 text-primary" />
              <span className="font-medium text-foreground text-sm truncate">{activeItem.label}</span>
              {activeItem.badge !== undefined && (
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary shrink-0">
                  {activeItem.badge}
                </span>
              )}
            </div>
            <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground", mobileMenuOpen && "rotate-180")} />
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 rounded-xl border border-border/60 bg-card p-2 shadow-xl space-y-1 z-20">
              {menu.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "gradient-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold",
                          active ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr] max-w-full">
          {/* Desktop Sidebar Navigation (lg+ screens) */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border/50 bg-card p-3 shadow-card">
              <p className="mb-2 px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {menuTitle}
              </p>
              <nav className="flex flex-col gap-1">
                {menu.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
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
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0",
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

          {/* Main Content Area */}
          <main className="min-w-0 max-w-full overflow-hidden">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
