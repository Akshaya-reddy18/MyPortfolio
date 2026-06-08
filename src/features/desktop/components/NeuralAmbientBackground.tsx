import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface NeuralAmbientBackgroundProps {
  active?: boolean;
  className?: string;
}

const PARTICLE_COUNT = 8;
const PACKET_COUNT = 2;
const NETWORK_LINE_COUNT = 4;

export function NeuralAmbientBackground({
  active = true,
  className,
}: NeuralAmbientBackgroundProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${(i * 19 + 9) % 100}%`,
        top: `${(i * 27 + 13) % 100}%`,
        delay: `${(i % 6) * 0.9}s`,
        duration: `${6 + (i % 4)}s`,
        size: i % 4 === 0 ? "0.28rem" : "0.16rem",
      })),
    [],
  );

  const packets = useMemo(
    () =>
      Array.from({ length: PACKET_COUNT }, (_, i) => ({
        id: i,
        top: `${22 + i * 28}%`,
        delay: `${i * 2.1}s`,
        duration: `${7 + i * 1.5}s`,
      })),
    [],
  );

  const networkLines = useMemo(
    () =>
      Array.from({ length: NETWORK_LINE_COUNT }, (_, i) => ({
        id: i,
        left: `${12 + i * 22}%`,
        top: `${8 + (i % 2) * 35}%`,
        width: `${28 + (i % 3) * 12}%`,
        rotate: -18 + i * 12,
        delay: `${i * 0.8}s`,
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
      <div className="neural-ambient__depth neural-ambient__depth--a" />
      <div className="neural-ambient__depth neural-ambient__depth--b" />
      <div className="neural-ambient__grid" />
      <div className="neural-ambient__pathways" />

      {networkLines.map((line) => (
        <span
          key={line.id}
          className="neural-ambient__network-line"
          style={{
            left: line.left,
            top: line.top,
            width: line.width,
            transform: `rotate(${line.rotate}deg)`,
            animationDelay: line.delay,
          }}
        />
      ))}

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
    </div>
  );
}
