import { motion } from "framer-motion";
import { BrandMark } from "@/components/layout/BrandMark";

export function PromptSuggestions({ onPick: _onPick }: { onPick: (prompt: string) => void }) {
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
      </motion.div>

    </div>
  );
}
