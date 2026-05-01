import { useState } from "react";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useCustomWorkouts } from "@/hooks/useCustomWorkouts";
import type { Exercise } from "@/data/workoutPlan";
import { Link } from "react-router-dom";
import { slugify } from "@/data/workoutPlan";

type Draft = { name: string; sets: number; reps: string; muscle: string; instructions: string };

const emptyDraft: Draft = { name: "", sets: 3, reps: "10-12", muscle: "", instructions: "" };

export const CustomWorkoutManager = () => {
  const { items, add, remove } = useCustomWorkouts();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [image, setImage] = useState<string>("");
  const [drafts, setDrafts] = useState<Draft[]>([{ ...emptyDraft }]);

  const reset = () => {
    setTitle(""); setMuscleGroup(""); setImage(""); setDrafts([{ ...emptyDraft }]); setOpen(false);
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 2_500_000) { alert("Image too large. Max 2.5 MB."); return; }
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(file);
  };

  const submit = () => {
    if (!title.trim() || !muscleGroup.trim() || !image) {
      alert("Title, muscle group and an image are required.");
      return;
    }
    const exercises: Exercise[] = drafts
      .filter(d => d.name.trim())
      .map((d, i) => ({
        id: `cx-${Date.now()}-${i}`,
        name: d.name.trim(),
        sets: Number(d.sets) || 3,
        reps: d.reps || "10",
        muscle: d.muscle.trim() || muscleGroup,
        instructions: d.instructions.trim() || "Maintain good form and full range of motion.",
      }));
    if (exercises.length === 0) { alert("Add at least one exercise."); return; }
    add({ title: title.trim(), muscleGroup: muscleGroup.trim(), image, exercises });
    reset();
  };

  return (
    <section className="rounded-2xl border border-border gradient-card p-5 shadow-card mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Custom Workouts</h3>
          <p className="text-xs text-muted-foreground">Create your own plans with images and exercises.</p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg gradient-ember text-primary-foreground text-sm font-semibold shadow-ember hover:opacity-90 transition"
        >
          {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {open ? "Cancel" : "Add workout"}
        </button>
      </div>

      {open && (
        <div className="space-y-4 rounded-xl border border-border bg-secondary/30 p-4 mb-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Title</span>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Push Day"
                className="mt-1 w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Muscle group</span>
              <input value={muscleGroup} onChange={e => setMuscleGroup(e.target.value)} placeholder="e.g. Chest & Triceps"
                className="mt-1 w-full h-10 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
            </label>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Position image</span>
            <div className="mt-1 flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-input cursor-pointer text-sm hover:border-primary">
                <Upload className="h-4 w-4" /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files?.[0])} />
              </label>
              {image && (
                <img src={image} alt="preview" className="h-12 w-12 rounded-lg object-cover border border-border" />
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Exercises</span>
              <button
                onClick={() => setDrafts(d => [...d, { ...emptyDraft }])}
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add exercise
              </button>
            </div>
            {drafts.map((d, i) => (
              <div key={i} className="rounded-lg border border-border bg-background/40 p-3 space-y-2">
                <div className="flex gap-2">
                  <input value={d.name} onChange={e => setDrafts(arr => arr.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                    placeholder="Exercise name"
                    className="flex-1 h-9 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                  <button onClick={() => setDrafts(arr => arr.length > 1 ? arr.filter((_, j) => j !== i) : arr)}
                    className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:border-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" min={1} value={d.sets}
                    onChange={e => setDrafts(arr => arr.map((x, j) => j === i ? { ...x, sets: Number(e.target.value) } : x))}
                    placeholder="Sets"
                    className="h-9 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                  <input value={d.reps}
                    onChange={e => setDrafts(arr => arr.map((x, j) => j === i ? { ...x, reps: e.target.value } : x))}
                    placeholder="Reps (e.g. 8-10)"
                    className="h-9 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                  <input value={d.muscle}
                    onChange={e => setDrafts(arr => arr.map((x, j) => j === i ? { ...x, muscle: e.target.value } : x))}
                    placeholder="Muscle"
                    className="h-9 rounded-lg bg-input border border-border px-3 text-sm focus:border-primary focus:outline-none" />
                </div>
                <textarea rows={2} value={d.instructions}
                  onChange={e => setDrafts(arr => arr.map((x, j) => j === i ? { ...x, instructions: e.target.value } : x))}
                  placeholder="Form & position cues"
                  className="w-full rounded-lg bg-input border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={reset} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-secondary">Cancel</button>
            <button onClick={submit} className="px-4 py-2 rounded-lg gradient-ember text-primary-foreground text-sm font-semibold shadow-ember hover:opacity-90">
              Save workout
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No custom workouts yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(w => (
            <div key={w.id} className="group relative rounded-xl border border-border overflow-hidden">
              <Link to={`/workout/${slugify(w.muscleGroup)}`}>
                <div className="aspect-video bg-card overflow-hidden">
                  <img src={w.image} alt={w.muscleGroup} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3 gradient-card">
                  <p className="font-bold text-sm truncate">{w.title}</p>
                  <p className="text-[11px] text-muted-foreground">{w.exercises.length} exercises · {w.muscleGroup}</p>
                </div>
              </Link>
              <button onClick={() => { if (confirm("Remove this workout?")) remove(w.id); }}
                className="absolute top-2 right-2 h-7 w-7 grid place-items-center rounded-full bg-background/80 border border-border hover:border-destructive hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
