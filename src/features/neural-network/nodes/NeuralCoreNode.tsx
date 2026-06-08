import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import type { NeuralCoreNodeData } from "../types";

const ORBIT_PARTICLES = Array.from({ length: 6 }, (_, i) => i);

const NAV_HANDLE_POSITIONS = [
  Position.Top,
  Position.Right,
  Position.Bottom,
  Position.Left,
] as const;

function NeuralCoreNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as NeuralCoreNodeData;

  return (
    <div
      className={cn(
        "neural-flow-core",
        selected && "neural-flow-core--selected",
      )}
      style={{
        "--assemble-delay": `${nodeData.assemblyDelayMs ?? 0}ms`,
      } as React.CSSProperties}
    >
      {NAV_HANDLE_POSITIONS.map((pos) => (
        <Handle
          key={pos}
          type="source"
          position={pos}
          className="neural-flow-handle neural-flow-handle--hidden"
        />
      ))}

      <div className="neural-flow-core__glow" aria-hidden />
      <div className="neural-flow-core__pulse-ring neural-flow-core__pulse-ring--1" aria-hidden />
      <div className="neural-flow-core__pulse-ring neural-flow-core__pulse-ring--2" aria-hidden />

      <div className="neural-flow-core__orbit" aria-hidden>
        {ORBIT_PARTICLES.map((particle) => (
          <span
            key={particle}
            className={`neural-flow-core__orbit-particle neural-flow-core__orbit-particle--${particle + 1}`}
          />
        ))}
      </div>

      <div className="neural-flow-core__ring" aria-hidden>
        <div className="neural-flow-core__ring-inner" />
      </div>

      <img
        className="neural-flow-core__avatar"
        src={nodeData.avatarSrc}
        alt={nodeData.avatarAlt}
      />

      <div className="neural-flow-core__activity" aria-hidden>
        <span className="neural-flow-core__activity-bar" />
        <span className="neural-flow-core__activity-bar" />
        <span className="neural-flow-core__activity-bar" />
      </div>

      <div className="neural-flow-core__meta">
        <p className="neural-flow-core__eyebrow">Neural Core</p>
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

export const NeuralCoreNode = memo(NeuralCoreNodeComponent);
