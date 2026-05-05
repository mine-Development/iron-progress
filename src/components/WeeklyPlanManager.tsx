import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Pencil, Plus, RotateCcw, Trash2, Upload, X } from "lucide-react";
import { DAY_NAMES, useWeeklyPlan } from "@/hooks/useWeeklyPlan";
import { slugify, type Exercise } from "@/data/workoutPlan";

type Draft = { name: string; sets: number; reps: string; muscle: string; instructions: string; image: string };
const emptyDraft: Draft = { name: "", sets: 3, reps: "10-12", muscle: "", instructions: "", image: "" };

const readImage = (file: File | undefined, cb: (url: string) => void) => {
  if (!file) return;
  if (file.size > 2_500_000) { alert("Image too large. Max 2.5 MB."); return; }
  const r = new FileReader();
  r.onload = () => cb(String(r.result));
  r.readAsDataURL(file);
};

export const WeeklyPlanManager = () => {
  const { plan, updateDay, addExercise, updateExercise, removeExercise, resetDay, resetAll } = useWeeklyPlan();
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft>({ ...emptyDraft });
  const [editing, setEditing] = useState<{ dayIndex: number; exId: string } | null>(null);

  const submit = (dayIndex: number) => {
    if (!draft.name.trim()) { alert("Exercise name required"); return; }
    const payload: Omit<Exercise, "id"> = {
      name: draft.name.trim(),
      sets: Number(draft.sets) || 3,
      reps: draft.reps || "10",
      muscle: draft.muscle.trim() || plan.find(p => p.dayIndex === dayIndex)?.muscleGroup || "",
      instructions: draft.instructions.trim() || "Maintain good form and full range of motion.",
      image: draft.image || undefined,
    };
    if (editing && editing.dayIndex === dayIndex) {
      updateExercise(dayIndex, editing.exId, payload);
      setEditing(null);
    } else {
      addExercise(dayIndex, payload);
    }
    setDraft({ ...emptyDraft });
  };

  return (
    <section className="rounded-2xl border border-border gradient-card p-5 shadow-card mb-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-lg font-bold">Your Weekly Plan</h3>
          <p className="text-xs text-muted-foreground">Edit exercises, sets, reps, notes and reference image for each day.</p>
        </div>
        <button
          onClick={() => { if (confirm("Reset all 7 days to defaults?")) resetAll(); }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs hover:bg-secondary"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset all
        </button>
      </div>

      <div className="space-y-3">
        {plan.map(day => {
          const isOpen = openDay === day.dayIndex;
          return (
            <div key={day.dayIndex} className="rounded-xl border border-border overflow-hidden bg-secondary/20">
              <button
                onClick={() => { setOpenDay(isOpen ? null : day.dayIndex); setDraft({ ...emptyDraft }); setEditing(null); }}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/40 transition"
              >
                <img src={day.image} alt={day.muscleGroup} className="h-14 w-14 rounded-lg object-cover border border-border" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{DAY_NAMES[day.dayIndex]}</p>
                  <p className="font-bold text-sm truncate">{day.title}</p>
                  <p className="text-[11px] text-muted-foreground">{day.muscleGroup} · {day.exercises.length} exercises</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="border-t border-border p-4 space-y-4 bg-background/30">
                  {/* Day meta */}
                  <div className="grid sm:grid-cols-[120px_1fr_1fr] gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Image</span>
                      <label className="mt-1 block aspect-square rounded-lg border border-border overflow-hidden cursor-pointer relative group">
                        <img src={day.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 grid place-items-center text-xs gap-1 transition">
                          <Upload className="h-4 w-4" /> Replace
                        </div>
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => readImage(e.target.files?.[0], url => updateDay(day.dayIndex, { image: url }))} />
                      </label>
                    </div>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Title</span>
                      <input value={day.title} onChange={e => updateDay(day.dayIndex, { title: e.target.value })}
                        className="mt-1 w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Muscle group</span>
                      <input value={day.muscleGroup} onChange={e => updateDay(day.dayIndex, { muscleGroup: e.target.value })}
                        className="mt-1 w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                    </label>
                  </div>

                  {/* Exercises */}
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Exercises</p>
                    {day.exercises.length === 0 && (
                      <p className="text-xs text-muted-foreground">No exercises yet. Add one below.</p>
                    )}
                    {day.exercises.map(ex => (
                      <div key={ex.id} className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{ex.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            {ex.muscle} · {ex.sets} sets × {ex.reps} reps
                          </p>
                          {ex.instructions && (
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{ex.instructions}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditing({ dayIndex: day.dayIndex, exId: ex.id });
                              setDraft({ name: ex.name, sets: ex.sets, reps: ex.reps, muscle: ex.muscle, instructions: ex.instructions });
                            }}
                            className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => { if (confirm("Remove this exercise?")) removeExercise(day.dayIndex, ex.id); }}
                            className="h-7 w-7 grid place-items-center rounded-md text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add / edit form */}
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold flex items-center gap-1.5">
                        {editing && editing.dayIndex === day.dayIndex
                          ? <><Pencil className="h-3.5 w-3.5 text-primary" /> Edit exercise</>
                          : <><Plus className="h-3.5 w-3.5 text-primary" /> Add exercise</>}
                      </p>
                      {editing && editing.dayIndex === day.dayIndex && (
                        <button onClick={() => { setEditing(null); setDraft({ ...emptyDraft }); }}
                          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                          <X className="h-3 w-3" /> Cancel edit
                        </button>
                      )}
                    </div>
                    <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                      placeholder="Exercise name (e.g. Bench Press)"
                      className="w-full h-9 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" min={1} value={draft.sets}
                        onChange={e => setDraft(d => ({ ...d, sets: Number(e.target.value) }))}
                        placeholder="Sets"
                        className="h-9 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                      <input value={draft.reps}
                        onChange={e => setDraft(d => ({ ...d, reps: e.target.value }))}
                        placeholder="Reps (8-10)"
                        className="h-9 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                      <input value={draft.muscle}
                        onChange={e => setDraft(d => ({ ...d, muscle: e.target.value }))}
                        placeholder="Muscle"
                        className="h-9 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                    </div>
                    <textarea rows={2} value={draft.instructions}
                      onChange={e => setDraft(d => ({ ...d, instructions: e.target.value }))}
                      placeholder="Note / form cues"
                      className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" />
                    <div className="flex justify-between items-center gap-2">
                      <button onClick={() => { if (confirm("Reset this day to defaults?")) resetDay(day.dayIndex); }}
                        className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" /> Reset day
                      </button>
                      <div className="flex gap-2">
                        <Link to={`/workout/${slugify(day.muscleGroup)}`}
                          className="px-3 py-2 rounded-lg border border-border text-xs hover:bg-secondary">
                          View page
                        </Link>
                        <button onClick={() => submit(day.dayIndex)}
                          className="px-4 py-2 rounded-lg gradient-ember text-primary-foreground text-xs font-semibold shadow-ember hover:opacity-90">
                          {editing && editing.dayIndex === day.dayIndex ? "Save changes" : "Add exercise"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
