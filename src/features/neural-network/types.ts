import type { LucideIcon } from "lucide-react";
import type { AppId } from "@/features/desktop/types";
import type { PortfolioEntryType } from "@/types";

export type NavNodeId =
  | "projects"
  | "skills"
  | "experience"
  | "achievements"
  | "education"
  | "resume"
  | "contact";

export type NavTier = "primary" | "tertiary";

export interface NavModuleSpec {
  navId: NavNodeId;
  appId: AppId;
  entryType?: PortfolioEntryType;
  icon: LucideIcon;
  tier: NavTier;
  profileSection?: string;
}

export interface NeuralCoreNodeData {
  name: string;
  role: string;
  avatarSrc: string;
  avatarAlt: string;
  statusLabel: string;
  statusState: string;
  assemblyDelayMs?: number;
  [key: string]: unknown;
}

export interface NavModuleNodeData {
  navId: NavNodeId;
  appId: AppId;
  label: string;
  tier: NavTier;
  count?: number;
  isActive: boolean;
  icon: LucideIcon;
  assemblyDelayMs?: number;
  [key: string]: unknown;
}

export interface ProjectClusterNodeData {
  category: string;
  projectCount: number;
  isActive: boolean;
  assemblyDelayMs?: number;
  [key: string]: unknown;
}

export type NeuralFlowNode =
  | { id: string; type: "neuralCore"; position: { x: number; y: number }; data: NeuralCoreNodeData }
  | { id: string; type: "navModule"; position: { x: number; y: number }; data: NavModuleNodeData }
  | { id: string; type: "projectCluster"; position: { x: number; y: number }; data: ProjectClusterNodeData };
