import { Link } from "react-router-dom";
import { Apple, ArrowRight, Droplet } from "lucide-react";
import { dayTotals, useDietLog } from "@/hooks/useDietLog";

const Bar = ({ value, target, label, unit }: { value: number; target: number; label: string; unit: string }) => {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-[11px] mb-1">
        <span className="text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="tabular-nums font-semibold">{Math.round(value)}<span className="text-muted-foreground">/{target}{unit}</span></span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div className="h-full gradient-ember transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export const DietSummaryCard = () => {
  const { getDay, targets } = useDietLog();
  const today = getDay(new Date());
  const totals = dayTotals(today);

  return (
    <section className="rounded-2xl border border-border gradient-card p-5 shadow-card mb-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-ember grid place-items-center shadow-ember">
            <Apple className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Today's Nutrition</h3>
            <p className="text-xs text-muted-foreground">{today.meals.length} meals logged</p>
          </div>
        </div>
        <Link to="/diet" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-ember text-primary-foreground text-xs font-semibold shadow-ember hover:opacity-90">
          Open diet tracker <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Bar value={totals.calories} target={targets.calories} label="Calories" unit="kcal" />
          <Bar value={totals.protein} target={targets.protein} label="Protein" unit="g" />
        </div>
        <div className="space-y-3">
          <Bar value={totals.carbs} target={targets.carbs} label="Carbs" unit="g" />
          <Bar value={totals.fats} target={targets.fats} label="Fats" unit="g" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-xs">
        <Droplet className="h-3.5 w-3.5 text-primary" />
        <span className="text-muted-foreground">Water</span>
        <span className="font-semibold tabular-nums">{today.waterLitres}L</span>
        <span className="text-muted-foreground">of {targets.waterLitres}L</span>
      </div>
    </section>
  );
};
