import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  DollarSign,
  GitCompare,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { QUICK_ACTIONS, POPULAR_QUESTIONS } from "@/lib/mock-data";

const ICONS = {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Database: BarChart3,
  BarChart3,
  Boxes: BarChart3,
  Package: ShoppingCart,
  GitCompare,
} as const;

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  BarChart3,
  GitCompare,
};

export function PromptSuggestions({ onPick }: { onPick: (prompt: string) => void }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

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
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">
          Ask anything about your e-commerce database — I'll write the SQL, run it, and give you charts and insights.
        </p>
      </motion.div>

      {/* Quick action tiles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {QUICK_ACTIONS.map((action, i) => {
          const Icon = ICONS[action.icon as keyof typeof ICONS] ?? BarChart3;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.25 }}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPick(action.prompt)}
              className="group flex flex-col items-start gap-2.5 rounded-2xl border border-border bg-card/60 p-4 text-left transition-all hover:border-primary/50 hover:bg-card hover:shadow-md"
            >
              <span className="grid size-8 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="size-4" />
              </span>
              <p className="text-[13px] font-medium leading-tight text-foreground/90 group-hover:text-foreground">
                {action.label}
              </p>
            </motion.button>
          );
        })}
      </motion.div>

    </div>
  );
}
