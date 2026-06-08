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
import { useCallback, useEffect, useMemo, useState } from "react";
import { setProfileScrollTarget } from "@/features/apps/profile-scroll";
import { useWindowManager } from "@/features/desktop/window-manager/window-manager-context";
import { useIsTablet } from "@/hooks/use-media-query";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { cn } from "@/lib/utils";
import {
  buildNeuralNavGraph,
  getAppIdFromNodeId,
  getNavSpecFromNodeId,
} from "./build-nav-graph";
import { NeuralEdge } from "./edges/NeuralEdge";
import { NEURAL_CORE_NODE_ID, PROFILE_APP_ID } from "./nav-module-specs";
import { NavModuleNode } from "./nodes/NavModuleNode";
import { NeuralCoreNode } from "./nodes/NeuralCoreNode";
import "./neural-network.css";

const nodeTypes = {
  neuralCore: NeuralCoreNode,
  navModule: NavModuleNode,
};

const edgeTypes = {
  neural: NeuralEdge,
};

interface NeuralNetworkNavInnerProps {
  className?: string;
  paused?: boolean;
  viewport: { width: number; height: number };
}

function NeuralNetworkNavInner({
  className,
  paused = false,
  viewport,
}: NeuralNetworkNavInnerProps) {
  const { document, meta, isLoading, isError, error } = usePortfolioData();
  const { windows, openAppFromNeural } = useWindowManager();
  const { fitView } = useReactFlow();
  const [isAssembling, setIsAssembling] = useState(true);
  const isTablet = useIsTablet();

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
    return buildNeuralNavGraph({
      document,
      meta,
      activeAppIds,
      viewport,
      simplified: isTablet,
    });
  }, [document, meta, activeAppIds, viewport, isTablet]);

  useEffect(() => {
    if (!graph?.nodes.length) return;
    const id = requestAnimationFrame(() => {
      fitView({ padding: 0.02, duration: 900, minZoom: 0.5, maxZoom: 1.28 });
    });
    return () => cancelAnimationFrame(id);
  }, [graph, fitView]);

  useEffect(() => {
    if (!graph) return;
    setIsAssembling(true);
    const timer = window.setTimeout(() => setIsAssembling(false), 3800);
    return () => window.clearTimeout(timer);
  }, [graph]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node: Node) => {
      if (paused) return;

      if (node.id === NEURAL_CORE_NODE_ID) {
        openAppFromNeural(PROFILE_APP_ID);
        return;
      }

      const spec = getNavSpecFromNodeId(node.id);
      const appId = getAppIdFromNodeId(node.id);

      if (spec?.profileSection) {
        setProfileScrollTarget(spec.profileSection);
      }

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
        <p className="akshaya-type-mono-sm">Initializing neural graph…</p>
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
      className={cn(
        "neural-network-canvas",
        paused && "neural-network-canvas--paused",
        isAssembling && "neural-network-canvas--assembling",
        isTablet && "neural-network-canvas--tablet",
        className,
      )}
      nodes={graph.nodes}
      edges={graph.edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={[0.5, 0.5]}
      onNodeClick={onNodeClick}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable
      panOnScroll
      zoomOnScroll
      minZoom={0.38}
      maxZoom={1.6}
      proOptions={{ hideAttribution: true }}
      defaultEdgeOptions={{ type: "neural", animated: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={48}
        size={0.85}
        color="rgb(255 255 255 / 3%)"
      />
    </ReactFlow>
  );
}

interface NeuralNetworkNavProps {
  className?: string;
  paused?: boolean;
  viewport?: { width: number; height: number };
}

export function NeuralNetworkNav({
  className,
  paused,
  viewport = { width: 1280, height: 800 },
}: NeuralNetworkNavProps) {
  return (
    <ReactFlowProvider>
      <NeuralNetworkNavInner
        className={className}
        paused={paused}
        viewport={viewport}
      />
    </ReactFlowProvider>
  );
}
