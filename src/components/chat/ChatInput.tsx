import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Mic, MicOff, Square, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chat-store";

interface Props {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

// Declare SpeechRecognition interface for TypeScript
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function ChatInput({ onSend, onStop, isStreaming }: Props) {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const { settings } = useChatStore();

  useEffect(() => {
    ref.current?.focus();
  }, []);

  useEffect(() => {
    if (!isStreaming) ref.current?.focus();
  }, [isStreaming]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  const submit = () => {
    if (!value.trim() || isStreaming) return;
    if (listening) {
      stopVoice();
    }
    onSend(value);
    setValue("");
    requestAnimationFrame(() => ref.current?.focus());
  };

  const toggleVoice = () => {
    if (listening) {
      stopVoice();
    } else {
      startVoice();
    }
  };

  const baseValueRef = useRef("");
  const latestValueRef = useRef("");

  const startVoice = () => {
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Voice input is not supported in this browser. Please use Chrome or Edge.");
      setTimeout(() => setVoiceError(null), 4000);
      return;
    }

    try {
      baseValueRef.current = value;
      latestValueRef.current = value;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = settings?.voiceLanguage || "en-US";

      recognition.onstart = () => {
        setListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let sessionTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          sessionTranscript += event.results[i][0].transcript;
        }

        const base = baseValueRef.current.trim();
        const spoken = sessionTranscript.trim();
        const nextValue = base ? `${base} ${spoken}` : spoken;

        latestValueRef.current = nextValue;
        setValue(nextValue);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setVoiceError(`Voice error: ${event.error}`);
          setTimeout(() => setVoiceError(null), 4000);
        }
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
        if (settings?.autoSendVoice && latestValueRef.current.trim()) {
          onSend(latestValueRef.current.trim());
          setValue("");
          latestValueRef.current = "";
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start voice recognition:", err);
      setListening(false);
      setVoiceError("Could not access microphone.");
      setTimeout(() => setVoiceError(null), 4000);
    }
  };

  const stopVoice = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
    }
    setListening(false);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4">
      {/* Voice Error Banner */}
      <AnimatePresence>
        {voiceError && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-2 inline-flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/15 px-3 py-1.5 text-xs text-destructive-foreground"
          >
            <MicOff className="size-3.5" />
            {voiceError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Listening Indicator Pill */}
      <AnimatePresence>
        {listening && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3.5 py-1 text-xs text-emerald-400 backdrop-blur-md"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <Volume2 className="size-3.5 animate-pulse text-emerald-400" />
            <span>Listening to your voice… Click microphone again to stop.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "glass rounded-3xl p-2 shadow-2xl shadow-emerald-950/30 transition-all focus-within:ring-2 focus-within:ring-primary/45",
          listening && "ring-2 ring-emerald-500/60 shadow-emerald-500/20"
        )}
      >
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          aria-label="Ask a question about your database"
          placeholder={listening ? "Listening... Speak your question now" : "Ask about sales, orders, customers, payments, products, or revenue..."}
          className="max-h-[220px] w-full resize-none bg-transparent px-3 pt-2.5 pb-1 text-[15px] leading-6 text-foreground placeholder:text-muted-foreground focus:outline-none"
        />

        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          <div className="flex items-center gap-1">
            {/* Voice Input Button */}
            <Ghost
              label={listening ? "Stop listening" : "Voice input"}
              active={listening}
              onClick={toggleVoice}
            >
              <Mic className={cn("size-4 transition-transform", listening && "scale-110 text-emerald-400 animate-pulse")} />
            </Ghost>

            <span className="ml-1 hidden text-[11px] text-muted-foreground sm:inline"></span>
          </div>

          {isStreaming ? (
            <button
              onClick={onStop}
              aria-label="Stop generating"
              className="grid size-9 place-items-center rounded-full bg-secondary text-foreground transition-all hover:bg-accent active:scale-95"
            >
              <Square className="size-3.5 fill-current" />
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!value.trim()}
              aria-label="Send message"
              className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
        </div>
      </motion.div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        DataMind AI can make mistakes. Always verify critical data before using in reports.
      </p>
    </div>
  );
}

function Ghost({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "grid size-9 place-items-center rounded-full text-muted-foreground transition-all hover:bg-accent hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active && "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40"
      )}
    >
      {children}
    </button>
  );
}
