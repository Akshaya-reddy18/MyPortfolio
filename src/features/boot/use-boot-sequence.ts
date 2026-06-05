import { useCallback, useEffect, useRef, useState } from "react";
import { BOOT_STEPS, BOOT_TIMING } from "./boot-steps";

export type BootPhase = "title" | "sequence" | "complete" | "exiting";

const LOG_STEPS = BOOT_STEPS.filter((s) => s.variant !== "title");

interface UseBootSequenceOptions {
  onComplete: () => void;
  reducedMotion: boolean;
}

export function useBootSequence({
  onComplete,
  reducedMotion,
}: UseBootSequenceOptions) {
  const [phase, setPhase] = useState<BootPhase>("title");
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const exitTimerRef = useRef<number | null>(null);
  const completeTimerRef = useRef<number | null>(null);

  const activeStep =
    phase === "title" ? BOOT_STEPS[0] : LOG_STEPS[stepIndex];
  const activeText = activeStep?.text ?? BOOT_STEPS[0].text;

  const clearTimers = useCallback(() => {
    if (exitTimerRef.current !== null) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (completeTimerRef.current !== null) {
      window.clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }
  }, []);

  const beginExit = useCallback(() => {
    setPhase("exiting");
    clearTimers();
    exitTimerRef.current = window.setTimeout(() => {
      onComplete();
    }, BOOT_TIMING.exitDurationMs);
  }, [clearTimers, onComplete]);

  const skip = useCallback(() => {
    if (phase === "exiting") return;
    setSkipped(true);
    setProgress(100);
    setPhase("complete");
    clearTimers();
    completeTimerRef.current = window.setTimeout(
      beginExit,
      reducedMotion ? 120 : 280,
    );
  }, [phase, beginExit, clearTimers, reducedMotion]);

  const advanceStep = useCallback(() => {
    if (skipped) return;

    if (phase === "title") {
      setProgress(BOOT_STEPS[0].progress);
      setPhase("sequence");
      setStepIndex(0);
      return;
    }

    if (phase !== "sequence") return;

    const current = LOG_STEPS[stepIndex];
    if (current) {
      setProgress(current.progress);
    }

    if (stepIndex >= LOG_STEPS.length - 1) {
      setPhase("complete");
      return;
    }

    setStepIndex((i) => i + 1);
  }, [phase, stepIndex, skipped]);

  const handleLineComplete = useCallback(() => {
    const pauseMs = reducedMotion ? 60 : BOOT_TIMING.stepPauseMs;
    window.setTimeout(advanceStep, pauseMs);
  }, [advanceStep, reducedMotion]);

  useEffect(() => {
    if (phase !== "complete" || skipped) return;

    const holdMs = reducedMotion ? 200 : BOOT_TIMING.successHoldMs;
    completeTimerRef.current = window.setTimeout(beginExit, holdMs);

    return () => {
      if (completeTimerRef.current !== null) {
        window.clearTimeout(completeTimerRef.current);
      }
    };
  }, [phase, skipped, beginExit, reducedMotion]);

  useEffect(() => {
    if (phase !== "title" || !reducedMotion) return;

    const id = window.setTimeout(() => {
      setProgress(BOOT_STEPS[0].progress);
      setPhase("sequence");
      setStepIndex(0);
    }, 500);

    return () => window.clearTimeout(id);
  }, [phase, reducedMotion]);

  useEffect(() => clearTimers, [clearTimers]);

  const charInterval = reducedMotion ? 0 : BOOT_TIMING.charIntervalMs;

  const completedSteps =
    phase === "title"
      ? []
      : LOG_STEPS.slice(
          0,
          phase === "complete" ? LOG_STEPS.length : stepIndex,
        );

  const typingEnabled =
    !skipped &&
    phase !== "complete" &&
    phase !== "exiting" &&
    !(phase === "title" && reducedMotion);

  return {
    phase,
    stepIndex,
    progress,
    skipped,
    typingEnabled,
    activeText,
    activeStep,
    completedSteps,
    charInterval,
    skip,
    handleLineComplete,
    isExiting: phase === "exiting",
  };
}
