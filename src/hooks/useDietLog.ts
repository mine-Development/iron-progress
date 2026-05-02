import { useCallback, useEffect, useState } from "react";
import { dateKey } from "@/data/workoutPlan";

export type Meal = {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes?: string;
};

export type DietDay = {
  date: string;
  meals: Meal[];
  waterLitres: number;
};

export type DietTargets = {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterLitres: number;
};

export type MealTemplate = {
  id: string;
  type: Meal["type"];
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes?: string;
};

const STORAGE_KEY = "gym-tracker-diet-v2";
const TARGETS_KEY = "gym-tracker-diet-targets-v1";
const TEMPLATES_KEY = "gym-tracker-diet-templates-v1";
const LEGACY = ["gym-tracker-diet-v1"];

const defaultTargets: DietTargets = { calories: 2400, protein: 160, carbs: 250, fats: 70, waterLitres: 3 };

export function useDietLog() {
  const [days, setDays] = useState<Record<string, DietDay>>({});
  const [targets, setTargetsState] = useState<DietTargets>(defaultTargets);
  const [templates, setTemplates] = useState<MealTemplate[]>([]);

  useEffect(() => {
    LEGACY.forEach(k => {
      const raw = localStorage.getItem(k);
      if (raw && !localStorage.getItem(STORAGE_KEY)) {
        try {
          const parsed = JSON.parse(raw) as Record<string, DietDay>;
          // migrate, ensure macros default to 0
          const migrated: Record<string, DietDay> = {};
          for (const [key, d] of Object.entries(parsed)) {
            migrated[key] = {
              ...d,
              meals: d.meals.map(m => ({ carbs: 0, fats: 0, ...m })),
            };
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        } catch {}
      }
      localStorage.removeItem(k);
    });
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { try { setDays(JSON.parse(raw)); } catch { setDays({}); } }
    const t = localStorage.getItem(TARGETS_KEY);
    if (t) { try { setTargetsState({ ...defaultTargets, ...JSON.parse(t) }); } catch {} }
    const tpl = localStorage.getItem(TEMPLATES_KEY);
    if (tpl) { try { setTemplates(JSON.parse(tpl)); } catch {} }
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

  const setTargets = (t: DietTargets) => {
    setTargetsState(t);
    localStorage.setItem(TARGETS_KEY, JSON.stringify(t));
  };

  const addTemplate = (tpl: Omit<MealTemplate, "id">) => {
    const next = [...templates, { ...tpl, id: `tpl-${Date.now()}` }];
    setTemplates(next);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(next));
  };

  const removeTemplate = (id: string) => {
    const next = templates.filter(t => t.id !== id);
    setTemplates(next);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(next));
  };

  return { days, getDay, addMeal, removeMeal, setWater, targets, setTargets, templates, addTemplate, removeTemplate };
}

export const dayTotals = (day: DietDay) => day.meals.reduce(
  (a, m) => ({
    calories: a.calories + (m.calories || 0),
    protein: a.protein + (m.protein || 0),
    carbs: a.carbs + (m.carbs || 0),
    fats: a.fats + (m.fats || 0),
  }),
  { calories: 0, protein: 0, carbs: 0, fats: 0 },
);
