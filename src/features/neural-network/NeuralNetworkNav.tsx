import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo } from "react";
import { useWindowManager } from "@/features/desktop/window-manager/window-manager-context";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { cn } from "@/lib/utils";
import { buildNeuralNavGraph, getAppIdFromNodeId } from "./build-nav-graph";
import { NeuralEdge } from "./edges/NeuralEdge";
import { NEURAL_CORE_NODE_ID, PROFILE_APP_ID } from "./nav-module-specs";
import { NavModuleNode } from "./nodes/NavModuleNode";
import { NeuralCoreNode } from "./nodes/NeuralCoreNode";
import { ProjectClusterNode } from "./nodes/ProjectClusterNode";
import "./neural-network.css";

const nodeTypes = {
  neuralCore: NeuralCoreNode,
  navModule: NavModuleNode,
  projectCluster: ProjectClusterNode,
};

const edgeTypes = {
  neural: NeuralEdge,
};

interface NeuralNetworkNavInnerProps {
  className?: string;
  paused?: boolean;
}

function NeuralNetworkNavInner({ className, paused = false }: NeuralNetworkNavInnerProps) {
  const { document, meta, isLoading, isError, error } = usePortfolioData();
  const { windows, openAppFromNeural } = useWindowManager();
  const { fitView } = useReactFlow();

  const activeAppIds = useMemo(
    () =>
      new Set(
        windows
          .filter((w) => w.state !== "minimized")
          .map((w) => w.appId),
      ),
    [windows],
  );

  const graph = useMemo(() => {
    if (!document || !meta) return null;
    return buildNeuralNavGraph({ document, meta, activeAppIds });
  }, [document, meta, activeAppIds]);

  useEffect(() => {
    if (!graph?.nodes.length) return;

    const id = requestAnimationFrame(() => {
      fitView({ padding: 0.04, duration: 620, minZoom: 0.32, maxZoom: 1.05 });
    });

    return () => cancelAnimationFrame(id);
  }, [graph, fitView]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node: Node) => {
      if (paused) return;

      if (node.id === NEURAL_CORE_NODE_ID) {
        openAppFromNeural(PROFILE_APP_ID);
        return;
      }

      const appId = getAppIdFromNodeId(node.id);
      if (appId) {
        openAppFromNeural(appId);
      }
    },
    [openAppFromNeural, paused],
  );

  if (isLoading) {
    return (
      <div className={cn("neural-network-loading", className)} aria-busy>
        <div className="neural-network-loading__spinner" />
        <p className="akshaya-type-mono-sm">Loading knowledge graph…</p>
      </div>
    );
  }

  if (isError || !graph) {
    return (
      <div className={cn("neural-network-loading", className)} role="alert">
        <p className="akshaya-type-body-sm text-error">
          {error ?? "Unable to load neural navigation graph."}
        </p>
      </div>
    );
  }

  return (
    <ReactFlow
      className={cn("neural-network-canvas", paused && "neural-network-canvas--paused", className)}
      nodes={graph.nodes}
      edges={graph.edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeClick={onNodeClick}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      panOnScroll
      zoomOnScroll
      minZoom={0.28}
      maxZoom={1.2}
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{ type: "neural", animated: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={32}
        size={1}
        color="rgb(255 255 255 / 5%)"
      />
    </ReactFlow>
  );
}

interface NeuralNetworkNavProps {
  className?: string;
  paused?: boolean;
}

export function NeuralNetworkNav({ className, paused }: NeuralNetworkNavProps) {
  return (
    <ReactFlowProvider>
      <NeuralNetworkNavInner className={className} paused={paused} />
    </ReactFlowProvider>
  );
}
