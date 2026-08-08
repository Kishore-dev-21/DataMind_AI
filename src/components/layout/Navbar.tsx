import { Link } from "@tanstack/react-router";
import { Database, Menu, Settings } from "lucide-react";
import { useActiveDatabase, useChatStore } from "@/stores/chat-store";
import { StatusDot } from "./Sidebar";
import { BrandMark } from "./BrandMark";

export function Navbar({
  onOpenSidebar,
}: {
  onOpenSidebar: () => void;
}) {
  const database = useActiveDatabase();
  const { provider } = useChatStore();

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

      <div className="ml-auto flex items-center gap-1">
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
