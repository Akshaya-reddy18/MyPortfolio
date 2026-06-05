import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTyping } from "./use-typing";

interface TypingLineProps {
  text: string;
  enabled: boolean;
  intervalMs: number;
  variant?: "title" | "log" | "success";
  onComplete?: () => void;
  showCheck?: boolean;
  className?: string;
}

export function TypingLine({
  text,
  enabled,
  intervalMs,
  variant = "log",
  onComplete,
  showCheck = false,
  className,
}: TypingLineProps) {
  const { displayed, isComplete } = useTyping({
    text,
    enabled,
    intervalMs,
    onComplete,
  });

  const isTitle = variant === "title";
  const isSuccess = variant === "success";

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isTitle && "justify-center",
        className,
      )}
    >
      {showCheck && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={
            isComplete
              ? { scale: 1, opacity: 1 }
              : { scale: 0.6, opacity: 0.35 }
          }
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            isComplete
              ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-300"
              : "border-white/10 bg-white/5 text-transparent",
          )}
          aria-hidden
        >
          <Check className="h-3 w-3" strokeWidth={2.5} />
        </motion.span>
      )}

      <p
        className={cn(
          isTitle && "akshaya-type-display-md akshaya-type-gradient text-center",
          !isTitle && isSuccess && "akshaya-type-h2 text-cyan-300",
          !isTitle &&
            !isSuccess &&
            "akshaya-type-mono text-sm text-foreground/90",
        )}
      >
        {displayed}
        {enabled && !isComplete && (
          <motion.span
            className={cn(
              "inline-block w-[0.55em] align-baseline ml-0.5",
              isTitle ? "h-[1em] bg-purple-400" : "h-[1em] bg-cyan-400",
            )}
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.49, 0.5, 1] }}
            aria-hidden
          />
        )}
      </p>
    </div>
  );
}
