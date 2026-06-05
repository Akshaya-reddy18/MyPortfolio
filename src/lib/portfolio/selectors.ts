import type {
  AchievementEntry,
  EducationEntry,
  ExperienceEntry,
  PortfolioCollections,
  PortfolioData,
  PortfolioEntry,
  PortfolioEntryType,
  PortfolioMeta,
  ProjectEntry,
  SkillEntry,
} from "@/types";
import {
  isAchievementEntry,
  isEducationEntry,
  isExperienceEntry,
  isProjectEntry,
  isSkillEntry,
} from "./type-guards";

export function partitionPortfolioData(
  data: PortfolioData,
): PortfolioCollections {
  const collections: PortfolioCollections = {
    projects: [],
    experiences: [],
    skills: [],
    achievements: [],
    education: [],
  };

  for (const entry of data) {
    if (isProjectEntry(entry)) collections.projects.push(entry);
    else if (isExperienceEntry(entry)) collections.experiences.push(entry);
    else if (isSkillEntry(entry)) collections.skills.push(entry);
    else if (isAchievementEntry(entry)) collections.achievements.push(entry);
    else if (isEducationEntry(entry)) collections.education.push(entry);
  }

  return collections;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function buildPortfolioMeta(data: PortfolioData): PortfolioMeta {
  const collections = partitionPortfolioData(data);
  const counts = data.reduce(
    (acc, entry) => {
      acc[entry.type] += 1;
      return acc;
    },
    {
      project: 0,
      experience: 0,
      skill: 0,
      achievement: 0,
      education: 0,
    } satisfies Record<PortfolioEntryType, number>,
  );

  return {
    totalEntries: data.length,
    counts,
    projectCategories: uniqueSorted(
      collections.projects.map((p) => p.category),
    ),
    allTags: uniqueSorted(collections.projects.flatMap((p) => p.tags)),
    allStack: uniqueSorted(collections.projects.flatMap((p) => p.stack)),
  };
}

export function getEntriesByType<T extends PortfolioEntryType>(
  data: PortfolioData,
  type: T,
): Extract<PortfolioEntry, { type: T }>[] {
  return data.filter(
    (entry): entry is Extract<PortfolioEntry, { type: T }> =>
      entry.type === type,
  );
}

export function getProjects(data: PortfolioData): ProjectEntry[] {
  return getEntriesByType(data, "project");
}

export function getExperiences(data: PortfolioData): ExperienceEntry[] {
  return getEntriesByType(data, "experience");
}

export function getSkills(data: PortfolioData): SkillEntry[] {
  return getEntriesByType(data, "skill");
}

export function getAchievements(data: PortfolioData): AchievementEntry[] {
  return getEntriesByType(data, "achievement");
}

export function getEducation(data: PortfolioData): EducationEntry[] {
  return getEntriesByType(data, "education");
}

export function getProjectByTitle(
  data: PortfolioData,
  title: string,
): ProjectEntry | undefined {
  return getProjects(data).find((p) => p.title === title);
}

export function getProjectsByCategory(
  data: PortfolioData,
  category: string,
): ProjectEntry[] {
  return getProjects(data).filter((p) => p.category === category);
}

export function getProjectsByTag(data: PortfolioData, tag: string): ProjectEntry[] {
  return getProjects(data).filter((p) => p.tags.includes(tag));
}

export function getEntryById(
  data: PortfolioData,
  id: string,
): PortfolioEntry | undefined {
  return data.find((_, index) => String(index) === id);
}
