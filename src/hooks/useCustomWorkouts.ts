import { useCallback, useEffect, useState } from "react";
import type { Exercise, WorkoutDay } from "@/data/workoutPlan";

const STORAGE_KEY = "gym-tracker-custom-workouts-v1";

export type CustomWorkout = WorkoutDay & { custom: true; id: string };

export function useCustomWorkouts() {
  const [items, setItems] = useState<CustomWorkout[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setItems(JSON.parse(raw)); } catch { setItems([]); }
    }
  }, []);

  const persist = (next: CustomWorkout[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const add = useCallback((data: { title: string; muscleGroup: string; image: string; exercises: Exercise[] }) => {
    const id = `custom-${Date.now()}`;
    const w: CustomWorkout = {
      custom: true,
      id,
      dayIndex: 100, // not on weekly schedule
      title: data.title,
      muscleGroup: data.muscleGroup,
      image: data.image,
      exercises: data.exercises,
    };
    const next = [...items, w];
    persist(next);
    return w;
  }, [items]);

  const remove = useCallback((id: string) => {
    persist(items.filter(i => i.id !== id));
  }, [items]);

  return { items, add, remove };
}
