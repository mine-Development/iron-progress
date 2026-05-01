import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Flame, Target, Trophy, BarChart3, Repeat } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { MonthlyTrend } from "@/components/MonthlyTrend";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import { WorkoutPanel } from "@/components/WorkoutPanel";
import { RestTimer } from "@/components/RestTimer";
import { ReminderBanner } from "@/components/ReminderBanner";
import { computeStats, useWorkoutLog } from "@/hooks/useWorkoutLog";
import { WORKOUT_PLAN, slugify } from "@/data/workoutPlan";

const Index = () => {
  const { logs, getLog, updateExercise, updateNotes } = useWorkoutLog();
  const [selected, setSelected] = useState<Date>(new Date());

  const stats = useMemo(() => computeStats(logs), [logs]);
  const log = getLog(selected);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-ember grid place-items-center shadow-ember">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">FORGE</h1>
              <p className="text-[11px] text-muted-foreground">6-Day Split Tracker</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold tabular-nums">{stats.streak}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <ReminderBanner />

        {/* Hero stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard
            label="Streak"
            value={`${stats.streak}d`}
            hint="Consecutive workouts"
            icon={Flame}
            accent
          />
          <StatCard
            label="This Week"
            value={`${stats.completedThisWeek}/6`}
            hint="Workouts completed"
            icon={Target}
          />
          <StatCard
            label="Total Volume"
            value={`${(stats.totalVolume / 1000).toFixed(1)}t`}
            hint="Last 7 days"
            icon={BarChart3}
          />
          <StatCard
            label="Total Sets"
            value={stats.totalSets}
            hint={`${stats.totalReps} reps`}
            icon={Repeat}
          />
        </section>

        {/* Charts */}
        <section className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <WeeklyChart data={stats.last7} />
          <MonthlyTrend data={stats.last30} />
        </section>

        {/* Calendar + workout panel */}
        <section className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="lg:col-span-2">
            <WorkoutPanel
              date={selected}
              log={log}
              onChangeExercise={(id, patch) => updateExercise(selected, id, patch)}
              onNotes={n => updateNotes(selected, n)}
            />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <WorkoutCalendar logs={logs} selected={selected} onSelect={setSelected} />
            <RestTimer />
          </div>
        </section>

        {/* 6-day split overview */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" /> Your 6-Day Split
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {WORKOUT_PLAN.map((day, i) => {
              const isToday = day.dayIndex === ((new Date().getDay() + 6) % 7);
              return (
                <Link
                  key={day.dayIndex}
                  to={`/workout/${slugify(day.muscleGroup)}`}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={`group relative overflow-hidden rounded-2xl border text-left transition-all hover:scale-[1.03] hover:border-primary/60 animate-in-up ${
                    isToday ? "border-primary shadow-ember" : "border-border"
                  }`}
                >
                  <div className="aspect-square overflow-hidden bg-card">
                    <img
                      src={day.image}
                      alt={day.muscleGroup}
                      width={256}
                      height={256}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3 gradient-card">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Day {day.dayIndex + 1}</p>
                    <p className="font-bold text-sm">{day.muscleGroup}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{day.exercises.length} exercises</p>
                  </div>
                  {isToday && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold gradient-ember text-primary-foreground">
                      TODAY
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Train hard. Track harder. — FORGE
      </footer>
    </div>
  );
};

export default Index;
