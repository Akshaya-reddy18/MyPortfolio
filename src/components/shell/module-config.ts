import type { PortfolioEntryType } from "@/types";
import type { ShellModuleDescriptor } from "./types";

const ENTRY_TYPE_LABELS: Record<PortfolioEntryType, string> = {
  project: "Projects",
  experience: "Experience",
  skill: "Skills",
  achievement: "Achievements",
  education: "Education",
};

export function buildShellModules(
  entryTypes: PortfolioEntryType[],
): ShellModuleDescriptor[] {
  const modules: ShellModuleDescriptor[] = [
    { id: "overview", labelKey: "shell.overview" },
    { id: "graph", labelKey: "shell.graph" },
  ];

  for (const type of entryTypes) {
    modules.push({
      id: type,
      labelKey: ENTRY_TYPE_LABELS[type],
      entryType: type,
    });
  }

  return modules;
}
