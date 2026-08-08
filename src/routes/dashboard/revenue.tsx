import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { DollarSign, CreditCard, TrendingUp, BarChart3, MessageSquare } from "lucide-react";
import { DASHBOARD_DATA, fmtCurrency, fmtNum, fmtPct, PAYMENT_COLORS, STATUS_COLORS, titleCase } from "@/lib/dashboard-data";
import { KPICard } from "@/components/dashboard/KPICard";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/revenue")({ component: RevenuePage });

const TOOLTIP_STYLE = {
  contentStyle: { background: "#151C26", border: "1px solid #252E3B", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#E7EAEE" },
};

function RevenuePage() {
  const p = DASHBOARD_DATA.payment;

  return (
    <div className="p-6 space-y-6 pb-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Total Revenue"   value={`R$${(p.summary.total/1e6).toFixed(2)}M`} sub="All payment types"  icon={DollarSign}  color="#3ECF8E" delay={0} />
        <KPICard label="Avg. Payment"    value={`R$ ${p.summary.avg.toFixed(2)}`}          sub="Per transaction"   icon={TrendingUp}  color="#F2B84B" delay={0.05} />
        <KPICard label="Max Single Order" value={fmtCurrency(p.summary.max)}               sub="Highest single order" icon={BarChart3} color="#B08BF0" delay={0.10} />
        <KPICard label="Median Payment"  value={fmtCurrency(p.summary.median)}             sub="50th percentile"   icon={CreditCard}  color="#5B8DEF" delay={0.15} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Payment Type Donut */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold">Payment Type Distribution</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={p.typeDist.filter(t=>t.type !== 'not_defined')} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" paddingAngle={3}>
                  {p.typeDist.filter(t=>t.type !== 'not_defined').map((t, i) => <Cell key={t.type} fill={PAYMENT_COLORS[i]} />)}
                </Pie>
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number, _name: string, props: { payload?: { type?: string } }) => [fmtNum(v), props.payload?.type ?? ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {p.typeDist.filter(t=>t.type !== 'not_defined').map((t, i) => (
                <div key={t.type}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full" style={{ background: PAYMENT_COLORS[i] }} />
                      <span className="text-muted-foreground capitalize">{t.type.replace(/_/g,' ')}</span>
                    </span>
                    <span className="font-mono font-semibold">{fmtPct(t.pct)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: PAYMENT_COLORS[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Revenue by Payment Type Bar */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold">Total Revenue by Payment Type</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={p.byType.filter(t=>t.type !== 'not_defined')}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252E3B" />
              <XAxis dataKey="type" tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={s => s.replace(/_/g,' ').replace('credit','CC').replace('boleto','Boleto').replace('voucher','Voucher').replace('debit card','Debit')} />
              <YAxis tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `R$${(v/1e6).toFixed(1)}M`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [fmtCurrency(v), "Revenue"]} />
              <Bar dataKey="total" radius={[4,4,0,0]}>
                {p.byType.filter(t=>t.type !== 'not_defined').map((_t, i) => <Cell key={i} fill={PAYMENT_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Payment type stats table */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="mb-4 text-sm font-semibold">Payment Method Breakdown</h2>
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {["Method","Transactions","Total Revenue","Avg. Value","Max Value","% of Total"].map(h => (
                  <th key={h} className="pb-2 px-3 first:pl-0 text-left text-[10px] uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {p.byType.filter(t=>t.type !== 'not_defined').map((t, i) => (
                <tr key={t.type} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                  <td className="py-3 flex items-center gap-2">
                    <span className="size-2 rounded-full shrink-0" style={{ background: PAYMENT_COLORS[i] }} />
                    <span className="capitalize font-medium">{t.type.replace(/_/g,' ')}</span>
                  </td>
                  <td className="py-3 px-3 font-mono">{fmtNum(t.count)}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-amber-400">{fmtCurrency(t.total)}</td>
                  <td className="py-3 px-3 font-mono">{fmtCurrency(t.avg)}</td>
                  <td className="py-3 px-3 font-mono">{fmtCurrency(t.max)}</td>
                  <td className="py-3 px-3 font-mono">{fmtPct(t.count / DASHBOARD_DATA.kpis.totalOrders * 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Revenue by order status */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="mb-4 text-sm font-semibold">Revenue by Order Status</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={p.byStatus}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252E3B" />
            <XAxis dataKey="status" tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={titleCase} />
            <YAxis tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `R$${(v/1e6).toFixed(1)}M`} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [fmtCurrency(v), "Revenue"]} />
            <Bar dataKey="total" radius={[4,4,0,0]}>
              {p.byStatus.map(s => <Cell key={s.status} fill={STATUS_COLORS[s.status] ?? "#8B94A3"} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <MessageSquare className="size-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Ask the AI Analyst</p>
          <p className="text-[11px] text-muted-foreground">"Show total payment value by payment type" or "Show average payment by method"</p>
        </div>
        <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
          Ask AI →
        </Link>
      </div>
    </div>
  );
}
