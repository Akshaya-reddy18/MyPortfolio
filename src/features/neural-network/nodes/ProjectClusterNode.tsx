import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import type { ProjectClusterNodeData } from "../types";

function ProjectClusterNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as ProjectClusterNodeData;

  return (
    <div
      className={cn(
        "neural-flow-cluster",
        nodeData.isActive && "neural-flow-cluster--active",
        selected && "neural-flow-cluster--selected",
      )}
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
