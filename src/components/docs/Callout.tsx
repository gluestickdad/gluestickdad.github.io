import type { ReactNode } from "react";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const VARIANTS = {
  info: {
    icon: Info,
    defaultTitle: "Note",
    classes: "border-sky/30 bg-sky/10 [&>svg]:text-sky",
  },
  tip: {
    icon: Lightbulb,
    defaultTitle: "Tip",
    classes: "border-emerald-500/40 bg-emerald-500/10 [&>svg]:text-emerald-500",
  },
  warning: {
    icon: TriangleAlert,
    defaultTitle: "Warning",
    classes: "border-amber-500/40 bg-amber-500/10 [&>svg]:text-amber-500",
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
