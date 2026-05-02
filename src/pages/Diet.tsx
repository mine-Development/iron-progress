import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Apple, ArrowLeft, BookmarkPlus, CalendarDays, Droplet, Plus, Settings, Star, Trash2, Utensils } from "lucide-react";
import { dayTotals, useDietLog, type Meal, type MealTemplate } from "@/hooks/useDietLog";
import { dateKey } from "@/data/workoutPlan";

const MEAL_TYPES: Meal["type"][] = ["breakfast", "lunch", "dinner", "snack"];
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

const Bar = ({ value, target, label, unit, color = "gradient-ember" }: { value: number; target: number; label: string; unit: string; color?: string }) => {
  const pct = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-[11px] mb-1">
        <span className="text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="tabular-nums font-semibold">{Math.round(value)}<span className="text-muted-foreground">/{target}{unit}</span></span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

const Diet = () => {
  const { days, getDay, addMeal, removeMeal, setWater, targets, setTargets, templates, addTemplate, removeTemplate } = useDietLog();
  const [selected, setSelected] = useState<Date>(new Date());
  const [cursor, setCursor] = useState<Date>(startOfMonth(new Date()));
  const [showTargets, setShowTargets] = useState(false);

  const day = getDay(selected);
  const totals = useMemo(() => dayTotals(day), [day]);

  // Form
  const [type, setType] = useState<Meal["type"]>("breakfast");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [fats, setFats] = useState<number | "">("");
  const [notes, setNotes] = useState("");

  const reset = () => { setName(""); setCalories(""); setProtein(""); setCarbs(""); setFats(""); setNotes(""); };

  const submit = () => {
    if (!name.trim()) { alert("Meal name required"); return; }
    addMeal(selected, {
      type, name: name.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      notes: notes.trim() || undefined,
    });
    reset();
  };

  const saveAsTemplate = () => {
    if (!name.trim()) { alert("Enter a meal name first."); return; }
    addTemplate({
      type, name: name.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fats: Number(fats) || 0,
      notes: notes.trim() || undefined,
    });
  };

  const useTemplate = (tpl: MealTemplate) => {
    addMeal(selected, {
      type: tpl.type, name: tpl.name,
      calories: tpl.calories, protein: tpl.protein, carbs: tpl.carbs, fats: tpl.fats,
      notes: tpl.notes,
    });
  };

  // Calendar grid
  const monthStart = startOfMonth(cursor);
  const startWeekday = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
  const monthLabel = cursor.toLocaleDateString("en", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
            <span className="text-muted-foreground">/</span>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-ember grid place-items-center shadow-ember">
                <Apple className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold">Diet Tracker</h1>
            </div>
          </div>
          <button onClick={() => setShowTargets(s => !s)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs hover:bg-secondary">
            <Settings className="h-3.5 w-3.5" /> Targets
          </button>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Targets editor */}
        {showTargets && (
          <section className="rounded-2xl border border-border gradient-card p-5 shadow-card">
            <h2 className="text-sm font-bold mb-3">Daily targets</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {([
                ["Calories (kcal)", "calories"],
                ["Protein (g)", "protein"],
                ["Carbs (g)", "carbs"],
                ["Fats (g)", "fats"],
                ["Water (L)", "waterLitres"],
              ] as const).map(([label, key]) => (
                <label key={key} className="block">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
                  <input type="number" min={0} step={key === "waterLitres" ? 0.25 : 1}
                    value={targets[key]}
                    onChange={e => setTargets({ ...targets, [key]: Number(e.target.value) })}
                    className="mt-1 w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                </label>
              ))}
            </div>
          </section>
        )}

        {/* Today summary */}
        <section className="rounded-2xl border border-border gradient-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="text-xs text-muted-foreground">{selected.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</p>
              <p className="text-sm font-semibold">{day.meals.length} meals · {totals.calories} kcal</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Droplet className="h-3.5 w-3.5 text-primary" />
              <input type="number" min={0} step={0.25} value={day.waterLitres || ""}
                onChange={e => setWater(selected, Number(e.target.value))}
                placeholder="0"
                className="w-20 h-8 rounded-lg bg-input border border-border px-2 text-sm focus:border-primary focus:outline-none" />
              <span className="text-muted-foreground">/ {targets.waterLitres}L water</span>
            </div>
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
        </section>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* Calendar */}
          <section className="rounded-2xl border border-border gradient-card p-5 shadow-card h-fit">
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
                  <button key={i} onClick={() => setSelected(d)}
                    className={`relative aspect-square rounded-md text-xs font-medium transition-all ${
                      isSel ? "gradient-ember text-primary-foreground shadow-ember"
                        : has ? "bg-success/15 text-foreground hover:bg-success/25"
                        : "hover:bg-secondary text-foreground"
                    }`}>
                    {d.getDate()}
                    {has && !isSel && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-success" />}
                  </button>
                );
              })}
            </div>

            {/* Templates */}
            <div className="mt-5 pt-4 border-t border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                <Star className="h-3 w-3" /> Meal templates
              </p>
              {templates.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">Save meals as templates from the form to re-add in one click.</p>
              ) : (
                <div className="space-y-1.5 max-h-60 overflow-auto pr-1">
                  {templates.map(tpl => (
                    <div key={tpl.id} className="flex items-center gap-2 rounded-lg border border-border bg-background/40 p-2">
                      <button onClick={() => useTemplate(tpl)} className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-semibold truncate">{tpl.name}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{tpl.type} · {tpl.calories}kcal · {tpl.protein}P/{tpl.carbs}C/{tpl.fats}F</p>
                      </button>
                      <button onClick={() => removeTemplate(tpl.id)}
                        className="h-6 w-6 grid place-items-center rounded text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Day detail */}
          <section className="space-y-4">
            <div className="rounded-2xl border border-border gradient-card p-5 shadow-card space-y-3">
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
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input type="number" min={0} value={calories}
                  onChange={e => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Calories"
                  className="h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                <input type="number" min={0} value={protein}
                  onChange={e => setProtein(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Protein (g)"
                  className="h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                <input type="number" min={0} value={carbs}
                  onChange={e => setCarbs(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Carbs (g)"
                  className="h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                <input type="number" min={0} value={fats}
                  onChange={e => setFats(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="Fats (g)"
                  className="h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
              </div>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" />
              <div className="flex justify-between items-center gap-2">
                <button onClick={saveAsTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs hover:bg-secondary">
                  <BookmarkPlus className="h-3.5 w-3.5" /> Save as template
                </button>
                <button onClick={submit}
                  className="px-4 py-2 rounded-lg gradient-ember text-primary-foreground text-sm font-semibold shadow-ember hover:opacity-90">
                  Add meal
                </button>
              </div>
            </div>

            {/* Meal list */}
            <div className="rounded-2xl border border-border gradient-card p-5 shadow-card space-y-3">
              <p className="text-sm font-semibold">Meals</p>
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
                            <p className="text-[11px] text-muted-foreground">
                              {m.calories} kcal · {m.protein}P · {m.carbs}C · {m.fats}F
                            </p>
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
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Eat with intent. — FORGE
      </footer>
    </div>
  );
};

export default Diet;
