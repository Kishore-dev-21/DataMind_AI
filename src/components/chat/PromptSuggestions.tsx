import { motion } from "framer-motion";
import { BrandMark } from "@/components/layout/BrandMark";
import { Database, TrendingUp, ShoppingBag, DollarSign, Users } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: DollarSign,
    title: "Total Revenue & Orders",
    prompt: "What is the total revenue and total number of orders in the database?",
  },
  {
    icon: TrendingUp,
    title: "Top Product Categories",
    prompt: "Show me the top 5 product categories by revenue with a chart.",
  },
  {
    icon: ShoppingBag,
    title: "Monthly Revenue Growth",
    prompt: "What is the monthly revenue trend over time?",
  },
  {
    icon: Users,
    title: "Customer Distribution",
    prompt: "Which top 5 states have the highest number of customers?",
  },
];

export function PromptSuggestions({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-col items-center text-center"
      >
        <BrandMark className="mb-4 size-16 shadow-2xl shadow-emerald-950/80 ring-2 ring-emerald-500/30" />
        <h1 className="text-3xl font-semibold tracking-tight">
          How can I help you today?
        </h1>
        <p className="mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          Turn questions into data-driven decisions with AI-powered SQL, interactive visualizations, and actionable business insights across the Olist Brazilian E-Commerce dataset.
        </p>

        {/* Highly Visible Database Connection Notice for Judges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 flex w-full max-w-2xl items-start gap-3.5 rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-emerald-500/5 p-4 text-left shadow-xl shadow-amber-950/20 backdrop-blur-md ring-1 ring-amber-500/25"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/25 text-amber-300 ring-1 ring-amber-500/40 mt-0.5">
            <Database className="size-5 animate-pulse text-amber-300" />
          </div>
          <div className="space-y-1">
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
      </motion.div>

      {/* Suggestion Cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {SUGGESTIONS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => onPick(item.prompt)}
              className="flex items-start gap-3 rounded-2xl border border-border/80 bg-card/60 p-3.5 text-left transition-all hover:border-emerald-500/40 hover:bg-card hover:shadow-lg hover:shadow-emerald-950/20 group"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">
                  {item.prompt}
                </p>
              </div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

