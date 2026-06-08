import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AKSHAYA_DURATION, AKSHAYA_EASING } from "@/design-system";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { BOOT_STEPS } from "./boot-steps";
import { BootProgress } from "./BootProgress";
import { NeuralCoreBoot } from "./NeuralCoreBoot";
import { TypingLine } from "./TypingLine";
import { useBootSequence } from "./use-boot-sequence";

interface BootSequenceProps {
  onComplete: () => void;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { document, isLoaded } = usePortfolioData();
  const profile = document?.neuralCore.profile;

  const {
    phase,
    stepIndex,
    progress,
    typingEnabled,
    activeText,
    activeStep,
    completedSteps,
    charInterval,
    skip,
    handleLineComplete,
    isExiting,
  } = useBootSequence({ onComplete, reducedMotion });

  const logSteps = BOOT_STEPS.filter((s) => s.variant !== "title");
  const showTitle = phase === "title";
  const currentVariant = activeStep?.variant ?? "log";
  const displayName = profile?.name ?? null;

  return (
    <motion.div
      className="boot-cinematic fixed inset-0 z-[200] overflow-hidden bg-void"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{
        duration: AKSHAYA_DURATION.slow / 1000,
        ease: AKSHAYA_EASING.smooth,
      }}
    >
      <div className="boot-cinematic__grid-bg" aria-hidden />
      <motion.div
        className="boot-cinematic__glow"
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.06, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      <motion.button
        type="button"
        onClick={skip}
        className="boot-cinematic__skip akshaya-focus-ring"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.35 }}
        aria-label="Skip boot sequence"
      >
        Skip
      </motion.button>

      <div className="boot-cinematic__layout">
        <motion.section
          className="boot-cinematic__hero"
          animate={
            isExiting
              ? { scale: 1.08, opacity: 0, filter: "blur(10px)" }
              : { scale: 1, opacity: 1, filter: "blur(0px)" }
          }
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <NeuralCoreBoot pulse={!isExiting} />

          <AnimatePresence mode="wait">
            {showTitle ? (
              <motion.div
                key="title-block"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="boot-cinematic__title-block"
              >
                {reducedMotion ? (
                  <h1 className="boot-cinematic__title">AKSHAYA OS</h1>
                ) : (
                  <TypingLine
                    text="AKSHAYA OS"
                    enabled={typingEnabled}
                    intervalMs={charInterval}
                    variant="title"
                    onComplete={handleLineComplete}
                  />
                )}

                <motion.p
                  className="boot-cinematic__identity"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isLoaded && displayName ? 1 : 0.5 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  {displayName ?? "AKSHAYA OS"}
                  {profile?.role && displayName && (
                    <span className="boot-cinematic__role"> · {profile.role}</span>
                  )}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="identity-only"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="boot-cinematic__title-block"
              >
                {displayName && (
                  <p className="boot-cinematic__name">{displayName}</p>
                )}
                {profile?.role && (
                  <p className="boot-cinematic__role-line">{profile.role}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <motion.section
          className="boot-cinematic__terminal"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="boot-cinematic__terminal-chrome">
            <span />
            <span />
            <span />
            <p className="boot-cinematic__terminal-label">system/init</p>
          </div>

          <div className="boot-cinematic__terminal-body">
            <AnimatePresence mode="wait">
              {!showTitle && (
                <motion.ul
                  key="logs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="boot-cinematic__log-list"
                  aria-live="polite"
                >
                  {completedSteps.map((step) => (
                    <motion.li
                      key={step.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 0.45, x: 0 }}
                      className="boot-cinematic__log-line boot-cinematic__log-line--done"
                    >
                      <span className="boot-cinematic__log-marker" aria-hidden />
                      {step.text}
                    </motion.li>
                  ))}

                  {phase !== "complete" && activeStep && (
                    <li className="boot-cinematic__log-line">
                      <TypingLine
                        text={activeText}
                        enabled={typingEnabled}
                        intervalMs={charInterval}
                        variant={currentVariant}
                        onComplete={handleLineComplete}
                      />
                    </li>
                  )}

                  {phase === "complete" && (
                    <motion.li
                      key="ready"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 320, damping: 26 }}
                      className="boot-cinematic__log-line boot-cinematic__log-line--ready"
                    >
                      <span className="boot-cinematic__log-marker boot-cinematic__log-marker--live" />
                      Enter
                    </motion.li>
                  )}
                </motion.ul>
              )}
            </AnimatePresence>

            <BootProgress progress={progress} />

            <p className="boot-cinematic__hint">
              {phase === "complete"
                ? "Launching environment"
                : `${Math.min(stepIndex + 1, logSteps.length)} / ${logSteps.length}`}
            </p>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
