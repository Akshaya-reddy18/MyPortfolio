export interface BootStep {
  id: string;
  text: string;
  progress: number;
  variant?: "title" | "log" | "success";
}

export const BOOT_STEPS: BootStep[] = [
  { id: "title", text: "AKSHAYA OS", progress: 12, variant: "title" },
  {
    id: "graph",
    text: "Mapping neural graph",
    progress: 45,
    variant: "log",
  },
  {
    id: "sync",
    text: "Syncing portfolio modules",
    progress: 78,
    variant: "log",
  },
  {
    id: "ready",
    text: "Enter",
    progress: 100,
    variant: "success",
  },
];

export const BOOT_TIMING = {
  titleRevealMs: 520,
  charIntervalMs: 14,
  charIntervalFastMs: 8,
  stepPauseMs: 180,
  successHoldMs: 650,
  exitDurationMs: 480,
} as const;
