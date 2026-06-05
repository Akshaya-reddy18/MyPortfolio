import {
  BaseEdge,
  getSmoothStepPath,
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
  const variant = (data as { variant?: string } | undefined)?.variant;
  const isBranch = variant === "branch";

  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: isBranch ? 14 : 22,
  });

  return (
    <BaseEdge
      id={id}
      path={path}
      className={cn(
        "neural-flow-edge",
        isBranch && "neural-flow-edge--branch",
        selected && "neural-flow-edge--selected",
      )}
      style={{
        stroke: selected
          ? "var(--akshaya-cyan-400)"
          : isBranch
            ? "var(--akshaya-purple-400)"
            : "var(--akshaya-node-edge-color)",
        strokeWidth: selected ? 2.25 : isBranch ? 1.25 : 1.75,
        filter: selected
          ? "drop-shadow(0 0 8px var(--akshaya-cyan-glow))"
          : isBranch
            ? "drop-shadow(0 0 4px var(--akshaya-purple-glow))"
            : undefined,
      }}
    />
  );
}

export const NeuralEdge = memo(NeuralEdgeComponent);
