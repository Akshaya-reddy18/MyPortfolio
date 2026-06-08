import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks";
import type { ProjectClusterNodeData } from "../types";

function ProjectClusterNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as ProjectClusterNodeData;
  const { ref, position } = useMagnetic(90, 0.4);

  return (
    <div
      ref={ref}
      className={cn(
        "neural-flow-cluster",
        nodeData.isActive && "neural-flow-cluster--active",
        selected && "neural-flow-cluster--selected",
      )}
      style={{
        "--assemble-delay": `${nodeData.assemblyDelayMs ?? 0}ms`,
        "--mx": `${position.x}px`,
        "--my": `${position.y}px`,
      } as React.CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${nodeData.category}, ${nodeData.projectCount} projects`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="neural-flow-handle neural-flow-handle--hidden"
      />

      <span className="neural-flow-cluster__pulse" aria-hidden />
      <span className="neural-flow-cluster__dot" aria-hidden />
      <span className="neural-flow-cluster__label">{nodeData.category}</span>
      <span className="neural-flow-cluster__count">{nodeData.projectCount}</span>
    </div>
  );
}

export const ProjectClusterNode = memo(ProjectClusterNodeComponent);
