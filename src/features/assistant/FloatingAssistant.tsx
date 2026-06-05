import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { AKSHAYA_DURATION, AKSHAYA_EASING } from "@/design-system";
import { AppGate } from "@/features/apps/components/AppGate";
import { cn } from "@/lib/utils";
import { AssistantPanel } from "./AssistantPanel";
import "./assistant-panel.css";

const STORAGE_KEY = "neural-assistant-open";

function readStoredOpen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeStoredOpen(open: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(open));
  } catch {
    /* ignore */
  }
}

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(readStoredOpen);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    writeStoredOpen(isOpen && !isMinimized);
  }, [isOpen, isMinimized]);

  return (
    <AppGate>
      {(document) => {
        if (!document.applications.assistant.enabled) return null;

        return (
          <div className="neural-assistant-fab-root" aria-live="polite">
            <AnimatePresence>
              {isOpen && !isMinimized && (
                <motion.div
                  className="neural-assistant-fab-root__panel"
                  initial={{ opacity: 0, y: 16, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{
                    duration: AKSHAYA_DURATION.normal / 1000,
                    ease: AKSHAYA_EASING.out,
                  }}
                >
                  <AssistantPanel
                    document={document}
                    onClose={() => {
                      setIsOpen(false);
                      setIsMinimized(false);
                    }}
                    onMinimize={() => setIsMinimized(true)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              className={cn(
                "neural-assistant-fab",
                (isOpen || isMinimized) && "neural-assistant-fab--active",
              )}
              onClick={() => {
                if (isMinimized) {
                  setIsMinimized(false);
                  setIsOpen(true);
                  return;
                }
                setIsOpen((prev) => !prev);
              }}
              aria-label={
                isOpen && !isMinimized
                  ? "Close NEURAL Assistant"
                  : "Open NEURAL Assistant"
              }
              aria-expanded={isOpen && !isMinimized}
            >
              <span className="neural-assistant-fab__ring" aria-hidden />
              <span className="neural-assistant-fab__pulse" aria-hidden />
              <Bot className="h-5 w-5" strokeWidth={1.75} />
              <span className="neural-assistant-fab__label">NEURAL</span>
            </button>
          </div>
        );
      }}
    </AppGate>
  );
}
