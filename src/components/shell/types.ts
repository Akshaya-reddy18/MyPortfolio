import type { PortfolioEntryType } from "@/types";

/** Future OS shell navigation targets — derived from JSON entry types */
export type ShellModuleId = PortfolioEntryType | "overview" | "graph";

export interface ShellModuleDescriptor {
  id: ShellModuleId;
  labelKey: string;
  entryType?: PortfolioEntryType;
}
