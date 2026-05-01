import { useMemo, useState } from "react";
import { Apple, CalendarDays, Droplet, Plus, Trash2, Utensils } from "lucide-react";
import { useDietLog, type Meal } from "@/hooks/useDietLog";
import { dateKey } from "@/data/workoutPlan";

const MEAL_TYPES: Meal["type"][] = ["breakfast", "lunch", "dinner", "snack"];

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export const DietPanel = () => {
  const { days, getDay, addMeal, removeMeal, setWater } = useDietLog();
  const [selected, setSelected] = useState<Date>(new Date());
  const [cursor, setCursor] = useState<Date>(startOfMonth(new Date()));

  const day = getDay(selected);
  const totals = useMemo(() => day.meals.reduce(
    (a, m) => ({ calories: a.calories + (m.calories || 0), protein: a.protein + (m.protein || 0) }),
    { calories: 0, protein: 0 }
  ), [day]);

  const [type, setType] = useState<Meal["type"]>("breakfast");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!name.trim()) { alert("Meal name required"); return; }
    addMeal(selected, {
      type, name: name.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      notes: notes.trim() || undefined,
    });
    setName(""); setCalories(""); setProtein(""); setNotes("");
  };

  // Calendar grid
  const monthStart = startOfMonth(cursor);
  const startWeekday = (monthStart.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));

  const monthLabel = cursor.toLocaleDateString("en", { month: "long", year: "numeric" });

  return (
    <section className="rounded-2xl border border-border gradient-card p-5 shadow-card mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-ember grid place-items-center shadow-ember">
            <Apple className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Diet Tracker</h3>
            <p className="text-xs text-muted-foreground">Plan meals and hydration day by day.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[320px_1fr] gap-5">
        {/* Calendar */}
        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="h-7 w-7 grid place-items-center rounded-md hover:bg-secondary">‹</button>
            <p className="text-sm font-semibold flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-primary" /> {monthLabel}
            </p>
            <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="h-7 w-7 grid place-items-center rounded-md hover:bg-secondary">›</button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground text-center mb-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <div key={i}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const k = dateKey(d);
              const has = (days[k]?.meals?.length ?? 0) > 0;
              const isSel = dateKey(selected) === k;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(d)}
                  className={`relative aspect-square rounded-md text-xs font-medium transition-all ${
                    isSel ? "gradient-ember text-primary-foreground shadow-ember"
                      : has ? "bg-success/15 text-foreground hover:bg-success/25"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  {d.getDate()}
                  {has && !isSel && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-success" />}
                </button>
              );
            })}
          </div>

          {/* Water */}
          <div className="mt-4 pt-4 border-t border-border">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Droplet className="h-3 w-3" /> Water (litres)
            </label>
            <input type="number" min={0} step={0.25} value={day.waterLitres || ""}
              onChange={e => setWater(selected, Number(e.target.value))}
              placeholder="0"
              className="mt-1 w-full h-9 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>

        {/* Day detail */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-xs text-muted-foreground">{selected.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</p>
              <p className="text-sm font-semibold">{day.meals.length} meals · {totals.calories} kcal · {totals.protein}g protein</p>
            </div>
          </div>

          {/* Add meal form */}
          <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Plus className="h-4 w-4 text-primary" /> Add meal
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <select value={type} onChange={e => setType(e.target.value as Meal["type"])}
                className="h-10 rounded-lg bg-input border border-border px-3 text-sm capitalize focus:border-primary focus:outline-none">
                {MEAL_TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Meal name (e.g. Oats & eggs)"
                className="h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
              <input type="number" min={0} value={calories}
                onChange={e => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Calories"
                className="h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
              <input type="number" min={0} value={protein}
                onChange={e => setProtein(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Protein (g)"
                className="h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
            </div>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" />
            <div className="flex justify-end">
              <button onClick={submit}
                className="px-4 py-2 rounded-lg gradient-ember text-primary-foreground text-sm font-semibold shadow-ember hover:opacity-90">
                Add meal
              </button>
            </div>
          </div>

          {/* Meal list */}
          <div className="space-y-2">
            {day.meals.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No meals logged for this day yet.</p>
            ) : MEAL_TYPES.map(t => {
              const meals = day.meals.filter(m => m.type === t);
              if (meals.length === 0) return null;
              return (
                <div key={t}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Utensils className="h-3 w-3" /> {t}
                  </p>
                  <div className="space-y-1.5">
                    {meals.map(m => (
                      <div key={m.id} className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{m.name}</p>
                          <p className="text-[11px] text-muted-foreground">{m.calories} kcal · {m.protein}g protein</p>
                          {m.notes && <p className="text-[11px] text-muted-foreground mt-1">{m.notes}</p>}
                        </div>
                        <button onClick={() => removeMeal(selected, m.id)}
                          className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
