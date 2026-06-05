import type { PortfolioDocument } from "./portfolio-document";

/** Discriminant values for every entry in portfolio_data.json */
export const PORTFOLIO_ENTRY_TYPES = [  "project",
  "experience",
  "skill",
  "achievement",
  "education",
] as const;

export type PortfolioEntryType = (typeof PORTFOLIO_ENTRY_TYPES)[number];

export interface PortfolioEntryBase {
  type: PortfolioEntryType;
}

export interface ProjectEntry extends PortfolioEntryBase {
  type: "project";
  title: string;
  tags: string[];
  stack: string[];
  description: string;
  impact: string;
  details: string;
  category: string;
  challenges?: string;
  solutions?: string;
}

export interface ExperienceEntry extends PortfolioEntryBase {
  type: "experience";
  title: string;
  company: string;
  duration: string;
  details: string;
}

export interface SkillEntry extends PortfolioEntryBase {
  type: "skill";
  name: string;
  details: string;
}

export interface AchievementEntry extends PortfolioEntryBase {
  type: "achievement";
  title: string;
  details: string;
}

export interface EducationEntry extends PortfolioEntryBase {
  type: "education";
  details: string;
}

export type PortfolioEntry =
  | ProjectEntry
  | ExperienceEntry
  | SkillEntry
  | AchievementEntry
  | EducationEntry;

/**
 * Legacy v1 shape: heterogeneous entry array.
 * Prefer `PortfolioDocument.entries` in v2.
 */
export type PortfolioData = PortfolioEntry[];

export interface PortfolioCollections {
  projects: ProjectEntry[];
  experiences: ExperienceEntry[];
  skills: SkillEntry[];
  achievements: AchievementEntry[];
  education: EducationEntry[];
}

export interface PortfolioMeta {
  totalEntries: number;
  counts: Record<PortfolioEntryType, number>;
  projectCategories: string[];
  allTags: string[];
  allStack: string[];
}

export type PortfolioLoadStatus = "idle" | "loading" | "loaded" | "error";

export interface PortfolioState {
  status: PortfolioLoadStatus;
  /** Full v2 document (null until loaded) */
  document: PortfolioDocument | null;
  /** Alias for `document.entries` — kept for backward-compatible hooks */
  data: PortfolioData | null;
  collections: PortfolioCollections | null;
  meta: PortfolioMeta | null;
  error: string | null;
}

export type PortfolioAction =
  | { type: "LOAD_START" }
  | {
      type: "LOAD_SUCCESS";
      payload: {
        document: PortfolioDocument;
        data: PortfolioData;
        collections: PortfolioCollections;
        meta: PortfolioMeta;
      };
    }
  | { type: "LOAD_ERROR"; payload: { error: string } }
  | { type: "RESET" };
