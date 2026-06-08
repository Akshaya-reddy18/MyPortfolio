import {
  PORTFOLIO_ENTRY_TYPES,
  type PortfolioEntry,
  type PortfolioEntryType,
} from "@/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

export function isPortfolioEntryType(
  value: unknown,
): value is PortfolioEntryType {
  return (
    typeof value === "string" &&
    (PORTFOLIO_ENTRY_TYPES as readonly string[]).includes(value)
  );
}

export function isProjectEntry(
  entry: PortfolioEntry,
): entry is Extract<PortfolioEntry, { type: "project" }> {
  return entry.type === "project";
}

export function isExperienceEntry(
  entry: PortfolioEntry,
): entry is Extract<PortfolioEntry, { type: "experience" }> {
  return entry.type === "experience";
}

export function isSkillEntry(
  entry: PortfolioEntry,
): entry is Extract<PortfolioEntry, { type: "skill" }> {
  return entry.type === "skill";
}

export function isAchievementEntry(
  entry: PortfolioEntry,
): entry is Extract<PortfolioEntry, { type: "achievement" }> {
  return entry.type === "achievement";
}

export function isEducationEntry(
  entry: PortfolioEntry,
): entry is Extract<PortfolioEntry, { type: "education" }> {
  return entry.type === "education";
}

function requireString(
  obj: Record<string, unknown>,
  key: string,
  label: string,
): string {
  const value = obj[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label}: missing or invalid "${key}"`);
  }
  return value;
}

function optionalString(
  obj: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = obj[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new Error(`Invalid optional field "${key}"`);
  }
  return value;
}

function parseProject(raw: Record<string, unknown>, index: number): PortfolioEntry {
  const label = `Entry[${index}] (project)`;
  return {
    type: "project",
    title: requireString(raw, "title", label),
    tags: (() => {
      if (!isStringArray(raw.tags)) {
        throw new Error(`${label}: "tags" must be a string array`);
      }
      return raw.tags;
    })(),
    stack: (() => {
      if (!isStringArray(raw.stack)) {
        throw new Error(`${label}: "stack" must be a string array`);
      }
      return raw.stack;
    })(),
    description: requireString(raw, "description", label),
    impact: requireString(raw, "impact", label),
    details: requireString(raw, "details", label),
    category: requireString(raw, "category", label),
    challenges: optionalString(raw, "challenges"),
    solutions: optionalString(raw, "solutions"),
  };
}

function parseRoleProjects(
  raw: unknown,
  label: string,
): import("@/types").ExperienceRoleProject[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw.map((item, i) => {
    if (!isRecord(item)) {
      throw new Error(`${label}.roleProjects[${i}]: expected object`);
    }
    return {
      title: requireString(item, "title", `${label}.roleProjects[${i}]`),
      summary: requireString(item, "summary", `${label}.roleProjects[${i}]`),
      linkedProjectTitle: optionalString(item, "linkedProjectTitle"),
    };
  });
}

function parseExperience(
  raw: Record<string, unknown>,
  index: number,
): PortfolioEntry {
  const label = `Entry[${index}] (experience)`;
  const technologies = raw.technologies;
  const outcomes = raw.outcomes;
  const relatedProjectTitles = raw.relatedProjectTitles;

  return {
    type: "experience",
    title: requireString(raw, "title", label),
    company: requireString(raw, "company", label),
    duration: requireString(raw, "duration", label),
    details: requireString(raw, "details", label),
    technologies: isStringArray(technologies) ? technologies : undefined,
    outcomes: isStringArray(outcomes) ? outcomes : undefined,
    relatedProjectTitles: isStringArray(relatedProjectTitles)
      ? relatedProjectTitles
      : undefined,
    roleProjects: parseRoleProjects(raw.roleProjects, label),
  };
}

function parseSkill(raw: Record<string, unknown>, index: number): PortfolioEntry {
  const label = `Entry[${index}] (skill)`;
  return {
    type: "skill",
    name: requireString(raw, "name", label),
    details: requireString(raw, "details", label),
  };
}

function parseAchievement(
  raw: Record<string, unknown>,
  index: number,
): PortfolioEntry {
  const label = `Entry[${index}] (achievement)`;
  return {
    type: "achievement",
    title: requireString(raw, "title", label),
    details: requireString(raw, "details", label),
  };
}

function parseEducation(
  raw: Record<string, unknown>,
  index: number,
): PortfolioEntry {
  const label = `Entry[${index}] (education)`;
  return {
    type: "education",
    details: requireString(raw, "details", label),
  };
}

export function parsePortfolioEntry(
  raw: unknown,
  index: number,
): PortfolioEntry {
  if (!isRecord(raw)) {
    throw new Error(`Entry[${index}]: expected an object`);
  }

  const type = raw.type;
  if (!isPortfolioEntryType(type)) {
    throw new Error(
      `Entry[${index}]: unknown type "${String(type)}". Expected one of: ${PORTFOLIO_ENTRY_TYPES.join(", ")}`,
    );
  }

  switch (type) {
    case "project":
      return parseProject(raw, index);
    case "experience":
      return parseExperience(raw, index);
    case "skill":
      return parseSkill(raw, index);
    case "achievement":
      return parseAchievement(raw, index);
    case "education":
      return parseEducation(raw, index);
    default: {
      const _exhaustive: never = type;
      throw new Error(`Entry[${index}]: unhandled type ${_exhaustive}`);
    }
  }
}

export function isPortfolioData(value: unknown): value is PortfolioEntry[] {
  if (!Array.isArray(value)) return false;
  try {
    value.forEach((item, index) => {
      parsePortfolioEntry(item, index);
    });
    return true;
  } catch {
    return false;
  }
}
