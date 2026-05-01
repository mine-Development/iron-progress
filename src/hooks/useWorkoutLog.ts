import { useCallback, useEffect, useState } from "react";
import { dateKey, WORKOUT_PLAN, getWorkoutForDate } from "@/data/workoutPlan";

export type ExerciseLog = {
  weight: number;
  reps: number;
  sets: number;
  done: boolean;
};

export type DayLog = {
  date: string; // YYYY-MM-DD
  dayIndex: number;
  exercises: Record<string, ExerciseLog>;
  notes?: string;
  completed: boolean;
};

const STORAGE_KEY = "gym-tracker-logs-v2";
const LEGACY_KEYS = ["gym-tracker-logs-v1"];

export function useWorkoutLog() {
  const [logs, setLogs] = useState<Record<string, DayLog>>({});

  useEffect(() => {
    // Clear any legacy data
    LEGACY_KEYS.forEach(k => localStorage.removeItem(k));
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setLogs(JSON.parse(raw)); return; } catch {}
    }
    setLogs({});
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
  }, []);

  const persist = (next: Record<string, DayLog>) => {
    setLogs(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const getLog = useCallback((date: Date): DayLog => {
    const key = dateKey(date);
    if (logs[key]) return logs[key];
    const plan = getWorkoutForDate(date);
    return {
      date: key,
      dayIndex: plan.dayIndex,
      exercises: {},
      completed: false,
    };
  }, [logs]);

  const updateExercise = (date: Date, exerciseId: string, patch: Partial<ExerciseLog>) => {
    const key = dateKey(date);
    const plan = getWorkoutForDate(date);
    const existing = logs[key] ?? {
      date: key,
      dayIndex: plan.dayIndex,
      exercises: {},
      completed: false,
    };
    const current = existing.exercises[exerciseId] ?? { weight: 0, reps: 0, sets: 0, done: false };
    const next: DayLog = {
      ...existing,
      exercises: { ...existing.exercises, [exerciseId]: { ...current, ...patch } },
    };
    next.completed = plan.exercises.every(ex => next.exercises[ex.id]?.done);
    persist({ ...logs, [key]: next });
  };

  const updateNotes = (date: Date, notes: string) => {
    const key = dateKey(date);
    const plan = getWorkoutForDate(date);
    const existing = logs[key] ?? {
      date: key,
      dayIndex: plan.dayIndex,
      exercises: {},
      completed: false,
    };
    persist({ ...logs, [key]: { ...existing, notes } });
  };

  return { logs, getLog, updateExercise, updateNotes };
}

// ---------- analytics helpers ----------

export const computeVolume = (log: DayLog) =>
  Object.values(log.exercises).reduce((sum, ex) => sum + (ex.done ? ex.weight * ex.reps * ex.sets : 0), 0);

export const computeStats = (logs: Record<string, DayLog>) => {
  const today = new Date();
  const last7: { day: string; volume: number; completed: boolean }[] = [];
  let totalSets = 0, totalReps = 0, totalVolume = 0, completedThisWeek = 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const log = logs[dateKey(d)];
    const vol = log ? computeVolume(log) : 0;
    last7.push({
      day: d.toLocaleDateString("en", { weekday: "short" }),
      volume: vol,
      completed: log?.completed ?? false,
    });
    if (log?.completed) completedThisWeek++;
    if (log) {
      Object.values(log.exercises).forEach(ex => {
        if (ex.done) { totalSets += ex.sets; totalReps += ex.reps * ex.sets; totalVolume += ex.weight * ex.reps * ex.sets; }
      });
    }
  }

  // Streak: walk back from today (or yesterday) counting completed days
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const log = logs[dateKey(d)];
    if (log?.completed) streak++;
    else if (i === 0) continue; // today not done yet, don't break
    else break;
  }

  // Monthly volume trend (last 30 days)
  const last30: { date: string; volume: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const log = logs[dateKey(d)];
    last30.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      volume: log ? computeVolume(log) : 0,
    });
  }

  return { last7, last30, totalSets, totalReps, totalVolume, completedThisWeek, streak };
};

export const exerciseProgress = (logs: Record<string, DayLog>, exerciseId: string) => {
  const points: { date: string; weight: number }[] = [];
  Object.values(logs)
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach(log => {
      const ex = log.exercises[exerciseId];
      if (ex?.done && ex.weight > 0) {
        const [y, m, day] = log.date.split("-");
        points.push({ date: `${m}/${day}`, weight: ex.weight });
      }
    });
  return points;
};

export { WORKOUT_PLAN };
