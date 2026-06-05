import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import type { NavModuleNodeData } from "../types";

function NavModuleNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as NavModuleNodeData;
  const Icon = nodeData.icon;

  return (
    <div
      className={cn(
        "neural-flow-nav",
        nodeData.isActive && "neural-flow-nav--active",
        selected && "neural-flow-nav--selected",
        nodeData.navId === "projects" && "neural-flow-nav--hub",
      )}
      role="button"
      tabIndex={0}
      aria-label={`Open ${nodeData.label}${nodeData.count ? `, ${nodeData.count} items` : ""}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="neural-flow-handle neural-flow-handle--hidden"
      />

      <span className="neural-flow-nav__icon-wrap" aria-hidden>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>

      <span className="neural-flow-nav__label">{nodeData.label}</span>

      {nodeData.count !== undefined && (
        <span className="neural-flow-nav__badge" aria-hidden>
          {nodeData.count}
        </span>
      )}
    </div>
  );
}

export const NavModuleNode = memo(NavModuleNodeComponent);
