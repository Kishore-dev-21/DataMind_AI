import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Users, DollarSign, MapPin, TrendingUp, MessageSquare } from "lucide-react";
import { DASHBOARD_DATA, fmtCurrency, fmtNum, CATEGORY_COLORS } from "@/lib/dashboard-data";
import { KPICard } from "@/components/dashboard/KPICard";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/customers")({ component: CustomersPage });

const TOOLTIP_STYLE = {
  contentStyle: { background: "#151C26", border: "1px solid #252E3B", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#E7EAEE" },
};

function CustomersPage() {
  const c = DASHBOARD_DATA.customers;
  const topStates = c.stateDist.slice(0, 15);
  const [stateTab, setStateTab] = useState<"orders" | "revenue">("orders");

  return (
    <div className="p-6 space-y-6 pb-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Total Customers"      value={fmtNum(DASHBOARD_DATA.kpis.totalCustomers)}    sub="Unique buyer accounts"    icon={Users}      color="#5B8DEF" delay={0} />
        <KPICard label="Avg. Spend / Customer" value={`R$ ${c.avgSpendPerCustomer.toFixed(2)}`}      sub="Per customer lifetime"    icon={DollarSign} color="#3ECF8E" delay={0.05} />
        <KPICard label="Top State"             value="São Paulo (SP)"                                 sub="41,746 orders — 42%"      icon={MapPin}     color="#F2B84B" delay={0.10} />
        <KPICard label="Top Customer (Spend)"  value="R$ 13,664"                                      sub="Single-order buyer, RJ"   icon={TrendingUp} color="#B08BF0" delay={0.15} />
      </div>

      {/* State distribution bar */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold">Orders & Revenue by State (Top 15)</h2>
          <div className="flex gap-1">
            {(["orders", "revenue"] as const).map(tab => (
              <button key={tab} onClick={() => setStateTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-medium capitalize transition-all ${
                  stateTab === tab ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-accent"
                }`}>{tab === "orders" ? "By Orders" : "By Revenue"}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topStates}>
            <CartesianGrid strokeDasharray="3 3" stroke="#252E3B" />
            <XAxis dataKey="state" tick={{ fill: "#8B94A3", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => stateTab === "orders" ? `${(v/1000).toFixed(0)}k` : `R$${(v/1e6).toFixed(1)}M`} />
            <Tooltip {...TOOLTIP_STYLE}
              formatter={(v: number) => [stateTab === "orders" ? fmtNum(v) : fmtCurrency(v), stateTab === "orders" ? "Orders" : "Revenue"]} />
            <Bar dataKey={stateTab} radius={[4,4,0,0]}>
              {topStates.map((_s, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top 10 by Spend */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold flex items-center gap-2">
            <DollarSign className="size-4 text-emerald-400" /> Top 10 by Total Spend
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">#</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Customer ID</th>
                <th className="pb-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground">Orders</th>
                <th className="pb-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground">State</th>
                <th className="pb-2 text-right text-[10px] uppercase tracking-wider text-muted-foreground">Spent</th>
              </tr>
            </thead>
            <tbody>
              {c.top10BySpend.map((cust, i) => (
                <tr key={cust.customerId} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 font-mono font-bold text-primary">{i+1}</td>
                  <td className="py-2.5 font-mono text-muted-foreground">{cust.customerId.slice(0,8)}…</td>
                  <td className="py-2.5 text-center font-mono">{cust.orders}</td>
                  <td className="py-2.5 text-center">
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400 font-medium">{cust.state}</span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold text-amber-400">{fmtCurrency(cust.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Top 10 by Orders */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold flex items-center gap-2">
            <Users className="size-4 text-blue-400" /> Top 10 by Order Count
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">#</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Customer ID</th>
                <th className="pb-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground">Orders</th>
                <th className="pb-2 text-center text-[10px] uppercase tracking-wider text-muted-foreground">State</th>
                <th className="pb-2 text-right text-[10px] uppercase tracking-wider text-muted-foreground">Spent</th>
              </tr>
            </thead>
            <tbody>
              {c.top10ByOrders.map((cust, i) => (
                <tr key={cust.customerId} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 font-mono font-bold text-primary">{i+1}</td>
                  <td className="py-2.5 font-mono text-muted-foreground">{cust.customerId.slice(0,8)}…</td>
                  <td className="py-2.5 text-center font-mono font-semibold text-emerald-400">{cust.orders}</td>
                  <td className="py-2.5 text-center">
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400 font-medium">{cust.state}</span>
                  </td>
                  <td className="py-2.5 text-right font-mono">{fmtCurrency(cust.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <MessageSquare className="size-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Ask the AI Analyst</p>
          <p className="text-[11px] text-muted-foreground">"Show top 10 customers by total payment value" or "Show orders by state"</p>
        </div>
        <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
          Ask AI →
        </Link>
      </div>
    </div>
  );
}
