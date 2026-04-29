import { CalendarDays, StickyNote } from "lucide-react";
import { ExerciseRow } from "./ExerciseRow";
import { getWorkoutForDate } from "@/data/workoutPlan";
import type { DayLog, ExerciseLog } from "@/hooks/useWorkoutLog";

type Props = {
  date: Date;
  log: DayLog;
  onChangeExercise: (id: string, patch: Partial<ExerciseLog>) => void;
  onNotes: (notes: string) => void;
};

export const WorkoutPanel = ({ date, log, onChangeExercise, onNotes }: Props) => {
  const plan = getWorkoutForDate(date);
  const dateLabel = date.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });
  const completed = plan.exercises.filter(ex => log.exercises[ex.id]?.done).length;
  const pct = (completed / plan.exercises.length) * 100;

  return (
    <div className="rounded-2xl border border-border gradient-card overflow-hidden shadow-card animate-in-up">
      <div className="relative p-5 border-b border-border">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src={plan.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
        </div>
        <div className="relative flex items-start gap-4">
          <img
            src={plan.image}
            alt={plan.muscleGroup}
            width={64}
            height={64}
            loading="lazy"
            className="h-16 w-16 rounded-xl object-cover border border-border"
          />
          <div className="flex-1 min-w-0">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" />{dateLabel}
            </p>
            <h2 className="text-2xl font-bold mt-0.5">{plan.title}</h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full gradient-ember transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-medium text-muted-foreground tabular-nums">{completed}/{plan.exercises.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {plan.exercises.map(ex => (
          <ExerciseRow
            key={ex.id}
            exercise={ex}
            log={log.exercises[ex.id] ?? { weight: 0, reps: 0, sets: 0, done: false }}
            onChange={patch => onChangeExercise(ex.id, patch)}
          />
        ))}

        <div className="pt-2">
          <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            <StickyNote className="h-3 w-3" /> Notes
          </label>
          <textarea
            value={log.notes ?? ""}
            onChange={e => onNotes(e.target.value)}
            placeholder="How did it feel? Any PRs?"
            rows={2}
            className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
