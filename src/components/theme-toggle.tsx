import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors",
        "hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      {isDark ? (
        <Sun className="h-5 w-5" style={{ color: "hsl(45, 95%, 60%)" }} />
      ) : (
        <Moon className="h-5 w-5" style={{ color: "hsl(220, 15%, 10%)" }} fill="currentColor" />
      )}
    </button>
  );
}
