import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ShoppingCart, Truck, XCircle, Clock, MessageSquare } from "lucide-react";
import { DASHBOARD_DATA, fmtCurrency, fmtNum, fmtPct, STATUS_COLORS, titleCase } from "@/lib/dashboard-data";
import { KPICard } from "@/components/dashboard/KPICard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/orders")({ component: OrdersPage });

const TOOLTIP_STYLE = {
  contentStyle: { background: "#151C26", border: "1px solid #252E3B", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#E7EAEE" },
};

const STATUS_BADGE: Record<string, string> = {
  delivered: "bg-emerald-500/15 text-emerald-400",
  shipped: "bg-blue-500/15 text-blue-400",
  canceled: "bg-red-500/15 text-red-400",
  unavailable: "bg-muted/30 text-muted-foreground",
  invoiced: "bg-amber-500/15 text-amber-400",
  processing: "bg-violet-500/15 text-violet-400",
};

function OrdersPage() {
  const k = DASHBOARD_DATA.kpis;
  const sd = DASHBOARD_DATA.statusDist;
  const monthly = DASHBOARD_DATA.orders.monthly.slice(-18);
  const top5 = DASHBOARD_DATA.orders.top5Expensive;
  const maxCount = Math.max(...sd.map(d => d.count));

  return (
    <div className="p-6 space-y-6 pb-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Total Orders" value={fmtNum(k.totalOrders)} sub="All order statuses" icon={ShoppingCart} color="#F2B84B" delay={0} />
        <KPICard label="Delivered"    value={fmtNum(k.delivered)}   sub={fmtPct(k.deliveryRatePct) + " of total"} icon={Truck}         color="#3ECF8E" delay={0.05} />
        <KPICard label="Shipped"      value={fmtNum(k.shipped)}     sub={fmtPct(k.shipped/k.totalOrders*100) + " of total"} icon={Clock} color="#5B8DEF" delay={0.10} />
        <KPICard label="Cancelled"    value={fmtNum(k.canceled)}    sub={fmtPct(k.canceled/k.totalOrders*100) + " of total"} icon={XCircle} color="#E5646A" delay={0.15} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Bar Chart: Orders by Status */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sd} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#252E3B" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => fmtNum(v)} />
              <YAxis type="category" dataKey="status" tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} width={78} tickFormatter={titleCase} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [fmtNum(v), "Orders"]} />
              <Bar dataKey="count" radius={[0,4,4,0]}>
                {sd.map(s => <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? "#8B94A3"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Donut: Status Share */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold">Status Share</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={sd} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" paddingAngle={2}>
                  {sd.map(s => <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? "#8B94A3"} />)}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number, _name: string, props: { payload?: { status?: string } }) => [fmtNum(v), titleCase(props.payload?.status ?? "")]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {sd.map(s => (
                <div key={s.status} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: STATUS_COLORS[s.status] ?? "#8B94A3" }} />
                    <span className="text-muted-foreground">{titleCase(s.status)}</span>
                  </span>
                  <span className="font-mono font-semibold">{fmtPct(s.pct)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Monthly Volume Line */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="mb-4 text-sm font-semibold">Monthly Order Volume</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252E3B" />
            <XAxis dataKey="month" tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
            <YAxis tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [fmtNum(v), "Orders"]} />
            <Line type="monotone" dataKey="orders" stroke="#F2B84B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top 5 Most Expensive Orders */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold">Top 5 Most Expensive Orders</h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">#</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Order ID</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">State</th>
                <th className="pb-2 text-right text-[10px] uppercase tracking-wider text-muted-foreground">Value</th>
              </tr>
            </thead>
            <tbody>
              {top5.map((o, i) => (
                <tr key={o.orderId} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 font-mono text-primary">{i + 1}</td>
                  <td className="py-2.5 font-mono text-foreground/70">{o.orderId}…</td>
                  <td className="py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_BADGE[o.status] ?? ""}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{o.state}</td>
                  <td className="py-2.5 text-right font-mono font-semibold text-amber-400">{fmtCurrency(o.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Delivery Stats */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.40 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold">Delivery Performance</h2>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-xl bg-background/60 p-4 text-center">
              <p className="font-mono text-2xl font-bold text-amber-400">{DASHBOARD_DATA.delivery.avgDeliveryDays}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Avg. Delivery Days</p>
            </div>
            <div className="rounded-xl bg-background/60 p-4 text-center">
              <p className="font-mono text-2xl font-bold text-emerald-400">{fmtPct(DASHBOARD_DATA.delivery.onTimePct)}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">On Time or Early</p>
            </div>
          </div>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status breakdown</p>
          <div className="space-y-2">
            {sd.map(s => (
              <div key={s.status} className="flex items-center gap-2">
                <span className="w-[100px] shrink-0 text-[11px] capitalize text-muted-foreground">{titleCase(s.status)}</span>
                <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(s.count/maxCount*100).toFixed(1)}%`, background: STATUS_COLORS[s.status] ?? "#8B94A3" }} />
                </div>
                <span className="w-12 text-right font-mono text-[11px]">{fmtPct(s.pct)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <MessageSquare className="size-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Dig deeper with AI</p>
          <p className="text-[11px] text-muted-foreground">"Show the number of orders by status" or "Show monthly orders trend"</p>
        </div>
        <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
          Ask AI →
        </Link>
      </div>
    </div>
  );
}
