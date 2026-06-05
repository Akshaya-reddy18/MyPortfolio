import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import { BootSequence } from "@/features/boot/BootSequence";
import { Desktop } from "@/features/desktop/Desktop";

type AppView = "boot" | "desktop";

export function App() {
  const [view, setView] = useState<AppView>("boot");

  const handleBootComplete = useCallback(() => {
    setView("desktop");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {view === "boot" ? (
        <BootSequence key="boot" onComplete={handleBootComplete} />
      ) : (
        <motion.div
          key="desktop"
          className="min-h-screen"
          initial={{ opacity: 0, scale: 1.02, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.72,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <Desktop />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
