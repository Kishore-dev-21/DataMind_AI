import { Link } from "@tanstack/react-router";
import { Database, Menu, Settings, Wifi, WifiOff } from "lucide-react";
import { useActiveDatabase, useChatStore } from "@/stores/chat-store";
import { StatusDot } from "./Sidebar";
import { BrandMark } from "./BrandMark";
import { useEffect, useState } from "react";
import { checkHealth } from "@/services/api";

export function Navbar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const database = useActiveDatabase();
  const { provider } = useChatStore();
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth().then(setBackendOnline);
  }, []);

  return (
    <header className="flex h-13 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-xl">
      <button
        onClick={onOpenSidebar}
        aria-label="Open sidebar"
        className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <BrandMark className="size-7" />
        <span className="text-xs font-semibold">DataMind AI</span>
      </div>

      {/* DB Status Pill */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-xs">
        <Database className="size-3.5 shrink-0 text-primary" />
        <span className="font-medium text-foreground">{database.name}</span>
        <span className="text-muted-foreground">{database.engine}</span>
        <StatusDot status={database.status} />
      </div>

      {/* Provider badge */}
      <span className="hidden items-center gap-1.5 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-[11px] text-muted-foreground md:flex">
        ⚡ {provider}
      </span>

      <div className="ml-auto flex items-center gap-2">
        {/* Backend health indicator */}
        {backendOnline !== null && (
          <span
            title={backendOnline ? "Backend is connected" : "Backend is offline"}
            className={`hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium md:flex ${
              backendOnline
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {backendOnline ? (
              <><Wifi className="size-3" /> Connected</>
            ) : (
              <><WifiOff className="size-3" /> Offline</>
            )}
          </span>
        )}

        <Link
          to="/settings"
          aria-label="Settings"
          className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Settings className="size-4" />
        </Link>
      </div>
    </header>
  );
}
