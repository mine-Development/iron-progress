import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

type Props = { data: { day: string; volume: number; completed: boolean }[] };

export const WeeklyChart = ({ data }: Props) => (
  <div className="rounded-2xl border border-border gradient-card p-5 shadow-card animate-in-up">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">This Week's Volume</h3>
      <span className="text-xs text-muted-foreground">sets × reps</span>
    </div>
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              color: "hsl(var(--foreground))",
            }}
            formatter={(v: number) => [`${v.toLocaleString()} reps`, "Volume"]}
          />
          <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.completed ? "hsl(var(--primary))" : "hsl(var(--muted))"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
