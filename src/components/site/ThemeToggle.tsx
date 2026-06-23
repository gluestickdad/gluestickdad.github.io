import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, mounted, toggle } = useTheme();
  // Before mount we don't know the stored/OS theme; render a stable icon so
  // server and client markup match (no hydration warning).
  const isDark = mounted && theme === "dark";
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`grid h-10 w-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground ${className}`}
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  );
}
