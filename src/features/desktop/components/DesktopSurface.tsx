import { AnimatePresence, motion } from "framer-motion";
import { AKSHAYA_DURATION, AKSHAYA_EASING } from "@/design-system";
import { NeuralNetworkNav } from "@/features/neural-network";
import { cn } from "@/lib/utils";
import type { WindowInstance } from "../types";
import { useWindowManager } from "../window-manager/window-manager-context";
import { NeuralAmbientBackground } from "./NeuralAmbientBackground";
import { WindowFrame } from "./WindowFrame";

interface DesktopSurfaceProps {
  className?: string;
}

export function DesktopSurface({ className }: DesktopSurfaceProps) {
  const { windows, desktopMode, blurDesktop } = useWindowManager();

  const applicationWindow = windows.find(
    (w) => w.launchMode === "dock" && w.state !== "minimized",
  );

  const floatingWindows = windows.filter(
    (w) => w.launchMode === "neural" && w.state !== "minimized",
  );

  const isApplicationMode =
    desktopMode === "application" && applicationWindow != null;

  return (
    <main
      className={cn("akshaya-desktop-surface relative flex-1 overflow-hidden", className)}
      aria-label="Desktop workspace"
      data-desktop-mode={desktopMode}
    >
      <NeuralAmbientBackground active={!isApplicationMode} />

      <motion.div
        className="absolute inset-0 z-0"
        onPointerDown={() => blurDesktop()}
        aria-label="Neural network navigation"
        animate={{
          opacity: isApplicationMode ? 0 : 1,
          scale: isApplicationMode ? 1.04 : 1,
          filter: isApplicationMode ? "blur(12px)" : "blur(0px)",
        }}
        transition={{
          duration: AKSHAYA_DURATION.slow / 1000,
          ease: AKSHAYA_EASING.out,
        }}
        style={{ pointerEvents: isApplicationMode ? "none" : "auto" }}
      >
        <NeuralNetworkNav className="h-full w-full" paused={isApplicationMode} />
      </motion.div>

      {isApplicationMode && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[5] bg-void/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden
        />
      )}

      <div className="pointer-events-none absolute inset-0 z-10">
        <AnimatePresence>
          {!isApplicationMode &&
            floatingWindows.map((win) => (
              <FloatingWindow key={win.id} window={win} />
            ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isApplicationMode && applicationWindow && (
          <ApplicationWindow key={applicationWindow.id} window={applicationWindow} />
        )}
      </AnimatePresence>
    </main>
  );
}

function FloatingWindow({ window }: { window: WindowInstance }) {
  return (
    <div className="pointer-events-auto">
      <WindowFrame window={window} variant="floating" />
    </div>
  );
}

function ApplicationWindow({ window }: { window: WindowInstance }) {
  return (
    <motion.div
      className="pointer-events-auto absolute inset-0 z-20"
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 12 }}
      transition={{
        duration: AKSHAYA_DURATION.slow / 1000,
        ease: AKSHAYA_EASING.out,
      }}
    >
      <WindowFrame window={window} variant="application" />
    </motion.div>
  );
}
