import type { Node, Edge } from "@xyflow/react";
import type { PortfolioEntry, PortfolioEntryType } from "@/types";

export type PortfolioNodeKind = PortfolioEntryType | "hub";

export interface PortfolioNodeData extends Record<string, unknown> {
  entryId: string;
  kind: PortfolioNodeKind;
  label: string;
  /** Present for entry nodes; omitted for structural hub nodes */
  entry?: PortfolioEntry;
}

export type PortfolioFlowNode = Node<PortfolioNodeData, string>;
export type PortfolioFlowEdge = Edge;

export interface PortfolioGraphModel {
  nodes: PortfolioFlowNode[];
  edges: PortfolioFlowEdge[];
}
