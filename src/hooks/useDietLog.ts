import { useCallback, useEffect, useState } from "react";
import { dateKey } from "@/data/workoutPlan";

export type Meal = {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  calories: number;
  protein: number;
  notes?: string;
};

export type DietDay = {
  date: string;
  meals: Meal[];
  waterLitres: number;
};

const STORAGE_KEY = "gym-tracker-diet-v1";

export function useDietLog() {
  const [days, setDays] = useState<Record<string, DietDay>>({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { try { setDays(JSON.parse(raw)); } catch { setDays({}); } }
  }, []);

  const persist = (next: Record<string, DietDay>) => {
    setDays(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const getDay = useCallback((date: Date): DietDay => {
    const key = dateKey(date);
    return days[key] ?? { date: key, meals: [], waterLitres: 0 };
  }, [days]);

  const addMeal = (date: Date, meal: Omit<Meal, "id">) => {
    const key = dateKey(date);
    const existing = days[key] ?? { date: key, meals: [], waterLitres: 0 };
    const next: DietDay = {
      ...existing,
      meals: [...existing.meals, { ...meal, id: `m-${Date.now()}` }],
    };
    persist({ ...days, [key]: next });
  };

  const removeMeal = (date: Date, id: string) => {
    const key = dateKey(date);
    const existing = days[key];
    if (!existing) return;
    persist({ ...days, [key]: { ...existing, meals: existing.meals.filter(m => m.id !== id) } });
  };

  const setWater = (date: Date, litres: number) => {
    const key = dateKey(date);
    const existing = days[key] ?? { date: key, meals: [], waterLitres: 0 };
    persist({ ...days, [key]: { ...existing, waterLitres: litres } });
  };

  return { days, getDay, addMeal, removeMeal, setWater };
}
