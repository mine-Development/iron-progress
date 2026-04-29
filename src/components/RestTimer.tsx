import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [60, 90, 120, 180];

export const RestTimer = () => {
  const [duration, setDuration] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    ref.current = window.setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { setRunning(false); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const set = (s: number) => { setDuration(s); setRemaining(s); setRunning(false); };
  const reset = () => { setRemaining(duration); setRunning(false); };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = duration ? (remaining / duration) * 100 : 0;

  return (
    <div className="rounded-2xl border border-border gradient-card p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold"><Timer className="h-4 w-4 text-primary" /> Rest Timer</h3>
      </div>
      <div className="relative h-2 rounded-full bg-secondary overflow-hidden mb-4">
        <div className="absolute inset-y-0 left-0 gradient-ember transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-4xl font-bold tabular-nums">{mm}:{ss}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setRunning(r => !r)}
            className="h-10 w-10 rounded-xl gradient-ember text-primary-foreground grid place-items-center shadow-ember hover:scale-105 transition-transform"
          >
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={reset}
            className="h-10 w-10 rounded-xl border border-border hover:bg-secondary grid place-items-center transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => set(p)}
            className={cn(
              "py-2 rounded-lg text-xs font-medium border transition-colors",
              duration === p ? "border-primary text-primary bg-primary/10" : "border-border hover:bg-secondary"
            )}
          >
            {p}s
          </button>
        ))}
      </div>
    </div>
  );
};
