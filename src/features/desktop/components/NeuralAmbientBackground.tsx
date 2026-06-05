import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface NeuralAmbientBackgroundProps {
  active?: boolean;
  className?: string;
}

const PARTICLE_COUNT = 18;
const PACKET_COUNT = 6;

export function NeuralAmbientBackground({
  active = true,
  className,
}: NeuralAmbientBackgroundProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        top: `${(i * 23 + 11) % 100}%`,
        delay: `${(i % 7) * 0.7}s`,
        duration: `${5 + (i % 5)}s`,
        size: i % 3 === 0 ? "0.35rem" : "0.2rem",
      })),
    [],
  );

  const packets = useMemo(
    () =>
      Array.from({ length: PACKET_COUNT }, (_, i) => ({
        id: i,
        top: `${15 + i * 14}%`,
        delay: `${i * 1.4}s`,
        duration: `${6 + i}s`,
      })),
    [],
  );

  return (
    <div
      className={cn(
        "neural-ambient pointer-events-none absolute inset-0 z-[1] overflow-hidden",
        !active && "neural-ambient--dim",
        className,
      )}
      aria-hidden
    >
      <div className="neural-ambient__pathways" />
      <div className="neural-ambient__glow neural-ambient__glow--left" />
      <div className="neural-ambient__glow neural-ambient__glow--right" />

      {particles.map((particle) => (
        <span
          key={particle.id}
          className="neural-ambient__particle"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}

      {packets.map((packet) => (
        <span
          key={packet.id}
          className="neural-ambient__packet"
          style={{
            top: packet.top,
            animationDelay: packet.delay,
            animationDuration: packet.duration,
          }}
        />
      ))}

      <div className="neural-ambient__signal neural-ambient__signal--a" />
      <div className="neural-ambient__signal neural-ambient__signal--b" />
    </div>
  );
}
