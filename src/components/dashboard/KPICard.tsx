import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  color?: string;
  delay?: number;
}

export function KPICard({ label, value, sub, icon: Icon, color = "#F2B84B", delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-2xl border border-border bg-card/60 p-5 hover:border-primary/40 hover:bg-card transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
        <span
          className="grid size-8 place-items-center rounded-xl"
          style={{ background: color + "20" }}
        >
          <Icon className="size-4" style={{ color }} />
        </span>
      </div>
      <p className="font-mono text-2xl font-bold tracking-tight" style={{ color }}>
        {value}
      </p>
      {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
    </motion.div>
  );
}
