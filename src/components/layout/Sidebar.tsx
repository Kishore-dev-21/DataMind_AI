import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Database,
  DollarSign,
  GitCompare,
  LayoutDashboard,
  MessageSquare,
  Pin,
  PinOff,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useChatStore } from "@/stores/chat-store";
import { POPULAR_QUESTIONS } from "@/lib/mock-data";
import { BrandMark } from "./BrandMark";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  BarChart3,
  GitCompare,
};

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { conversations, activeId, newConversation, selectConversation, deleteConversation, togglePin, send } =
    useChatStore();
  const [query, setQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Revenue & Payments");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  const handleNewChat = () => {
    newConversation();
    if (pathname !== "/") {
      navigate({ to: "/" });
    }
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    if (pathname !== "/") {
      navigate({ to: "/" });
    }
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  );
  const pinned = filtered.filter((c) => c.pinned);
  const recent = filtered.filter((c) => !c.pinned);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <BrandMark className="size-8" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight">DataMind AI</p>
          <p className="truncate text-[11px] text-muted-foreground">E-commerce Analytics</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent lg:hidden"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 space-y-1.5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[var(--color-violet)] px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-opacity hover:opacity-90 cursor-pointer"
        >
          <Plus className="size-4" /> New chat
        </motion.button>

        <Link
          to="/dashboard"
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl border border-sidebar-border px-3 py-2 text-xs font-medium transition-all hover:border-primary/50 hover:bg-sidebar-accent",
            pathname.startsWith("/dashboard")
              ? "border-primary/60 bg-sidebar-accent text-primary font-semibold shadow-sm"
              : "bg-background/40 text-muted-foreground"
          )}
        >
          <LayoutDashboard className="size-3.5 text-primary shrink-0" />
          <span>Analytics Dashboards</span>
        </Link>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            aria-label="Search conversations"
            className="w-full rounded-xl border border-sidebar-border bg-background/40 py-2 pl-9 pr-3 text-xs outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {pinned.length > 0 && (
          <Section label="Pinned">
            {pinned.map((c) => (
              <ConversationRow
                key={c.id}
                title={c.title}
                active={c.id === activeId && pathname === "/"}
                pinned
                onSelect={() => handleSelectConversation(c.id)}
                onPin={() => togglePin(c.id)}
                onDelete={() => deleteConversation(c.id)}
              />
            ))}
          </Section>
        )}

        <Section label="Recent">
          {recent.map((c) => (
            <ConversationRow
              key={c.id}
              title={c.title}
              active={c.id === activeId && pathname === "/"}
              onSelect={() => handleSelectConversation(c.id)}
              onPin={() => togglePin(c.id)}
              onDelete={() => deleteConversation(c.id)}
            />
          ))}
          {recent.length === 0 && (
            <p className="px-2 py-1 text-xs text-muted-foreground">No conversations yet.</p>
          )}
        </Section>

        {/* Popular Questions — categorized & collapsible */}
        <div>
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary" />
            Popular Questions
          </p>
          <div className="space-y-1">
            {POPULAR_QUESTIONS.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.icon] ?? DollarSign;
              const isOpen = expandedCategory === cat.label;
              return (
                <div key={cat.label} className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(isOpen ? null : cat.label)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                  >
                    <Icon className="size-3.5 shrink-0 text-primary/70" />
                    <span className="flex-1 truncate">{cat.label}</span>
                    {isOpen
                      ? <ChevronDown className="size-3 shrink-0 opacity-60" />
                      : <ChevronRight className="size-3 shrink-0 opacity-40" />
                    }
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/40 pl-3 pb-1">
                          {cat.questions.map((q) => (
                            <button
                              key={q}
                              onClick={() => {
                                send(q);
                                if (pathname !== "/") navigate({ to: "/" });
                              }}
                              className="flex w-full items-start gap-1.5 rounded-md px-1.5 py-1 text-left text-[11px] leading-tight text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                            >
                              <span className="mt-0.5 size-1 shrink-0 rounded-full bg-primary/50 mt-1.5" />
                              <span>{q}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        <Section label="Workspace">
          <SideLink to="/database" active={pathname === "/database"} icon={Database} label="Database Explorer" />
          <SideLink to="/settings" active={pathname === "/settings"} icon={Settings} label="Settings" />
        </Section>
      </nav>

    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SideLink({
  to,
  active,
  icon: Icon,
  label,
}: {
  to: string;
  active: boolean;
  icon: typeof Database;
  label: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors",
        active
          ? "bg-sidebar-accent text-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function ConversationRow({
  title,
  active,
  pinned,
  onSelect,
  onPin,
  onDelete,
}: {
  title: string;
  active: boolean;
  pinned?: boolean;
  onSelect: () => void;
  onPin: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-lg pr-1 transition-colors",
        active ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60",
      )}
    >
      <Link
        to="/"
        onClick={onSelect}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left text-xs",
          active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
        )}
      >
        <MessageSquare className="size-3.5 shrink-0" />
        <span className="truncate">{title}</span>
      </Link>
      <button
        onClick={onPin}
        aria-label={pinned ? "Unpin conversation" : "Pin conversation"}
        className="hidden size-6 place-items-center rounded text-muted-foreground hover:text-foreground group-hover:grid"
      >
        {pinned ? <PinOff className="size-3" /> : <Pin className="size-3" />}
      </button>
      <button
        onClick={onDelete}
        aria-label="Delete conversation"
        className="hidden size-6 place-items-center rounded text-muted-foreground hover:text-destructive group-hover:grid"
      >
        <Trash2 className="size-3" />
      </button>
    </div>
  );
}

export function StatusDot({ status }: { status: "connected" | "idle" | "error" }) {
  const map = {
    connected: { color: "bg-[var(--color-success)]", label: "Connected" },
    idle: { color: "bg-[var(--color-warning)]", label: "Idle" },
    error: { color: "bg-destructive", label: "Error" },
  }[status];

  return (
    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className="relative flex size-2">
        <AnimatePresence>
          <motion.span
            key={status}
            className={cn("absolute inline-flex size-full rounded-full opacity-60", map.color)}
            animate={{ scale: [1, 1.9, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </AnimatePresence>
        <span className={cn("relative inline-flex size-2 rounded-full", map.color)} />
      </span>
      {map.label}
    </span>
  );
}
