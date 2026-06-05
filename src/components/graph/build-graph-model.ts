import { APP_SHELL_TITLE } from "@/config/app.config";
import type { PortfolioData } from "@/types";
import type { PortfolioGraphModel, PortfolioNodeData } from "./types";

function entryLabel(entry: PortfolioData[number]): string {
  switch (entry.type) {
    case "project":
    case "experience":
    case "achievement":
      return entry.title;
    case "skill":
      return entry.name;
    case "education":
      return "Education";
  }
}

/**
 * Builds a React Flow graph from portfolio JSON.
 * Positions are placeholders; layout runs in the UI phase.
 */
export function buildPortfolioGraphModel(data: PortfolioData): PortfolioGraphModel {
  const entryNodes = data.map((entry, index) => {
    const entryId = String(index);
    const nodeData: PortfolioNodeData = {
      entryId,
      kind: entry.type,
      label: entryLabel(entry),
      entry,
    };

    return {
      id: entryId,
      type: entry.type,
      position: { x: 0, y: 0 },
      data: nodeData,
    };
  });

  const hubId = "hub";
  const hubNode = {
    id: hubId,
    type: "hub",
    position: { x: 0, y: 0 },
    data: {
      entryId: hubId,
      kind: "hub" as const,
      label: APP_SHELL_TITLE,
    },
  };

  const edges = entryNodes.map((node) => ({
    id: `e-${hubId}-${node.id}`,
    source: hubId,
    target: node.id,
  }));

  return {
    nodes: [hubNode, ...entryNodes],
    edges,
  };
}
