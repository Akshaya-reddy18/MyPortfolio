import type { Edge, Node } from "@xyflow/react";
import type { AppId } from "@/features/desktop/types";
import type { PortfolioDocument, PortfolioMeta } from "@/types";
import { getProjects } from "@/lib/portfolio";
import { NAV_MODULE_SPECS, NEURAL_CORE_NODE_ID } from "./nav-module-specs";
import type {
  NavModuleNodeData,
  NavNodeId,
  NeuralCoreNodeData,
  ProjectClusterNodeData,
} from "./types";

const PRIMARY_RADIUS = 380;
const CLUSTER_RADIUS = 155;
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

function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export interface BuildNavGraphOptions {
  document: PortfolioDocument;
  meta: PortfolioMeta;
  activeAppIds?: Set<AppId>;
}

export interface NeuralNavGraph {
  nodes: Node<NeuralCoreNodeData | NavModuleNodeData | ProjectClusterNodeData>[];
  edges: Edge[];
}

export function buildNeuralNavGraph({
  document,
  meta,
  activeAppIds = new Set(),
}: BuildNavGraphOptions): NeuralNavGraph {
  const profile = document.neuralCore.profile;
  const projectsActive = activeAppIds.has("projects");

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
    },
    draggable: false,
    selectable: true,
    zIndex: 10,
  };

  const totalWeight = NAV_MODULE_SPECS.reduce(
    (sum, spec) => sum + (spec.layoutWeight ?? 1),
    0,
  );

  let angleCursor = -Math.PI / 2;

  const navNodes: Node<NavModuleNodeData>[] = NAV_MODULE_SPECS.map((spec) => {
    const weight = spec.layoutWeight ?? 1;
    const slice = (weight / totalWeight) * Math.PI * 2;
    const angle = angleCursor + slice / 2;
    angleCursor += slice;

    const radius =
      spec.navId === "projects" ? PRIMARY_RADIUS - 20 : PRIMARY_RADIUS;

    const count =
      spec.entryType && meta.counts[spec.entryType] > 0
        ? meta.counts[spec.entryType]
        : undefined;

    return {
      id: spec.navId,
      type: "navModule",
      position: {
        x: CENTER.x + radius * Math.cos(angle),
        y: CENTER.y + radius * Math.sin(angle),
      },
      data: {
        navId: spec.navId,
        appId: spec.appId,
        label: getNavLabel(spec.navId, document),
        count,
        isActive: activeAppIds.has(spec.appId),
        icon: spec.icon,
      },
      draggable: false,
      selectable: true,
      zIndex: 5,
    };
  });

  const projectsNode = navNodes.find((node) => node.id === "projects");
  const clusterNodes: Node<ProjectClusterNodeData>[] = [];
  const clusterEdges: Edge[] = [];

  if (projectsNode) {
    const categories = meta.projectCategories;
    const projects = getProjects(document.entries);
    const clusterSpread = Math.min(Math.PI * 0.9, categories.length * 0.28);
    const startAngle = -Math.PI / 2 - clusterSpread / 2;

    categories.forEach((category, index) => {
      const clusterAngle =
        categories.length === 1
          ? -Math.PI / 2
          : startAngle + (index / (categories.length - 1)) * clusterSpread;

      const clusterId = `cluster-${slugifyCategory(category)}`;
      const projectCount = projects.filter((p) => p.category === category).length;

      clusterNodes.push({
        id: clusterId,
        type: "projectCluster",
        position: {
          x: projectsNode.position.x + CLUSTER_RADIUS * Math.cos(clusterAngle),
          y: projectsNode.position.y + CLUSTER_RADIUS * Math.sin(clusterAngle),
        },
        data: {
          category,
          projectCount,
          isActive: projectsActive,
        },
        draggable: false,
        selectable: true,
        zIndex: 3,
      });

      clusterEdges.push({
        id: `edge-projects-${clusterId}`,
        source: "projects",
        target: clusterId,
        type: "neural",
        animated: true,
        data: { variant: "branch" },
      });
    });
  }

  const coreEdges: Edge[] = NAV_MODULE_SPECS.map((spec) => ({
    id: `edge-${NEURAL_CORE_NODE_ID}-${spec.navId}`,
    source: NEURAL_CORE_NODE_ID,
    target: spec.navId,
    type: "neural",
    animated: true,
    data: { variant: "primary" },
  }));

  return {
    nodes: [coreNode, ...navNodes, ...clusterNodes],
    edges: [...coreEdges, ...clusterEdges],
  };
}

export function getAppIdFromNodeId(nodeId: string): AppId | null {
  if (nodeId.startsWith("cluster-")) {
    return "projects";
  }

  const spec = NAV_MODULE_SPECS.find((s) => s.navId === nodeId);
  return spec?.appId ?? null;
}
