import chestImg from "@/assets/muscle-chest.jpg";
import backImg from "@/assets/muscle-back.jpg";
import shouldersImg from "@/assets/muscle-shoulders.jpg";
import bicepsImg from "@/assets/muscle-biceps.jpg";
import tricepsImg from "@/assets/muscle-triceps.jpg";
import legsImg from "@/assets/muscle-legs.jpg";
import coreImg from "@/assets/muscle-core.jpg";

import exBenchPress from "@/assets/ex-bench-press.jpg";
import exInclineDbPress from "@/assets/ex-incline-db-press.jpg";
import exCableFly from "@/assets/ex-cable-fly.jpg";
import exPushups from "@/assets/ex-pushups.jpg";
import exCloseGripBench from "@/assets/ex-close-grip-bench.jpg";
import exSkullCrushers from "@/assets/ex-skull-crushers.jpg";
import exTricepPushdown from "@/assets/ex-tricep-pushdown.jpg";
import exOverheadExtension from "@/assets/ex-overhead-extension.jpg";
import exOverheadPress from "@/assets/ex-overhead-press.jpg";
import exLateralRaise from "@/assets/ex-lateral-raise.jpg";
import exRearDeltFly from "@/assets/ex-rear-delt-fly.jpg";
import exShrugs from "@/assets/ex-shrugs.jpg";
import exDeadlift from "@/assets/ex-deadlift.jpg";
import exPullups from "@/assets/ex-pullups.jpg";
import exBarbellRow from "@/assets/ex-barbell-row.jpg";
import exFacePulls from "@/assets/ex-face-pulls.jpg";
import exBarbellCurl from "@/assets/ex-barbell-curl.jpg";
import exInclineCurl from "@/assets/ex-incline-curl.jpg";
import exHammerCurl from "@/assets/ex-hammer-curl.jpg";
import exCableCurl from "@/assets/ex-cable-curl.jpg";
import exBackSquat from "@/assets/ex-back-squat.jpg";
import exRdl from "@/assets/ex-rdl.jpg";
import exLegPress from "@/assets/ex-leg-press.jpg";
import exCalfRaise from "@/assets/ex-calf-raise.jpg";
import exPlank from "@/assets/ex-plank.jpg";
import exLegRaise from "@/assets/ex-leg-raise.jpg";
import exCableCrunch from "@/assets/ex-cable-crunch.jpg";

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  instructions: string;
  muscle: string;
  image?: string;
};

export type WorkoutDay = {
  dayIndex: number; // 0 = Monday
  title: string;
  muscleGroup: string;
  image: string;
  exercises: Exercise[];
};

export const WORKOUT_PLAN: WorkoutDay[] = [
  {
    dayIndex: 0,
    title: "Day 1 — Chest",
    muscleGroup: "Chest",
    image: chestImg,
    exercises: [
      { id: "c1", name: "Barbell Bench Press", sets: 4, reps: "6-8", instructions: "Keep shoulders retracted and lower the bar to mid-chest with control.", muscle: "Pectorals" },
      { id: "c2", name: "Incline Dumbbell Press", sets: 4, reps: "8-10", instructions: "Set bench to 30°. Drive dumbbells up and slightly inward.", muscle: "Upper Chest" },
      { id: "c3", name: "Cable Fly", sets: 3, reps: "12-15", instructions: "Slight bend in elbows; squeeze chest at the bottom.", muscle: "Inner Chest" },
      { id: "c4", name: "Push-ups", sets: 3, reps: "AMRAP", instructions: "Body straight from head to heels; full range of motion.", muscle: "Chest & Triceps" },
    ],
  },
  {
    dayIndex: 1,
    title: "Day 2 — Triceps",
    muscleGroup: "Triceps",
    image: tricepsImg,
    exercises: [
      { id: "t1", name: "Close-Grip Bench Press", sets: 4, reps: "6-8", instructions: "Hands shoulder-width; tuck elbows.", muscle: "Triceps" },
      { id: "t2", name: "Skull Crushers", sets: 3, reps: "10-12", instructions: "Lower bar to forehead; only elbows move.", muscle: "Long Head" },
      { id: "t3", name: "Tricep Pushdown", sets: 3, reps: "12-15", instructions: "Elbows pinned; full extension.", muscle: "Lateral Head" },
      { id: "t4", name: "Overhead Extension", sets: 3, reps: "12-15", instructions: "Stretch deeply at the bottom.", muscle: "Long Head" },
    ],
  },
  {
    dayIndex: 2,
    title: "Day 3 — Shoulders",
    muscleGroup: "Shoulders",
    image: shouldersImg,
    exercises: [
      { id: "s1", name: "Overhead Press", sets: 4, reps: "6-8", instructions: "Brace core; press bar straight overhead.", muscle: "Front Delts" },
      { id: "s2", name: "Lateral Raise", sets: 4, reps: "12-15", instructions: "Lead with elbows; slight forward lean.", muscle: "Side Delts" },
      { id: "s3", name: "Rear Delt Fly", sets: 3, reps: "12-15", instructions: "Hinge forward; squeeze shoulder blades.", muscle: "Rear Delts" },
      { id: "s4", name: "Shrugs", sets: 3, reps: "10-12", instructions: "Lift straight up; pause at the top.", muscle: "Traps" },
    ],
  },
  {
    dayIndex: 3,
    title: "Day 4 — Back",
    muscleGroup: "Back",
    image: backImg,
    exercises: [
      { id: "b1", name: "Deadlift", sets: 4, reps: "5", instructions: "Bar over mid-foot, neutral spine, drive through floor.", muscle: "Posterior Chain" },
      { id: "b2", name: "Pull-ups", sets: 4, reps: "6-10", instructions: "Pull chest to bar; control the descent.", muscle: "Lats" },
      { id: "b3", name: "Barbell Row", sets: 4, reps: "8-10", instructions: "Hinge ~45°; row to lower ribs.", muscle: "Mid-Back" },
      { id: "b4", name: "Face Pulls", sets: 3, reps: "12-15", instructions: "Pull rope to forehead; externally rotate.", muscle: "Rear Delts" },
    ],
  },
  {
    dayIndex: 4,
    title: "Day 5 — Biceps",
    muscleGroup: "Biceps",
    image: bicepsImg,
    exercises: [
      { id: "bi1", name: "Barbell Curl", sets: 4, reps: "8-10", instructions: "Elbows pinned to sides; full ROM.", muscle: "Biceps" },
      { id: "bi2", name: "Incline Dumbbell Curl", sets: 3, reps: "10-12", instructions: "Lean back to stretch the biceps.", muscle: "Long Head" },
      { id: "bi3", name: "Hammer Curl", sets: 3, reps: "10-12", instructions: "Neutral grip; control the negative.", muscle: "Brachialis" },
      { id: "bi4", name: "Cable Curl", sets: 3, reps: "12-15", instructions: "Constant tension; squeeze at the top.", muscle: "Biceps" },
    ],
  },
  {
    dayIndex: 5,
    title: "Day 6 — Legs",
    muscleGroup: "Legs",
    image: legsImg,
    exercises: [
      { id: "l1", name: "Back Squat", sets: 5, reps: "5-8", instructions: "Break at hips and knees; chest up.", muscle: "Quads & Glutes" },
      { id: "l2", name: "Romanian Deadlift", sets: 4, reps: "8-10", instructions: "Hinge hips back; feel hamstring stretch.", muscle: "Hamstrings" },
      { id: "l3", name: "Leg Press", sets: 3, reps: "10-12", instructions: "Don't lock knees; full ROM.", muscle: "Quads" },
      { id: "l4", name: "Calf Raise", sets: 4, reps: "12-15", instructions: "Pause at top; full stretch at bottom.", muscle: "Calves" },
    ],
  },
  {
    dayIndex: 6,
    title: "Day 7 — Rest / Core",
    muscleGroup: "Core",
    image: coreImg,
    exercises: [
      { id: "co1", name: "Plank", sets: 3, reps: "60s", instructions: "Body in a straight line; brace hard.", muscle: "Core" },
      { id: "co2", name: "Hanging Leg Raise", sets: 3, reps: "10-12", instructions: "Control the swing; raise legs to parallel.", muscle: "Lower Abs" },
      { id: "co3", name: "Cable Crunch", sets: 3, reps: "12-15", instructions: "Crunch the ribs toward hips.", muscle: "Upper Abs" },
    ],
  },
];

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const WEEKLY_PLAN_KEY = "gym-tracker-weekly-plan-v1";

export const getActivePlan = (): WorkoutDay[] => {
  if (typeof window === "undefined") return WORKOUT_PLAN;
  try {
    const raw = localStorage.getItem(WEEKLY_PLAN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as WorkoutDay[];
      if (Array.isArray(parsed) && parsed.length === 7) return parsed;
    }
  } catch {}
  return WORKOUT_PLAN;
};

export const getWorkoutBySlug = (slug: string): WorkoutDay | undefined =>
  getActivePlan().find(d => slugify(d.muscleGroup) === slug);

export const getWorkoutForDate = (date: Date): WorkoutDay => {
  const jsDay = date.getDay(); // 0=Sun
  const idx = jsDay === 0 ? 6 : jsDay - 1;
  return getActivePlan()[idx];
};

export const dateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
