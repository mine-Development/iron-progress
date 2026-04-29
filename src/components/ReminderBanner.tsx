import { TrendingUp, X } from "lucide-react";
import { useEffect, useState } from "react";

export const ReminderBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("reminder-dismissed-week");
    const week = `${new Date().getFullYear()}-${Math.floor(Date.now() / (7 * 86400000))}`;
    if (dismissed !== week) setShow(true);
  }, []);

  if (!show) return null;

  const dismiss = () => {
    const week = `${new Date().getFullYear()}-${Math.floor(Date.now() / (7 * 86400000))}`;
    localStorage.setItem("reminder-dismissed-week", week);
    setShow(false);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 p-4 mb-6 animate-in-up">
      <div className="absolute inset-0 gradient-ember opacity-20" />
      <div className="relative flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/20 grid place-items-center shrink-0">
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Progressive Overload Reminder</p>
          <p className="text-xs text-muted-foreground">Try to add 2.5–5 kg or 1–2 reps to your main lifts this week.</p>
        </div>
        <button onClick={dismiss} className="h-8 w-8 rounded-lg hover:bg-secondary grid place-items-center" aria-label="Dismiss">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
