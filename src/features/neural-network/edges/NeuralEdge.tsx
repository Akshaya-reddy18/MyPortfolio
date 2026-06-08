import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { memo } from "react";
import { cn } from "@/lib/utils";

function NeuralEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps) {
  const edgeData =
    (data as { variant?: string; assemblyDelayMs?: number; signalDurationMs?: number } | undefined) ??
    undefined;
  const variant = edgeData?.variant;
  const isBranch = variant === "branch";
  const packetDuration = edgeData?.signalDurationMs ?? (isBranch ? 2800 : 2200);

  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    // Reduced curvature — cleaner, less tangled look
    curvature: isBranch ? 0.45 : 0.35,
  });

  const pathId = `neural-path-${id}`;

  return (
    <g
      className={cn(
        "neural-flow-edge-wrap",
        isBranch && "neural-flow-edge-wrap--branch",
        selected && "neural-flow-edge-wrap--selected",
      )}
      style={{
        "--assemble-delay": `${edgeData?.assemblyDelayMs ?? 0}ms`,
      } as React.CSSProperties}
    >
      {/* Base dashed stroke */}
      <BaseEdge
        id={id}
        path={path}
        className={cn(
          "neural-flow-edge",
          isBranch && "neural-flow-edge--branch",
          selected && "neural-flow-edge--selected",
        )}
      />

      {/* Invisible path used as motion track for the packet */}
      <path id={pathId} d={path} fill="none" stroke="none" />

      {/* Soft glow overlay for depth */}
      <path d={path} className="neural-flow-edge__glow" />

      {/* Traveling data packet */}
      <circle
        r={isBranch ? 1.5 : 1.8}
        className="neural-flow-edge__packet"
      >
        <animateMotion
          dur={`${packetDuration}ms`}
          repeatCount="indefinite"
          rotate="auto"
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
    </g>
  );
}

export const NeuralEdge = memo(NeuralEdgeComponent);
