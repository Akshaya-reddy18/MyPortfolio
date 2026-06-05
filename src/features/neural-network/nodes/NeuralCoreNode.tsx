import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import type { NeuralCoreNodeData } from "../types";

const ORBIT_PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  angle: i * 45,
  delay: i * 0.35,
}));

function NeuralCoreNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as NeuralCoreNodeData;

  return (
    <div
      className={cn(
        "neural-flow-core neural-flow-core--hero",
        selected && "neural-flow-core--selected",
      )}
    >
      {NAV_HANDLE_POSITIONS.map((pos) => (
        <Handle
          key={pos}
          type="source"
          position={pos}
          className="neural-flow-handle neural-flow-handle--hidden"
        />
      ))}

      <div className="neural-flow-core__signal neural-flow-core__signal--a" aria-hidden />
      <div className="neural-flow-core__signal neural-flow-core__signal--b" aria-hidden />

      <div className="neural-flow-core__pulse-ring neural-flow-core__pulse-ring--1" aria-hidden />
      <div className="neural-flow-core__pulse-ring neural-flow-core__pulse-ring--2" aria-hidden />
      <div className="neural-flow-core__pulse-ring neural-flow-core__pulse-ring--3" aria-hidden />

      <div className="neural-flow-core__orbit" aria-hidden>
        {ORBIT_PARTICLES.map((particle) => (
          <span
            key={particle.id}
            className="neural-flow-core__orbit-particle"
            style={{
              ["--orbit-angle" as string]: `${particle.angle}deg`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="neural-flow-core__glow" aria-hidden />
      <div className="neural-flow-core__ring" aria-hidden>
        <div className="neural-flow-core__ring-inner" />
      </div>

      <div
        className="neural-flow-core__avatar"
        style={{ backgroundImage: `url("${nodeData.avatarSrc}")` }}
        role="img"
        aria-label={nodeData.avatarAlt}
      />

      <div className="neural-flow-core__meta">
        <p className="neural-flow-core__name">{nodeData.name}</p>
        <p className="neural-flow-core__role">{nodeData.role}</p>
        <span
          className={cn(
            "neural-flow-core__status",
            `neural-flow-core__status--${nodeData.statusState}`,
          )}
        >
          <span className="neural-flow-core__status-dot" aria-hidden />
          {nodeData.statusLabel}
        </span>
      </div>
    </div>
  );
}

const NAV_HANDLE_POSITIONS = [
  Position.Top,
  Position.Right,
  Position.Bottom,
  Position.Left,
] as const;

export const NeuralCoreNode = memo(NeuralCoreNodeComponent);
