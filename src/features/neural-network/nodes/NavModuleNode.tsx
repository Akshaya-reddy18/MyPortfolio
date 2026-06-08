import { Handle, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks";
import type { NavModuleNodeData } from "../types";

function NavModuleNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as NavModuleNodeData;
  const Icon = nodeData.icon;
  const isPrimary = nodeData.tier === "primary";
  const { ref, position } = useMagnetic(isPrimary ? 90 : 0, isPrimary ? 0.28 : 0);

  return (
    <div
      ref={ref}
      className={cn(
        "neural-flow-nav",
        isPrimary && "neural-flow-nav--primary",
        !isPrimary && "neural-flow-nav--tertiary",
        nodeData.isActive && "neural-flow-nav--active",
        selected && "neural-flow-nav--selected",
      )}
      style={{
        "--assemble-delay": `${nodeData.assemblyDelayMs ?? 0}ms`,
        "--mx": `${position.x}px`,
        "--my": `${position.y}px`,
      } as React.CSSProperties}
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
        <Icon className={cn(isPrimary ? "h-5 w-5" : "h-4 w-4")} strokeWidth={1.75} />
      </span>

      <span className="neural-flow-nav__label">{nodeData.label}</span>

      {nodeData.count !== undefined && isPrimary && (
        <span className="neural-flow-nav__badge" aria-hidden>
          {nodeData.count}
        </span>
      )}
    </div>
  );
}

export const NavModuleNode = memo(NavModuleNodeComponent);
