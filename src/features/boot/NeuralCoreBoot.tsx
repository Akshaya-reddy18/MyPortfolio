import { motion } from "framer-motion";
import { AKSHAYA_DURATION, AKSHAYA_EASING } from "@/design-system";
import { NEURAL_CORE_AVATAR } from "@/config/app.config";
import { cn } from "@/lib/utils";

interface NeuralCoreBootProps {
  className?: string;
  pulse?: boolean;
}

export function NeuralCoreBoot({ className, pulse = true }: NeuralCoreBootProps) {
  return (
    <motion.div
      className={cn("relative mx-auto", className)}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: AKSHAYA_DURATION.slow / 1000,
        ease: AKSHAYA_EASING.out,
      }}
    >
      <div
        className={cn(
          "akshaya-neural-core",
          pulse && "akshaya-animate-float",
        )}
      >
        <div className="akshaya-neural-core__glow" />
        <div className="akshaya-neural-core__ring">
          <div className="akshaya-neural-core__ring-inner" />
        </div>
        <motion.div
          className="akshaya-neural-core__avatar"
          style={{ backgroundImage: `url("${NEURAL_CORE_AVATAR}")` }}
          role="img"
          aria-label="Neural core identity"
          animate={
            pulse
              ? {
                  boxShadow: [
                    "0 0 32px var(--akshaya-blue-glow), 0 0 48px var(--akshaya-purple-glow)",
                    "0 0 40px var(--akshaya-cyan-glow), 0 0 56px var(--akshaya-purple-glow)",
                    "0 0 32px var(--akshaya-blue-glow), 0 0 48px var(--akshaya-purple-glow)",
                  ],
                }
              : undefined
          }
          transition={{
            duration: AKSHAYA_DURATION.glow / 1000,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-400/20"
        animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0, 0.45] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
        aria-hidden
      />
    </motion.div>
  );
}
