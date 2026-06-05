import { motion } from "framer-motion";
import { AKSHAYA_DURATION, AKSHAYA_EASING } from "@/design-system";
import { cn } from "@/lib/utils";

interface BootProgressProps {
  progress: number;
  className?: string;
}

export function BootProgress({ progress, className }: BootProgressProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="akshaya-type-label text-cyan-400/90">System Boot</span>
        <motion.span
          key={Math.round(clamped)}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="akshaya-type-mono-sm text-cyan-300 tabular-nums"
        >
          {Math.round(clamped)}%
        </motion.span>
      </div>

      <div
        className="relative h-1.5 overflow-hidden rounded-full bg-surface-2 border border-white/10"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Boot progress"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--akshaya-blue-600), var(--akshaya-purple-500), var(--akshaya-cyan-400))",
            boxShadow: "0 0 16px var(--akshaya-blue-glow)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{
            duration: AKSHAYA_DURATION.normal / 1000,
            ease: AKSHAYA_EASING.smooth,
          }}
        />
        <motion.div
          className="absolute inset-y-0 w-24 rounded-full opacity-60"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgb(255 255 255 / 35%), transparent)",
          }}
          animate={{ x: ["-100%", "400%"] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
