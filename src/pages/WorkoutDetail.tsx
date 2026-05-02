import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Dumbbell, Target, Info } from "lucide-react";
import { getActivePlan, getWorkoutBySlug, slugify } from "@/data/workoutPlan";

const WorkoutDetail = () => {
  const { slug = "" } = useParams();
  const workout = getWorkoutBySlug(slug);
  const plan = getActivePlan();

  if (!workout) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Workout not found</h1>
          <Link to="/" className="text-primary underline underline-offset-4">Back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img src={workout.image} alt={workout.muscleGroup} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Day {workout.dayIndex + 1}</p>
          <h1 className="text-4xl sm:text-6xl font-bold mt-2">{workout.muscleGroup}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {workout.exercises.length} exercises focused on building strength and hypertrophy in your {workout.muscleGroup.toLowerCase()}.
            Train with intent — control every rep, focus on the target muscle, and progressively overload week over week.
          </p>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* About */}
        <section className="mb-10 rounded-2xl border border-border gradient-card p-5 sm:p-6 shadow-card">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
            <Info className="h-5 w-5 text-primary" /> About this workout
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This {workout.muscleGroup} session is part of your 6-day split. Warm up with 5–10 minutes of light cardio
            and dynamic mobility. Perform 1–2 ramp-up sets before your working sets. Rest 60–90s between accessory sets,
            and 2–3 minutes between heavy compound lifts.
          </p>
        </section>

        {/* Exercises */}
        <section>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Dumbbell className="h-5 w-5 text-primary" /> Exercises
          </h2>
          <div className="space-y-4">
            {workout.exercises.map((ex, i) => (
              <article
                key={ex.id}
                style={{ animationDelay: `${i * 60}ms` }}
                className="grid sm:grid-cols-[180px_1fr] gap-4 rounded-2xl border border-border gradient-card overflow-hidden shadow-card animate-in-up"
              >
                <div className="aspect-square sm:aspect-auto bg-secondary/40 overflow-hidden">
                  <img
                    src={workout.image}
                    alt={`${ex.name} – ${ex.muscle}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="text-lg font-bold">{ex.name}</h3>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <Target className="h-3 w-3" /> {ex.muscle}
                      </p>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-secondary border border-border font-semibold">
                        {ex.sets} sets
                      </span>
                      <span className="px-2.5 py-1 rounded-full gradient-ember text-primary-foreground font-semibold">
                        {ex.reps} reps
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Form & position</p>
                    <p className="text-sm leading-relaxed">{ex.instructions}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Other workouts */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Other days</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {plan.filter(d => d.dayIndex !== workout.dayIndex).map(d => (
              <Link
                key={d.dayIndex}
                to={`/workout/${slugify(d.muscleGroup)}`}
                className="rounded-xl border border-border overflow-hidden hover:border-primary/60 hover:scale-[1.03] transition-all"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={d.image} alt={d.muscleGroup} className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5 gradient-card">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Day {d.dayIndex + 1}</p>
                  <p className="text-sm font-bold">{d.muscleGroup}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Train hard. Track harder. — FORGE
      </footer>
    </div>
  );
};

export default WorkoutDetail;
