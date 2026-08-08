import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, AlertCircle, CheckCircle, MessageSquare } from "lucide-react";
import { DASHBOARD_DATA, fmtNum } from "@/lib/dashboard-data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard/quality")({ component: QualityPage });

function QualityPage() {
  const dq = DASHBOARD_DATA.dataQuality;
  const score = dq.qualityScore;
  const scoreColor = score >= 90 ? "#3ECF8E" : score >= 75 ? "#F2B84B" : "#E5646A";

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Header with quality score */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
        className="flex items-start gap-6 rounded-2xl border border-border bg-card/60 p-6">
        {/* Ring SVG */}
        <div className="shrink-0 relative size-28">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1B2330" strokeWidth="10" />
            <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="10"
              strokeDasharray={`${score * 2.51} 251`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-bold" style={{ color: scoreColor }}>{score}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Quality</span>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold mb-1">Data Quality Report</h1>
          <p className="text-[12px] text-muted-foreground mb-3">Overall quality score: <strong style={{ color: scoreColor }}>{score}/100</strong> — Excellent</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Tables",     val: dq.tables.length,                               color: "#F2B84B" },
              { label: "Total Rows", val: fmtNum(dq.tables.reduce((a,t)=>a+t.rows,0)),   color: "#5B8DEF" },
              { label: "Clean Tables",val: dq.tables.filter(t=>t.missingPct===0).length, color: "#3ECF8E" },
              { label: "Duplicates", val: "0",                                             color: "#3ECF8E" },
            ].map(item => (
              <div key={item.label} className="rounded-xl bg-background/60 p-3 text-center">
                <p className="font-mono text-xl font-bold" style={{ color: item.color }}>{item.val}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Per-table quality */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="mb-4 text-sm font-semibold">Table-Level Quality Report</h2>
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {["Table","Rows","Columns","Missing Cells","Missing %","Duplicates","Status"].map(h => (
                  <th key={h} className="pb-2 px-3 first:pl-0 text-left text-[10px] uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dq.tables.map(t => (
                <tr key={t.name} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                  <td className="py-3 font-semibold">{t.name}</td>
                  <td className="py-3 px-3 font-mono">{fmtNum(t.rows)}</td>
                  <td className="py-3 px-3 font-mono">{t.cols}</td>
                  <td className="py-3 px-3 font-mono">{fmtNum(t.missing)}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted/30 overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${Math.min(t.missingPct * 5, 100)}%`,
                          background: t.missingPct === 0 ? "#3ECF8E" : t.missingPct < 5 ? "#F2B84B" : "#E5646A",
                        }} />
                      </div>
                      <span className="font-mono">{t.missingPct.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">{t.duplicates}</td>
                  <td className="py-3 px-3">
                    {t.missingPct === 0 ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle className="size-3" /> Clean
                      </span>
                    ) : t.missingPct < 5 ? (
                      <span className="flex items-center gap-1 text-amber-400">
                        <AlertCircle className="size-3" /> Partial
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400">
                        <AlertCircle className="size-3" /> Issues
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Issues summary */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="mb-4 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="size-4 text-amber-400" /> Known Data Issues
        </h2>
        <div className="space-y-3">
          {[
            { issue: "Reviews table: 145,903 missing cells (21.01%)", severity: "high",   detail: "Many reviews have no comment text — review_comment_title and review_comment_message are frequently empty." },
            { issue: "Orders table: 4,908 missing values (0.62%)",    severity: "medium", detail: "Mainly missing order_approved_at and order_delivered_customer_date for non-delivered or older orders." },
            { issue: "Products table: 3,058 missing values (0.93%)",  severity: "medium", detail: "product_category_name and product dimensions are missing for some items." },
          ].map(item => (
            <div key={item.issue} className={`rounded-xl p-4 border ${
              item.severity === "high" ? "border-red-500/30 bg-red-500/5" : "border-amber-500/30 bg-amber-500/5"
            }`}>
              <div className={`flex items-center gap-2 text-xs font-semibold mb-1.5 ${
                item.severity === "high" ? "text-red-400" : "text-amber-400"
              }`}>
                <AlertCircle className="size-3.5" />
                {item.issue}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Data lineage */}
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
        className="rounded-2xl border border-border bg-card/60 p-5">
        <h2 className="mb-4 text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" /> Data Lineage & Sources
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { src: "olist_customers_dataset.csv",         desc: "Customer profiles with zip code and state" },
            { src: "olist_orders_dataset.csv",             desc: "Order headers with status and timestamps" },
            { src: "olist_order_items_dataset.csv",        desc: "Line items linking orders to products" },
            { src: "olist_order_payments_dataset.csv",     desc: "Payment records by type and value" },
            { src: "olist_order_reviews_dataset.csv",      desc: "Customer review scores and comments" },
            { src: "olist_products_dataset.csv",           desc: "Product catalog with category and dimensions" },
            { src: "olist_sellers_dataset.csv",            desc: "Seller profiles with location" },
            { src: "product_category_name_translation.csv", desc: "Portuguese → English category translation" },
            { src: "olist_geolocation_dataset.csv",        desc: "Zip code geo-coordinates (not joined)" },
          ].map(row => (
            <div key={row.src} className="flex items-start gap-2 rounded-lg bg-background/50 px-3 py-2.5">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
              <div>
                <p className="font-mono text-[11px] text-foreground/80">{row.src}</p>
                <p className="text-[10px] text-muted-foreground">{row.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <MessageSquare className="size-5 text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Ask the AI Analyst</p>
          <p className="text-[11px] text-muted-foreground">"Explain database schema" or "Draw ER diagram"</p>
        </div>
        <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90">
          Ask AI →
        </Link>
      </div>
    </div>
  );
}
