import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { dateKey, getWorkoutForDate } from "@/data/workoutPlan";
import type { DayLog } from "@/hooks/useWorkoutLog";

type Props = {
  logs: Record<string, DayLog>;
  selected: Date;
  onSelect: (d: Date) => void;
};

export const WorkoutCalendar = ({ logs, selected, onSelect }: Props) => {
  const [view, setView] = useState(() => {
    const d = new Date(selected);
    d.setDate(1);
    return d;
  });

  const monthLabel = view.toLocaleDateString("en", { month: "long", year: "numeric" });
  const firstDow = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7; // Mon-first
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const today = new Date();
  const todayKey = dateKey(today);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));

  return (
    <div className="rounded-2xl border border-border gradient-card p-5 shadow-card animate-in-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{monthLabel}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
            className="h-8 w-8 rounded-lg border border-border hover:bg-secondary grid place-items-center transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
            className="h-8 w-8 rounded-lg border border-border hover:bg-secondary grid place-items-center transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const key = dateKey(d);
          const log = logs[key];
          const isToday = key === todayKey;
          const isSelected = key === dateKey(selected);
          const isPast = d < today && !isToday;
          const plan = getWorkoutForDate(d);
          const isRest = plan.dayIndex === 6;

          let state: "completed" | "missed" | "planned" | "rest" = "planned";
          if (log?.completed) state = "completed";
          else if (isPast && !log?.completed) state = "missed";
          if (isRest && !log?.completed) state = "rest";

          return (
            <button
              key={i}
              onClick={() => onSelect(d)}
              className={cn(
                "relative aspect-square rounded-xl text-sm font-medium transition-all border",
                "hover:scale-105 hover:border-primary/60",
                isSelected ? "ring-2 ring-primary border-primary" : "border-border",
                state === "completed" && "bg-success/20 text-success border-success/40",
                state === "missed" && "bg-destructive/15 text-destructive/90 border-destructive/30",
                state === "planned" && "bg-secondary/40 text-foreground",
                state === "rest" && "bg-muted/40 text-muted-foreground border-dashed",
                isToday && "animate-pulse-ember"
              )}
            >
              {d.getDate()}
              {log?.completed && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-success" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Completed</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" /> Missed</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Planned</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground" /> Rest</span>
      </div>
    </div>
  );
};
