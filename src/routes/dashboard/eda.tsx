import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { FlaskConical, AlertTriangle, MessageSquare } from "lucide-react";
import { DASHBOARD_DATA, fmtNum } from "@/lib/dashboard-data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/eda")({ component: EDAPage });

const TOOLTIP_STYLE = {
  contentStyle: { background: "#151C26", border: "1px solid #252E3B", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#E7EAEE" },
};

const FIELDS = [
  { key: "price" as const,        label: "Item Price (R$)",      color: "#F2B84B" },
  { key: "freight" as const,      label: "Freight Value (R$)",   color: "#5B8DEF" },
  { key: "paymentValue" as const, label: "Payment Value (R$)",   color: "#3ECF8E" },
  { key: "reviewScore" as const,  label: "Review Score",         color: "#B08BF0" },
  { key: "deliveryDays" as const, label: "Delivery Days",        color: "#E5646A" },
];

const reviewBarData = DASHBOARD_DATA.reviews.distribution.map(d => ({
  score: `★${d.score}`,
  count: d.count,
  fill: ["#E5646A","#F97316","#F2B84B","#3ECF8E","#22d3ee"][d.score - 1],
}));

function StatRow({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={`font-mono text-xs font-semibold ${accent ? "text-primary" : ""}`}>{value}</span>
    </div>
  );
}

function EDAPage() {
  const eda = DASHBOARD_DATA.eda;

  return (
    <div className="p-6 space-y-6 pb-12">
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="size-5 text-primary" />
        <div>
          <h1 className="text-base font-semibold">Exploratory Data Analysis</h1>
          <p className="text-[11px] text-muted-foreground">Statistical summary of numerical columns across 99,441 order records</p>
        </div>
      </div>

      {/* EDA stat cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((f, fi) => {
          const s = eda[f.key];
          return (
            <motion.div key={f.key} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: fi * 0.07 }}
              className="rounded-2xl border border-border bg-card/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold">{f.label}</h2>
                {s.outliers > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] text-red-400">
                    <AlertTriangle className="size-2.5" /> {fmtNum(s.outliers)} outliers
                  </span>
                )}
              </div>
              {/* Box-plot-style visualization */}
              <div className="relative h-8 mb-3">
                <div className="absolute inset-y-1 w-full rounded bg-muted/20" />
                <div
                  className="absolute inset-y-0 rounded"
                  style={{
                    left: `${Math.max(0,(s.q1-s.min)/(s.max-s.min)*100)}%`,
                    width: `${((s.q3-s.q1)/(s.max-s.min)*100)}%`,
                    background: f.color + "40",
                    border: `1px solid ${f.color}60`,
                  }}
                />
                <div
                  className="absolute inset-y-0 w-0.5 rounded"
                  style={{ left: `${(s.median-s.min)/(s.max-s.min)*100}%`, background: f.color }}
                />
              </div>
              <div className="space-y-0.5">
                <StatRow label="Count"  value={fmtNum(s.count)} />
                <StatRow label="Mean"   value={s.mean.toFixed(2)} accent />
                <StatRow label="Median" value={s.median.toFixed(2)} />
                <StatRow label="Std Dev" value={s.std.toFixed(2)} />
                <StatRow label="Q1 / Q3" value={`${s.q1} / ${s.q3}`} />
                <StatRow label="Min / Max" value={`${s.min} / ${s.max.toLocaleString()}`} />
              </div>
            </motion.div>
          );
        })}

        {/* Review score distribution bar */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
          className="rounded-2xl border border-border bg-card/60 p-4 sm:col-span-2 lg:col-span-1">
          <h2 className="mb-3 text-xs font-semibold">Review Score Distribution</h2>
          <p className="mb-3 text-[11px] text-muted-foreground">Avg: <span className="text-primary font-semibold">{DASHBOARD_DATA.reviews.avgScore}/5</span> across {fmtNum(DASHBOARD_DATA.reviews.distribution.reduce((a,b)=>a+b.count,0))} reviews</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={reviewBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252E3B" />
              <XAxis dataKey="score" tick={{ fill: "#8B94A3", fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [fmtNum(v), "Reviews"]} />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {reviewBarData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Categorical analysis */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="mb-4 text-sm font-semibold">Categorical Column Analysis</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Order Status", data: DASHBOARD_DATA.statusDist.slice(0,5), keyField: "status", valField: "pct" as const },
            { label: "Payment Type", data: DASHBOARD_DATA.payment.typeDist.slice(0,4).map(t => ({ status: t.type, pct: t.pct })), keyField: "status", valField: "pct" as const },
            { label: "Top States", data: DASHBOARD_DATA.customers.stateDist.slice(0,5).map(s => ({ status: s.state, pct: +(s.orders/DASHBOARD_DATA.kpis.totalOrders*100).toFixed(2) })), keyField: "status", valField: "pct" as const },
          ].map(col => (
            <div key={col.label}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{col.label}</p>
              <div className="space-y-2">
                {col.data.map((d, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="capitalize text-muted-foreground">{String((d as { status: string }).status).replace(/_/g,' ')}</span>
                      <span className="font-mono font-semibold">{(d as { pct: number }).pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                      <div className="h-full rounded-full bg-primary/70" style={{ width: `${Math.min((d as { pct: number }).pct, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <MessageSquare className="size-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Ask the AI Analyst</p>
          <p className="text-[11px] text-muted-foreground">"Show the distribution of payment values" or "Show average payment by method"</p>
        </div>
        <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
          Ask AI →
        </Link>
      </div>
    </div>
  );
}
