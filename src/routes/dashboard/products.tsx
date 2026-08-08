import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { Package, TrendingUp, TrendingDown, Star, MessageSquare } from "lucide-react";
import { DASHBOARD_DATA, fmtCurrency, fmtNum, CATEGORY_COLORS } from "@/lib/dashboard-data";
import { KPICard } from "@/components/dashboard/KPICard";
import { motion } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/products")({ component: ProductsPage });

const TOOLTIP_STYLE = {
  contentStyle: { background: "#151C26", border: "1px solid #252E3B", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "#E7EAEE" },
};

function ProductsPage() {
  const pd = DASHBOARD_DATA.products;
  const [catTab, setCatTab] = useState<"revenue" | "count">("revenue");
  const top15cats = pd.topCategoriesByRevenue.slice(0, 15);

  return (
    <div className="p-6 space-y-6 pb-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Total Products" value={fmtNum(DASHBOARD_DATA.kpis.totalProducts)} sub="Unique SKUs in catalog" icon={Package}     color="#F2B84B" delay={0} />
        <KPICard label="Avg. Price"     value={`R$ ${pd.avgPrice.toFixed(2)}`}             sub="Mean unit price"      icon={TrendingUp}  color="#3ECF8E" delay={0.05} />
        <KPICard label="Top Category"   value="Health & Beauty"                            sub="R$ 1.26M revenue"     icon={Star}        color="#B08BF0" delay={0.10} />
        <KPICard label="Categories"     value="74"                                          sub="Unique product types" icon={TrendingDown} color="#5B8DEF" delay={0.15} />
      </div>

      {/* Category Revenue Bar */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold">Top 15 Categories by Revenue</h2>
          <div className="flex gap-1">
            {(["revenue", "count"] as const).map(tab => (
              <button key={tab} onClick={() => setCatTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-[11px] font-medium capitalize transition-all ${
                  catTab === tab ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-accent"
                }`}>{tab === "revenue" ? "By Revenue" : "By Orders"}</button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={top15cats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#252E3B" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false}
              tickFormatter={v => catTab === "revenue" ? `R$${(v/1000).toFixed(0)}k` : fmtNum(v)} />
            <YAxis type="category" dataKey="category" tick={{ fill: "#8B94A3", fontSize: 10 }} tickLine={false} axisLine={false} width={130}
              tickFormatter={c => c.replace(/_/g,' ').slice(0,18)} />
            <Tooltip {...TOOLTIP_STYLE}
              formatter={(v: number) => [catTab === "revenue" ? fmtCurrency(v) : fmtNum(v), catTab === "revenue" ? "Revenue" : "Orders"]} />
            <Bar dataKey={catTab === "revenue" ? "revenue" : "count"} radius={[0,4,4,0]}>
              {top15cats.map((_c, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top 10 by Revenue */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-400" /> Top 10 by Revenue
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">#</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Product ID</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="pb-2 text-right text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {pd.top10ByRevenue.map((p, i) => (
                <tr key={p.productId} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 font-mono text-primary font-bold">{i+1}</td>
                  <td className="py-2.5 font-mono text-muted-foreground">{p.productId.slice(0,8)}…</td>
                  <td className="py-2.5">
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400 font-medium">
                      {p.category.replace(/_/g,' ')}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold text-emerald-400">{fmtCurrency(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Top 10 by Order Count */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
          className="rounded-2xl border border-border bg-card/60 p-5">
          <h2 className="mb-4 text-sm font-semibold flex items-center gap-2">
            <Package className="size-4 text-blue-400" /> Top 10 by Order Count
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">#</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Product ID</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="pb-2 text-right text-[10px] uppercase tracking-wider text-muted-foreground">Orders</th>
              </tr>
            </thead>
            <tbody>
              {pd.top10ByOrderCount.map((p, i) => (
                <tr key={p.productId} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 font-mono text-primary font-bold">{i+1}</td>
                  <td className="py-2.5 font-mono text-muted-foreground">{p.productId.slice(0,8)}…</td>
                  <td className="py-2.5">
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400 font-medium">
                      {p.category.replace(/_/g,' ')}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-mono font-semibold text-blue-400">{fmtNum(p.orders)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Bottom 10 */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="mb-4 text-sm font-semibold flex items-center gap-2">
          <TrendingDown className="size-4 text-red-400" /> Bottom 10 by Revenue (Lowest Sellers)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">#</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Product ID</th>
                <th className="pb-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="pb-2 text-right text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {pd.bottom10ByRevenue.map((p, i) => (
                <tr key={p.productId} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                  <td className="py-2.5 font-mono text-red-400">{i+1}</td>
                  <td className="py-2.5 font-mono text-muted-foreground">{p.productId.slice(0,8)}…</td>
                  <td className="py-2.5 text-muted-foreground capitalize">{p.category.replace(/_/g,' ')}</td>
                  <td className="py-2.5 text-right font-mono text-red-400">{fmtCurrency(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <MessageSquare className="size-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Ask the AI Analyst</p>
          <p className="text-[11px] text-muted-foreground">"Show top 10 products by revenue" or "Show revenue by category"</p>
        </div>
        <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
          Ask AI →
        </Link>
      </div>
    </div>
  );
}
