import type { ComponentType } from "react";
import type { PortfolioEntry, PortfolioEntryType } from "@/types";

/**
 * Props contract for future detail panels (one per entry type).
 * UI components will narrow `entry` by type internally.
 */
export interface PortfolioEntryPanelProps {
  entry: PortfolioEntry;
  entryId: string;
}

export type EntryPanelComponent = ComponentType<PortfolioEntryPanelProps>;

export type EntryPanelRegistry = Partial<
  Record<PortfolioEntryType, EntryPanelComponent>
>;

export const entryPanelRegistry: EntryPanelRegistry = {};

export function registerEntryPanel(
  type: PortfolioEntryType,
  component: EntryPanelComponent,
): void {
  entryPanelRegistry[type] = component;
}

export function getEntryPanel(
  type: PortfolioEntryType,
): EntryPanelComponent | undefined {
  return entryPanelRegistry[type];
}
