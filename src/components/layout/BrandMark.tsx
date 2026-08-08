import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo.jpg"
      alt="DataMind AI Logo"
      className={cn(
        "aspect-square rounded-xl object-cover border border-emerald-500/25 shadow-md shadow-emerald-950/50",
        className
      )}
    />
  );
}
