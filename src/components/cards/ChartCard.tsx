import { useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { Expand, X } from "lucide-react";
import type { ChartPayload } from "@/types";
import { cn } from "@/lib/utils";

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "var(--color-muted-foreground)",
];

const axisProps = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

const xAxisProps = {
  ...axisProps,
  tickFormatter: (value: any) => {
    if (typeof value === "string" && value.length > 14) {
      return value.substring(0, 14) + "...";
    }
    return value;
  },
};

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="mb-1 text-xs font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey ?? p.name} className="text-xs text-muted-foreground">
          <span
            className="mr-1.5 inline-block size-2 rounded-full align-middle"
            style={{ background: p.color ?? p.fill }}
          />
          {p.name}: <span className="font-medium text-foreground">{p.value?.toLocaleString?.()}</span>
        </p>
      ))}
    </div>
  );
}

function Figure({ payload }: { payload: ChartPayload }) {
  const { type, xKey, series } = payload;
  let { data } = payload;
  const grid = <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />;

  // Aggregate duplicate xKey values by averaging their Y values to prevent repeating labels/messy vertical lines
  if (data && data.length > 0 && xKey && type !== "scatter" && type !== "pie") {
    const grouped: Record<string, any> = {};
    data.forEach((item) => {
      const xVal = String(item[xKey]);
      if (!grouped[xVal]) {
        grouped[xVal] = { ...item, _count: 1 };
      } else {
        series.forEach((s) => {
          if (typeof item[s.key] === "number") {
            grouped[xVal][s.key] = (grouped[xVal][s.key] || 0) + item[s.key];
          }
        });
        grouped[xVal]._count += 1;
      }
    });

    data = Object.values(grouped).map((group) => {
      if (group._count > 1) {
        series.forEach((s) => {
          if (typeof group[s.key] === "number") {
            group[s.key] = Number((group[s.key] / group._count).toFixed(2));
          }
        });
      }
      const { _count, ...rest } = group;
      return rest;
    });
  }

  switch (type) {
    case "line":
      return (
        <LineChart data={data}>
          {grid}
          <XAxis dataKey={xKey} {...xAxisProps} />
          <YAxis {...axisProps} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border)" }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 0, fill: s.color }}
              activeDot={{ r: 5 }}
              animationDuration={900}
            />
          ))}
        </LineChart>
      );
    case "area":
      return (
        <AreaChart data={data}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.55} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.03} />
              </linearGradient>
            ))}
          </defs>
          {grid}
          <XAxis dataKey={xKey} {...xAxisProps} />
          <YAxis {...axisProps} />
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#grad-${s.key})`}
              animationDuration={900}
            />
          ))}
        </AreaChart>
      );
    case "pie":
      return (
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Pie
            data={data}
            dataKey={series[0].key}
            nameKey={xKey}
            innerRadius="45%"
            outerRadius="76%"
            paddingAngle={3}
            animationDuration={900}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="var(--color-card)" />
            ))}
          </Pie>
        </PieChart>
      );
    case "scatter":
      return (
        <ScatterChart>
          {grid}
          <XAxis dataKey={xKey} {...xAxisProps} />
          <YAxis dataKey={series[0].key} {...axisProps} />
          <Tooltip content={<ChartTooltip />} />
          <Scatter data={data} fill={series[0].color} animationDuration={900} />
        </ScatterChart>
      );
    case "hbar":
      return (
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
          <XAxis type="number" {...axisProps} />
          <YAxis type="category" dataKey={xKey} width={130} {...xAxisProps} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-accent)", opacity: 0.4 }} />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color}
              radius={[0, 6, 6, 0]}
              animationDuration={900}
            />
          ))}
        </BarChart>
      );
    default:
      return (
        <BarChart data={data}>
          {grid}
          <XAxis dataKey={xKey} {...xAxisProps} />
          <YAxis {...axisProps} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--color-accent)", opacity: 0.4 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={s.color}
              radius={[6, 6, 0, 0]}
              animationDuration={900}
            />
          ))}
        </BarChart>
      );
  }
}

export function ChartCard({ payload }: { payload: ChartPayload }) {
  const [full, setFull] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const body = (
    <div ref={ref} className={cn("w-full", full ? "h-[70vh]" : "h-72")}>
      <ResponsiveContainer width="100%" height="100%">
        {Figure({ payload })}
      </ResponsiveContainer>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="rounded-2xl border border-border bg-card/60 p-4 shadow-lg shadow-black/20 transition-shadow hover:shadow-xl"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-foreground">{payload.title}</h4>
            {payload.subtitle && (
              <p className="truncate text-xs text-muted-foreground">{payload.subtitle}</p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Tool label="Fullscreen" onClick={() => setFull(true)}>
              <Expand className="size-3.5" />
            </Tool>
          </div>
        </div>
        {!full && body}
      </motion.div>

      {full && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 grid place-items-center bg-background/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-6xl rounded-3xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-base font-semibold">{payload.title}</h4>
              <button
                aria-label="Close fullscreen chart"
                onClick={() => setFull(false)}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            {body}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}



function Tool({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-md text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {children}
    </button>
  );
}
