import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = { data: { date: string; volume: number }[] };

export const MonthlyTrend = ({ data }: Props) => (
  <div className="rounded-2xl border border-border gradient-card p-5 shadow-card animate-in-up">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">30-Day Volume Trend</h3>
      <span className="text-xs text-muted-foreground">Daily training volume</span>
    </div>
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} interval={4} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 12,
              color: "hsl(var(--foreground))",
            }}
            formatter={(v: number) => [`${v.toLocaleString()} kg`, "Volume"]}
          />
          <Area type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#vol)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
