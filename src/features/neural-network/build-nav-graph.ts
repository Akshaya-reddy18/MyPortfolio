import type { Edge, Node } from "@xyflow/react";
import type { AppId } from "@/features/desktop/types";
import type { PortfolioDocument, PortfolioMeta } from "@/types";
import { computeNavPositions, type NavLayoutSlot } from "./layout";
import { NAV_MODULE_SPECS, NEURAL_CORE_NODE_ID } from "./nav-module-specs";
import type { NavModuleNodeData, NavNodeId, NeuralCoreNodeData } from "./types";

const CENTER = { x: 0, y: 0 };

function getNavLabel(navId: NavNodeId, document: PortfolioDocument): string {
  switch (navId) {
    case "resume":
      return document.resume.title;
    case "contact":
      return document.applications.contact.title;
    case "projects":
      return "Projects";
    case "skills":
      return "Skills";
    case "experience":
      return "Experience";
    case "achievements":
      return "Achievements";
    case "education":
      return "Education";
  }
}

export interface BuildNavGraphOptions {
  document: PortfolioDocument;
  meta: PortfolioMeta;
  activeAppIds?: Set<AppId>;
  viewport?: { width: number; height: number };
  simplified?: boolean;
}

export interface NeuralNavGraph {
  nodes: Node<NeuralCoreNodeData | NavModuleNodeData>[];
  edges: Edge[];
}

/**
 * Assembly timing strategy:
 * - Core: immediate (0ms)
 * - Primary nodes: staggered 500–900ms
 * - Primary edges: 900–1200ms
 * - Tertiary nodes: 1100–1500ms
 * - Tertiary edges: 1400–1800ms
 *
 * This creates a clear cinematic sequence:
 * core → primary ring → tertiary ring
 */
export function buildNeuralNavGraph({
  document,
  meta,
  activeAppIds = new Set(),
  viewport = { width: 1280, height: 800 },
  simplified = false,
}: BuildNavGraphOptions): NeuralNavGraph {
  const profile = document.neuralCore.profile;

  const coreNode: Node<NeuralCoreNodeData> = {
    id: NEURAL_CORE_NODE_ID,
    type: "neuralCore",
    position: { ...CENTER },
    data: {
      name: profile.name,
      role: profile.role,
      avatarSrc: profile.avatar.src,
      avatarAlt: profile.avatar.alt,
      statusLabel: profile.status.label,
      statusState: profile.status.state,
      assemblyDelayMs: 0,
    },
    draggable: false,
    selectable: true,
    zIndex: 20,
  };

  const activeSpecs = simplified
    ? NAV_MODULE_SPECS.filter((spec) => spec.tier === "primary")
    : NAV_MODULE_SPECS;

  const layoutSlots: NavLayoutSlot[] = activeSpecs.map((spec, index) => ({
    navId: spec.navId,
    tier: spec.tier,
    index,
  }));

  const positions = computeNavPositions(layoutSlots, viewport);

  // Separate by tier for staggered timing
  const primarySpecs = activeSpecs.filter((s) => s.tier === "primary");
  const tertiarySpecs = activeSpecs.filter((s) => s.tier === "tertiary");

  const navNodes: Node<NavModuleNodeData>[] = activeSpecs.map((spec) => {
    const pos = positions.get(spec.navId) ?? CENTER;
    const count =
      spec.entryType && meta.counts[spec.entryType] > 0
        ? meta.counts[spec.entryType]
        : undefined;

    const isPrimary = spec.tier === "primary";
    const tierIndex = isPrimary
      ? primarySpecs.indexOf(spec)
      : tertiarySpecs.indexOf(spec);

    // Primary: 500, 620, 740ms | Tertiary: 1100, 1220, 1340, 1460ms
    const assemblyDelayMs = isPrimary
      ? 500 + tierIndex * 120
      : 1100 + tierIndex * 120;

    return {
      id: spec.navId,
      type: "navModule",
      position: pos,
      data: {
        navId: spec.navId,
        appId: spec.appId,
        label: getNavLabel(spec.navId, document),
        tier: spec.tier,
        count,
        isActive: activeAppIds.has(spec.appId),
        icon: spec.icon,
        assemblyDelayMs,
      },
      draggable: false,
      selectable: true,
      zIndex: spec.tier === "primary" ? 10 : 5,
    };
  });

  const coreEdges: Edge[] = activeSpecs.map((spec) => {
    const isPrimary = spec.tier === "primary";
    const tierIndex = isPrimary
      ? primarySpecs.indexOf(spec)
      : tertiarySpecs.indexOf(spec);

    // Edges appear just after their target node
    const assemblyDelayMs = isPrimary
      ? 760 + tierIndex * 100
      : 1360 + tierIndex * 90;

    return {
      id: `edge-${NEURAL_CORE_NODE_ID}-${spec.navId}`,
      source: NEURAL_CORE_NODE_ID,
      target: spec.navId,
      type: "neural",
      animated: true,
      data: {
        variant: spec.tier === "primary" ? "primary" : "branch",
        assemblyDelayMs,
        signalDurationMs: spec.tier === "primary" ? 2200 : 2800,
      },
    };
  });

  return {
    nodes: [coreNode, ...navNodes],
    edges: coreEdges,
  };
}

export function getNavSpecFromNodeId(nodeId: string) {
  return NAV_MODULE_SPECS.find((s) => s.navId === nodeId);
}

export function getAppIdFromNodeId(nodeId: string): AppId | null {
  const spec = getNavSpecFromNodeId(nodeId);
  return spec?.appId ?? null;
}
