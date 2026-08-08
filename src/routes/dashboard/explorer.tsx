import { createFileRoute } from "@tanstack/react-router";
import { Search, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { DASHBOARD_DATA, fmtCurrency, fmtNum, titleCase } from "@/lib/dashboard-data";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/dashboard/explorer")({ component: ExplorerPage });

// Generate sample rows from the pre-aggregated data
const SAMPLE_ROWS = [
  ...DASHBOARD_DATA.payment.byStatus.map((s, i) => ({
    id: `order-${i}`,
    date: "2018-08",
    status: s.status,
    state: ["SP","RJ","MG","RS","PR","SC","BA","DF","ES","GO"][i % 10],
    category: DASHBOARD_DATA.products.topCategoriesByRevenue[i % 15].category,
    items: Math.ceil(s.count / 1000),
    payment: Math.round(s.avg * 100) / 100,
    review: [3.5,4.0,4.5,5.0,3.0,2.5,4.2,3.8][i % 8],
  })),
  ...DASHBOARD_DATA.customers.stateDist.slice(0, 20).map((s, i) => ({
    id: `cust-order-${i}`,
    date: `2018-0${(i%8)+1}`,
    status: ["delivered","shipped","canceled","delivered","delivered"][i % 5],
    state: s.state,
    category: DASHBOARD_DATA.products.topCategoriesByRevenue[i % 15].category,
    items: (i % 4) + 1,
    payment: Math.round((s.revenue / s.orders) * 100) / 100,
    review: [4.0,4.5,5.0,3.5,4.2][i % 5],
  })),
  ...DASHBOARD_DATA.products.topCategoriesByRevenue.map((c, i) => ({
    id: `prod-order-${i}`,
    date: `2017-1${i % 2 === 0 ? 1 : 2}`,
    status: "delivered",
    state: ["SP","RJ","MG","RS","PR"][i % 5],
    category: c.category,
    items: (i % 3) + 1,
    payment: Math.round(c.avgPrice * 100) / 100,
    review: [3.8,4.1,4.9,4.3,4.7][i % 5],
  })),
];

const ALL_STATUSES = ["all", ...new Set(SAMPLE_ROWS.map(r => r.status))];
const ALL_STATES = ["all", ...new Set(SAMPLE_ROWS.map(r => r.state)).values()].sort();
const ROWS_PER_PAGE = 10;

const STATUS_COLORS: Record<string, string> = {
  delivered: "bg-emerald-500/15 text-emerald-400",
  shipped: "bg-blue-500/15 text-blue-400",
  canceled: "bg-red-500/15 text-red-400",
  unavailable: "bg-muted/30 text-muted-foreground",
  invoiced: "bg-amber-500/15 text-amber-400",
  processing: "bg-violet-500/15 text-violet-400",
};

function ExplorerPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"payment" | "review" | "items" | "date">("payment");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = [...SAMPLE_ROWS];
    if (search) rows = rows.filter(r => r.id.includes(search) || r.state.toLowerCase().includes(search.toLowerCase()) || r.category.includes(search.toLowerCase()));
    if (statusFilter !== "all") rows = rows.filter(r => r.status === statusFilter);
    if (stateFilter !== "all") rows = rows.filter(r => r.state === stateFilter);
    rows.sort((a, b) => {
      const av = a[sortKey] as number, bv = b[sortKey] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return rows;
  }, [search, statusFilter, stateFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const pageRows = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  };

  const exportCSV = () => {
    const header = ["id","date","status","state","category","items","payment_brl","review"];
    const lines = [header.join(","), ...filtered.map(r =>
      [r.id,r.date,r.status,r.state,r.category,r.items,r.payment,r.review].join(",")
    )];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `olist_explorer_${Date.now()}.csv` });
    a.click();
  };

  return (
    <div className="p-6 space-y-5 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-semibold">Data Explorer</h1>
          <p className="text-[11px] text-muted-foreground">{fmtNum(filtered.length)} rows · Sample view from pre-aggregated dataset</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card/80 px-3.5 py-2 text-xs font-medium hover:bg-accent transition-all">
          <Download className="size-3.5" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
        className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3">
        <Filter className="size-3.5 text-muted-foreground shrink-0" />
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search…" className="rounded-lg border border-border bg-background/60 py-1.5 pl-7 pr-3 text-xs outline-none focus:border-primary/50 w-44" />
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] uppercase text-muted-foreground">Status</label>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-background/60 px-2 py-1.5 text-xs outline-none focus:border-primary/50">
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s === "all" ? "All" : titleCase(s)}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <label className="text-[10px] uppercase text-muted-foreground">State</label>
          <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-background/60 px-2 py-1.5 text-xs outline-none focus:border-primary/50">
            {ALL_STATES.map(s => <option key={s} value={s}>{s === "all" ? "All" : s}</option>)}
          </select>
        </div>
        <button onClick={() => { setSearch(""); setStatusFilter("all"); setStateFilter("all"); setPage(1); }}
          className="ml-auto text-[11px] text-primary hover:underline">Clear</button>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.15 }}
        className="rounded-2xl border border-border overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card border-b border-border">
            <tr>
              {["Order ID","Date","Status","State","Category","Items"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-[10px] uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}
              {(["payment","review"] as const).map(k => (
                <th key={k} onClick={() => handleSort(k)}
                  className="px-3 py-3 text-right text-[10px] uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground">
                  {k === "payment" ? "Payment (R$)" : "Review"}
                  {sortKey === k ? (sortDir === "desc" ? " ↓" : " ↑") : " ↕"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr key={r.id} className={`border-b border-border/40 hover:bg-accent/30 transition-colors ${i % 2 === 0 ? "" : "bg-card/30"}`}>
                <td className="px-3 py-2.5 font-mono text-muted-foreground">{r.id}</td>
                <td className="px-3 py-2.5 font-mono">{r.date}</td>
                <td className="px-3 py-2.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[r.status] ?? ""}`}>{r.status}</span>
                </td>
                <td className="px-3 py-2.5 font-semibold">{r.state}</td>
                <td className="px-3 py-2.5 max-w-[120px] truncate text-muted-foreground">{r.category.replace(/_/g,' ')}</td>
                <td className="px-3 py-2.5 text-center font-mono">{r.items}</td>
                <td className="px-3 py-2.5 text-right font-mono font-semibold text-amber-400">{fmtCurrency(r.payment)}</td>
                <td className="px-3 py-2.5 text-right">
                  <span className={`font-mono font-semibold ${r.review >= 4 ? "text-emerald-400" : r.review >= 3 ? "text-amber-400" : "text-red-400"}`}>
                    {r.review.toFixed(1)} ★
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Page {page} of {totalPages} · {fmtNum(filtered.length)} total rows</span>
        <div className="flex gap-1.5">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronLeft className="size-3" /> Prev
          </button>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            Next <ChevronRight className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
