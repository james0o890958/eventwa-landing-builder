import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      setIsDark(resolvedTheme === "dark");
    }
  }, [mounted, resolvedTheme]);

  const handleClick = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className="inline-flex h-5 w-9 items-center rounded-full border-2 border-transparent bg-input" />
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={handleClick}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isDark ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none flex h-4 w-4 items-center justify-center rounded-full bg-background shadow-sm ring-0 transition-transform",
          isDark ? "translate-x-4" : "translate-x-0.5"
        )}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-foreground" />
        ) : (
          <Sun className="h-3 w-3 text-foreground" />
        )}
      </span>
    </button>
  );
}
