import type { ReactNode } from "react";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

/** Semantic tokens only — see --success / --warning in styles.css. */
const VARIANTS = {
  info: {
    icon: Info,
    defaultTitle: "Note",
    classes: "border-primary/30 bg-primary/10 [&>svg]:text-accent-strong",
  },
  tip: {
    icon: Lightbulb,
    defaultTitle: "Tip",
    classes: "border-success/40 bg-success/10 [&>svg]:text-success",
  },
  warning: {
    icon: TriangleAlert,
    defaultTitle: "Warning",
    classes: "border-warning/40 bg-warning/10 [&>svg]:text-warning",
  },
} as const;

export function Callout({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: keyof typeof VARIANTS;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { icon: Icon, defaultTitle, classes } = VARIANTS[variant];
  return (
    <Alert className={cn("my-6", classes, className)}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title ?? defaultTitle}</AlertTitle>
      <AlertDescription className="text-foreground/80">{children}</AlertDescription>
    </Alert>
  );
}
