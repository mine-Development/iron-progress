import { useCallback, useEffect, useState } from "react";
import { WORKOUT_PLAN, type WorkoutDay, type Exercise } from "@/data/workoutPlan";

const STORAGE_KEY = "gym-tracker-weekly-plan-v1";

export type PlanDay = WorkoutDay;

const defaults = (): PlanDay[] =>
  WORKOUT_PLAN.map(d => ({
    dayIndex: d.dayIndex,
    title: d.title,
    muscleGroup: d.muscleGroup,
    image: d.image,
    exercises: d.exercises.map(e => ({ ...e })),
  }));

export function useWeeklyPlan() {
  const [plan, setPlan] = useState<PlanDay[]>(() => defaults());

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as PlanDay[];
        if (Array.isArray(parsed) && parsed.length === 7) {
          setPlan(parsed);
          return;
        }
      } catch {}
    }
  }, []);

  const persist = (next: PlanDay[]) => {
    setPlan(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const updateDay = useCallback((dayIndex: number, patch: Partial<PlanDay>) => {
    setPlan(prev => {
      const next = prev.map(d => (d.dayIndex === dayIndex ? { ...d, ...patch } : d));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addExercise = useCallback((dayIndex: number, ex: Omit<Exercise, "id">) => {
    setPlan(prev => {
      const next = prev.map(d =>
        d.dayIndex === dayIndex
          ? { ...d, exercises: [...d.exercises, { ...ex, id: `ex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }] }
          : d,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateExercise = useCallback((dayIndex: number, exId: string, patch: Partial<Exercise>) => {
    setPlan(prev => {
      const next = prev.map(d =>
        d.dayIndex === dayIndex
          ? { ...d, exercises: d.exercises.map(e => (e.id === exId ? { ...e, ...patch } : e)) }
          : d,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeExercise = useCallback((dayIndex: number, exId: string) => {
    setPlan(prev => {
      const next = prev.map(d =>
        d.dayIndex === dayIndex ? { ...d, exercises: d.exercises.filter(e => e.id !== exId) } : d,
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const resetDay = useCallback((dayIndex: number) => {
    const def = defaults().find(d => d.dayIndex === dayIndex)!;
    updateDay(dayIndex, def);
  }, [updateDay]);

  const resetAll = useCallback(() => persist(defaults()), []);

  return { plan, updateDay, addExercise, updateExercise, removeExercise, resetDay, resetAll };
}

export const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
