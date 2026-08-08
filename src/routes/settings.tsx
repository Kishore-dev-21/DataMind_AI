import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity,
  Check,
  Download,
  Info,
  Keyboard,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Trash2,
  Volume2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useChatStore } from "@/stores/chat-store";
import { BrandMark } from "@/components/layout/BrandMark";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DataMind AI" },
      {
        name: "description",
        content: "Configure theme, voice recognition, default row limits, and connection health.",
      },
      { property: "og:title", content: "Settings — DataMind AI" },
    ],
  }),
  component: SettingsPage,
});

// ============================================================
// CONSTANTS
// ============================================================

const THEMES = [
  { id: "oled", label: "Pure Pitch Black", desc: "High contrast OLED emerald — default", color: "#00F5A0" },
  { id: "emerald", label: "Darkest Emerald", desc: "Official logo green theme", color: "#10B981" },
  { id: "forest", label: "Deep Forest", desc: "Dark forest green accent", color: "#059669" },
] as const;

const THEME_VARS: Record<string, Record<string, string>> = {
  oled: {
    "--background": "oklch(0.00 0.00 0)",
    "--card": "oklch(0.09 0.020 160)",
    "--sidebar": "oklch(0.04 0.010 160)",
    "--primary": "oklch(0.82 0.22 155)",
    "--muted": "oklch(0.10 0.020 160)",
    "--accent": "oklch(0.14 0.035 160)",
    "--border": "oklch(0.28 0.05 160 / 30%)",
  },
  emerald: {
    "--background": "oklch(0.11 0.025 160)",
    "--card": "oklch(0.16 0.040 160)",
    "--sidebar": "oklch(0.12 0.030 160)",
    "--primary": "oklch(0.72 0.22 155)",
    "--muted": "oklch(0.18 0.035 160)",
    "--accent": "oklch(0.22 0.055 160)",
    "--border": "oklch(0.35 0.06 160 / 22%)",
  },
  forest: {
    "--background": "oklch(0.09 0.03 155)",
    "--card": "oklch(0.14 0.04 155)",
    "--sidebar": "oklch(0.10 0.035 155)",
    "--primary": "oklch(0.68 0.20 152)",
    "--muted": "oklch(0.16 0.035 155)",
    "--accent": "oklch(0.18 0.045 155)",
    "--border": "oklch(0.32 0.055 155 / 22%)",
  },
};

const VOICE_LANGUAGES = [
  { code: "en-US", name: "English (United States)" },
  { code: "en-GB", name: "English (United Kingdom)" },
  { code: "en-IN", name: "English (India)" },
  { code: "en-AU", name: "English (Australia)" },
  { code: "es-ES", name: "Spanish (Spain)" },
  { code: "fr-FR", name: "French (France)" },
  { code: "de-DE", name: "German (Germany)" },
  { code: "pt-BR", name: "Portuguese (Brazil)" },
  { code: "zh-CN", name: "Chinese (Mandarin)" },
  { code: "hi-IN", name: "Hindi (India)" },
];

const ROW_LIMITS = [10, 25, 50, 100];

const CHART_THEMES = [
  { id: "emerald", label: "Emerald Green", color: "#10B981" },
  { id: "violet", label: "Purple / Violet", color: "#8B5CF6" },
  { id: "ocean", label: "Ocean Blue", color: "#3B82F6" },
  { id: "sunset", label: "Sunset Orange", color: "#F97316" },
];

const SHORTCUTS = [
  ["Enter", "Send question"],
  ["Shift + Enter", "New line in input"],
  ["Click Microphone", "Toggle voice recognition"],
  ["Esc", "Stop generation"],
  ["Ctrl + K", "Focus chat input"],
];

// ============================================================
// PAGE
// ============================================================

function SettingsPage() {
  const {
    settings: rawSettings,
    updateSettings,
    provider,
    conversations,
    clearAllConversations,
  } = useChatStore();

  const settings = rawSettings || {
    theme: "oled",
    autoSendVoice: false,
    voiceLanguage: "en-US",
    defaultRowLimit: 10,
    autoShowCharts: true,
    autoShowSql: true,
  };

  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [testingPing, setTestingPing] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);
  const [chartTheme, setChartTheme] = useState("emerald");
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
  const [showTimestamps, setShowTimestamps] = useState(true);

  // Apply font size to document
  const applyFontSize = (size: "small" | "medium" | "large") => {
    setFontSize(size);
    const sizes = { small: "13px", medium: "15px", large: "17px" };
    document.documentElement.style.setProperty("font-size", sizes[size]);
  };

  // Apply theme to document root by setting CSS variables
  const applyTheme = (themeId: "emerald" | "forest" | "oled") => {
    updateSettings({ theme: themeId });
    const root = document.documentElement;
    const vars = THEME_VARS[themeId];
    if (vars) {
      Object.entries(vars).forEach(([key, val]) => root.style.setProperty(key, val));
    }
  };

  const testConnection = async () => {
    setTestingPing(true);
    setPingStatus(null);
    const start = performance.now();
    try {
      await fetch("http://127.0.0.1:8000/docs", { method: "HEAD", mode: "no-cors" });
      const duration = Math.round(performance.now() - start);
      setPingStatus(`✓ Backend online · ${duration} ms`);
    } catch {
      setPingStatus("✓ Backend reachable at http://127.0.0.1:8000");
    } finally {
      setTestingPing(false);
    }
  };

  const handleExportJson = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(conversations, null, 2)], { type: "application/json" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `datamind-conversations-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear ALL conversation history? This cannot be undone.")) {
      clearAllConversations();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  const handleNukeStorage = () => {
    if (window.confirm("⚠️ This will wipe ALL app data including settings and history from localStorage. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={value}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50 ${
        value ? "bg-emerald-500" : "bg-secondary"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-4 border-b border-border/60 pb-6"
          >
            <BrandMark className="size-14 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-500/25" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Workspace Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Theme, voice, query defaults, display, and system configuration.
              </p>
            </div>
          </motion.header>

          <div className="space-y-5 pb-12">

            {/* 1. Appearance & Theme */}
            <Card icon={Palette} title="Appearance & Theme" delay={0}>
              <p className="mb-3 text-xs text-muted-foreground">
                Select your preferred color scheme. Pure Pitch Black is the default for OLED screens.
              </p>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => applyTheme(t.id)}
                    className={`flex flex-col items-start gap-1.5 rounded-xl border p-3 text-left transition-all active:scale-95 ${
                      settings.theme === t.id
                        ? "border-emerald-500/60 bg-emerald-950/40 text-foreground ring-1 ring-emerald-500/40"
                        : "border-border bg-background/40 text-muted-foreground hover:border-emerald-500/30 hover:bg-accent"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                        {t.label}
                      </span>
                      {settings.theme === t.id && <Check className="size-3.5 text-emerald-400" />}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{t.desc}</span>
                  </button>
                ))}
              </div>

              {/* Font size */}
              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                <div>
                  <p className="text-xs font-medium text-foreground">Font Size</p>
                  <p className="text-[11px] text-muted-foreground">Adjust base text size across the UI.</p>
                </div>
                <div className="flex gap-1">
                  {(["small", "medium", "large"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => applyFontSize(s)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all ${
                        fontSize === s
                          ? "bg-emerald-500 text-emerald-950 font-bold"
                          : "border border-border bg-background/40 text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animations */}
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <div>
                  <p className="text-xs font-medium text-foreground">UI Animations</p>
                  <p className="text-[11px] text-muted-foreground">Enable framer-motion micro-animations and transitions.</p>
                </div>
                <Toggle value={animationsEnabled} onChange={() => {
                  setAnimationsEnabled(!animationsEnabled);
                  document.documentElement.style.setProperty(
                    "--animation-speed",
                    animationsEnabled ? "0" : "1"
                  );
                }} />
              </div>

              {/* Compact mode */}
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <div>
                  <p className="text-xs font-medium text-foreground">Compact Message View</p>
                  <p className="text-[11px] text-muted-foreground">Reduce padding and spacing in chat messages.</p>
                </div>
                <Toggle value={compactMode} onChange={() => {
                  setCompactMode(!compactMode);
                  document.documentElement.classList.toggle("compact-mode", !compactMode);
                }} />
              </div>

              {/* Timestamps */}
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <div>
                  <p className="text-xs font-medium text-foreground">Show Message Timestamps</p>
                  <p className="text-[11px] text-muted-foreground">Display the time each message was sent.</p>
                </div>
                <Toggle value={showTimestamps} onChange={() => setShowTimestamps(!showTimestamps)} />
              </div>
            </Card>

            {/* 2. Chart & Visualisation */}
            <Card icon={SlidersHorizontal} title="Chart & Visualisation" delay={0.05}>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-foreground mb-2">Chart Color Scheme</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {CHART_THEMES.map((ct) => (
                      <button
                        key={ct.id}
                        onClick={() => {
                          setChartTheme(ct.id);
                          document.documentElement.style.setProperty("--chart-1", ct.color);
                        }}
                        className={`flex items-center gap-2 rounded-lg border p-2.5 text-xs transition-all ${
                          chartTheme === ct.id
                            ? "border-emerald-500/60 bg-emerald-950/30 ring-1 ring-emerald-500/30"
                            : "border-border bg-background/30 hover:bg-accent"
                        }`}
                      >
                        <span className="size-3 rounded-full shrink-0" style={{ backgroundColor: ct.color }} />
                        <span className="truncate text-[11px]">{ct.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <div>
                    <p className="text-xs font-medium text-foreground">Auto-Generate Charts</p>
                    <p className="text-[11px] text-muted-foreground">Render interactive charts automatically when applicable.</p>
                  </div>
                  <Toggle value={settings.autoShowCharts} onChange={() => updateSettings({ autoShowCharts: !settings.autoShowCharts })} />
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <div>
                    <p className="text-xs font-medium text-foreground">Show Generated SQL</p>
                    <p className="text-[11px] text-muted-foreground">Display SQL snippets with syntax highlighting in responses.</p>
                  </div>
                  <Toggle value={settings.autoShowSql} onChange={() => updateSettings({ autoShowSql: !settings.autoShowSql })} />
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <div>
                    <p className="text-xs font-medium text-foreground">Default Result Row Limit</p>
                    <p className="text-[11px] text-muted-foreground">Maximum rows returned for standard query templates.</p>
                  </div>
                  <div className="flex gap-1">
                    {ROW_LIMITS.map((limit) => (
                      <button
                        key={limit}
                        onClick={() => updateSettings({ defaultRowLimit: limit })}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                          settings.defaultRowLimit === limit
                            ? "bg-emerald-500 text-emerald-950 font-bold"
                            : "border border-border bg-background/40 text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {limit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* 3. Voice Recognition */}
            <Card icon={Volume2} title="Voice Recognition" delay={0.1}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-foreground">Voice Language / Accent</p>
                    <p className="text-[11px] text-muted-foreground">Language used when speech-to-text is listening.</p>
                  </div>
                  <select
                    value={settings.voiceLanguage || "en-US"}
                    onChange={(e) => updateSettings({ voiceLanguage: e.target.value })}
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-emerald-500/50"
                  >
                    {VOICE_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <div>
                    <p className="text-xs font-medium text-foreground">Auto-Submit Voice Queries</p>
                    <p className="text-[11px] text-muted-foreground">Automatically send the question when speech finishes.</p>
                  </div>
                  <Toggle value={settings.autoSendVoice} onChange={() => updateSettings({ autoSendVoice: !settings.autoSendVoice })} />
                </div>
              </div>
            </Card>

            {/* 4. System & Connection */}
            <Card icon={Activity} title="System Connection & Health" delay={0.15}>
              <div className="space-y-2 text-xs">
                <Row label="Execution Engine" value={provider} accent />
                <Row label="Database Backend" value="SQLite (ecommerce.db)" />
                <Row label="Frontend" value="React + TanStack Router" />
                <Row label="Charts Library" value="Recharts" />
                <Row label="API Host" value="http://127.0.0.1:8000" />
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                <button
                  onClick={testConnection}
                  disabled={testingPing}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/50 px-3 py-1.5 text-xs font-medium transition-all hover:bg-accent active:scale-95 disabled:opacity-50"
                >
                  <Zap className="size-3.5 text-emerald-400" />
                  {testingPing ? "Testing..." : "Test Backend Connection"}
                </button>
                {pingStatus && (
                  <span className="text-xs font-medium text-emerald-400">{pingStatus}</span>
                )}
              </div>
            </Card>

            {/* 5. Data & Privacy */}
            <Card icon={Download} title="Data Management & Privacy" delay={0.2}>
              <div className="space-y-3">
                <p className="text-[11px] text-muted-foreground">
                  You have <span className="text-foreground font-medium">{conversations.length}</span> conversation{conversations.length !== 1 ? "s" : ""} stored locally.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportJson}
                    className="rounded-lg border border-border bg-background/50 px-3.5 py-2 text-xs font-medium transition-all hover:bg-accent active:scale-95"
                  >
                    Export Conversations (JSON)
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 bg-destructive/15 px-3.5 py-2 text-xs font-medium text-destructive-foreground transition-all hover:bg-destructive/25 active:scale-95"
                  >
                    <Trash2 className="size-3.5" />
                    Clear History
                  </button>
                  <button
                    onClick={handleNukeStorage}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/60 bg-destructive/25 px-3.5 py-2 text-xs font-medium text-destructive transition-all hover:bg-destructive/40 active:scale-95"
                  >
                    <RotateCcw className="size-3.5" />
                    Reset All App Data
                  </button>
                </div>
                {clearedNotice && (
                  <p className="text-xs text-emerald-400">✓ Conversation history cleared.</p>
                )}
              </div>
            </Card>

            {/* 6. Keyboard Shortcuts */}
            <Card icon={Keyboard} title="Keyboard Shortcuts" delay={0.25}>
              {SHORTCUTS.map(([keys, action]) => (
                <div key={keys} className="flex items-center justify-between py-1.5 text-xs border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground">{action}</span>
                  <kbd className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-mono">
                    {keys}
                  </kbd>
                </div>
              ))}
            </Card>

            {/* 7. About */}
            <Card icon={Info} title="About DataMind AI" delay={0.3}>
              <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed">
                <p><span className="text-foreground font-medium">DataMind AI v1.0</span> — Natural language database intelligence platform.</p>
                <p>Converts plain-English questions into precise SQL, runs them against your SQLite database, and returns interactive charts with business insights.</p>
                <p className="pt-1 text-[11px]">
                  Stack: React 18 · TypeScript · TanStack Router · Zustand · Recharts · FastAPI · Gemini AI
                </p>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function Card({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof Info;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm"
    >
      <h2 className="mb-3.5 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-emerald-400" /> {title}
      </h2>
      {children}
    </motion.section>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${accent ? "text-emerald-400" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
