import { motion } from "framer-motion";
import { BrandMark } from "@/components/layout/BrandMark";
import { Info } from "lucide-react";

export function PromptSuggestions({ onPick: _onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center text-center"
      >
        <BrandMark className="mb-4 size-16 shadow-2xl shadow-emerald-950/80 ring-2 ring-emerald-500/30" />
        <h1 className="text-3xl font-semibold tracking-tight">
          How can I help you today?
        </h1>
        <p className="mt-3 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
          Turn questions into data-driven decisions with AI-powered SQL, interactive visualizations, and actionable business insights across the Olist Brazilian E-Commerce dataset.
        </p>

        {/* Decent, Elegant Notice for Judges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6 flex w-full max-w-xl items-start gap-3.5 rounded-2xl border border-emerald-500/25 bg-card/70 p-4 text-left shadow-lg backdrop-blur-md"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 mt-0.5">
            <Info className="size-4 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wide text-foreground">
                Database Connection Notice
              </span>
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                Notice for Judges
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Your first question may take a little longer while we connect to the database. Once connected, you can continue exploring your data with faster responses.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

