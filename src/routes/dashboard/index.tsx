import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingCart, Users, Package, DollarSign, Star, Truck, Store, MessageSquare, Database } from "lucide-react";
import { DASHBOARD_DATA, fmtCurrency, fmtNum, fmtPct, STATUS_COLORS, titleCase } from "@/lib/dashboard-data";
import { KPICard } from "@/components/dashboard/KPICard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/")({ component: OverviewPage });

const k = DASHBOARD_DATA.kpis;

const TOOLTIP_STYLE = {
  contentStyle: { background: "#151C26", border: "1px solid #252E3B", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#E7EAEE" },
};

function OverviewPage() {
  const monthly = DASHBOARD_DATA.orders.monthly.slice(-18);
  const statusData = DASHBOARD_DATA.statusDist.filter(s => s.count > 0);

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Notice for Judges / Database Connection Banner */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3.5 rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent p-4 shadow-lg shadow-amber-950/20 backdrop-blur-md ring-1 ring-amber-500/25"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/25 text-amber-300 ring-1 ring-amber-500/40">
          <Database className="size-5 animate-pulse text-amber-300" />
        </div>
        <div className="flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              ⚡ Database Connection Notice
            </span>
            <span className="rounded-full bg-amber-500/25 px-2 py-0.5 text-[10px] font-semibold text-amber-300 ring-1 ring-amber-400/30">
              Notice for Judges
            </span>
          </div>
          <p className="text-xs leading-relaxed font-medium text-foreground/90">
            Your first question may take a little longer while we connect to the database. Once connected, you can continue exploring your data with faster responses.
          </p>
        </div>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Total Orders"     value={fmtNum(k.totalOrders)}            sub="All-time orders in dataset"   icon={ShoppingCart} color="#F2B84B" delay={0} />
        <KPICard label="Total Revenue"    value={`R$ ${(k.totalPaymentValue/1e6).toFixed(2)}M`} sub="Gross payment value"  icon={DollarSign}   color="#3ECF8E" delay={0.05} />
        <KPICard label="Customers"        value={fmtNum(k.totalCustomers)}          sub="Unique buyer accounts"        icon={Users}        color="#5B8DEF" delay={0.10} />
        <KPICard label="Avg. Order Value" value={`R$ ${k.avgOrderValue.toFixed(2)}`} sub="Per payment record"          icon={TrendingUp}   color="#B08BF0" delay={0.15} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Delivered"      value={fmtPct(k.deliveryRatePct)}        sub={`${fmtNum(k.delivered)} orders`}    icon={Truck}    color="#3ECF8E" delay={0.20} />
        <KPICard label="Products"       value={fmtNum(k.totalProducts)}          sub="Unique SKUs in catalog"            icon={Package}  color="#F2B84B" delay={0.25} />
        <KPICard label="Sellers"        value={fmtNum(k.totalSellers)}           sub="Active seller accounts"            icon={Store}    color="#4FD1C5" delay={0.30} />
        <KPICard label="Avg. Review"    value="4.09 / 5"                          sub="Based on 99,224 reviews"          icon={Star}     color="#F97316" delay={0.35} />
      </div>

      {/* Monthly Revenue Area Chart */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Monthly Revenue Trend</h2>
            <p className="text-[11px] text-muted-foreground">Sep 2016 – Aug 2018 · R$ BRL</p>
          </div>
          <span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">+1,024% YoY growth</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthly}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3ECF8E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3ECF8E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#252E3B" />
            <XAxis dataKey="month" tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
            <YAxis tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [fmtCurrency(v), "Revenue"]} />
            <Area type="monotone" dataKey="revenue" stroke="#3ECF8E" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Orders + Status Side-by-side */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Orders Bar */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold">Monthly Order Volume</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252E3B" />
              <XAxis dataKey="month" tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [fmtNum(v), "Orders"]} />
              <Bar dataKey="orders" fill="#F2B84BCC" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution Pie */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold">Order Status Distribution</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" paddingAngle={2}>
                  {statusData.map((s) => (
                    <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? "#8B94A3"} />
                  ))}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number, _name: string, props: { payload?: { status?: string } }) => [fmtNum(v), titleCase(props.payload?.status ?? "")]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="min-w-0 flex-1 space-y-1.5">
              {statusData.map(s => (
                <div key={s.status} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: STATUS_COLORS[s.status] ?? "#8B94A3" }} />
                    <span className="capitalize text-muted-foreground">{titleCase(s.status)}</span>
                  </span>
                  <span className="font-mono font-semibold">{fmtPct(s.pct)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold">Key Insights</h2>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">AI-generated</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {DASHBOARD_DATA.insights.map((insight, i) => (
            <div key={i} className="flex gap-2.5 rounded-xl bg-background/60 px-3 py-2.5">
              <span className="font-mono text-[11px] font-bold text-primary shrink-0 mt-0.5">{String(i+1).padStart(2,'0')}</span>
              <p className="text-[12px] leading-relaxed text-foreground/80">{insight}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Ask AI CTA */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
        className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <MessageSquare className="size-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Want a deeper analysis?</p>
          <p className="text-[11px] text-muted-foreground">Ask the AI Analyst anything about this data.</p>
        </div>
        <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          Ask AI →
        </Link>
      </motion.div>
    </div>
  );
}
