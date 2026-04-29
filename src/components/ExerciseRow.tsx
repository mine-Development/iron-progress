import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/data/workoutPlan";
import type { ExerciseLog } from "@/hooks/useWorkoutLog";

type Props = {
  exercise: Exercise;
  log: ExerciseLog;
  onChange: (patch: Partial<ExerciseLog>) => void;
};

export const ExerciseRow = ({ exercise, log, onChange }: Props) => {
  return (
    <div className={cn(
      "rounded-xl border border-border bg-secondary/30 p-4 transition-all",
      log.done && "border-success/40 bg-success/5"
    )}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-foreground truncate">{exercise.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            <span className="text-primary font-medium">{exercise.sets} × {exercise.reps}</span> · {exercise.muscle}
          </p>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{exercise.instructions}</p>
        </div>
        <button
          onClick={() => onChange({ done: !log.done })}
          aria-label="Mark complete"
          className={cn(
            "shrink-0 h-9 w-9 rounded-lg grid place-items-center transition-all border",
            log.done
              ? "gradient-ember text-primary-foreground border-transparent shadow-ember"
              : "border-border hover:border-primary"
          )}
        >
          <Check className={cn("h-4 w-4", !log.done && "opacity-40")} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {([
          ["Weight", "weight", "kg"],
          ["Reps", "reps", ""],
          ["Sets", "sets", ""],
        ] as const).map(([label, key, unit]) => (
          <label key={key} className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
            <div className="relative mt-1">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={log[key] || ""}
                onChange={e => onChange({ [key]: Number(e.target.value) } as Partial<ExerciseLog>)}
                placeholder="0"
                className="w-full h-10 rounded-lg bg-input border border-border px-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
              {unit && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{unit}</span>}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
