import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: boolean;
  className?: string;
};

export const StatCard = ({ label, value, hint, icon: Icon, accent, className }: Props) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-2xl border border-border p-5 shadow-card animate-in-up gradient-card",
      accent && "border-primary/40",
      className
    )}
  >
    {accent && <div className="absolute inset-0 opacity-30 gradient-ember pointer-events-none" />}
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl",
        accent ? "bg-primary-foreground/10 text-primary-foreground" : "bg-secondary text-primary"
      )}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </div>
);
