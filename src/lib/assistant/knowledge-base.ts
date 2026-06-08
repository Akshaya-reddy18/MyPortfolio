import type {
  PortfolioDocument,
  PortfolioEntry,
} from "@/types";
import type { AssistantContext } from "@/types/portfolio-document";

export interface KnowledgeChunk {
  id: string;
  section: string;
  title: string;
  content: string;
  keywords: string[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((token) => token.length > 1);
}

function chunk(
  id: string,
  section: string,
  title: string,
  content: string,
  extraKeywords: string[] = [],
): KnowledgeChunk {
  const keywords = [...new Set([...tokenize(title), ...tokenize(content), ...extraKeywords])];
  return { id, section, title, content, keywords };
}

function entryToChunk(entry: PortfolioEntry, index: number): KnowledgeChunk {
  switch (entry.type) {
    case "project":
      return chunk(
        `project-${index}`,
        "Projects",
        entry.title,
        [
          entry.description,
          entry.impact,
          entry.details,
          entry.challenges,
          entry.solutions,
          entry.category,
          entry.tags.join(", "),
          entry.stack.join(", "),
        ]
          .filter(Boolean)
          .join("\n"),
        [...entry.tags, ...entry.stack, entry.category],
      );
    case "experience":
      return chunk(
        `experience-${index}`,
        "Experience",
        `${entry.title} @ ${entry.company}`,
        `${entry.duration}\n${entry.details}`,
        [entry.company, entry.title],
      );
    case "skill":
      return chunk(
        `skill-${index}`,
        "Skills",
        entry.name,
        entry.details,
        entry.details.split(",").map((s) => s.trim()),
      );
    case "achievement":
      return chunk(
        `achievement-${index}`,
        "Achievements",
        entry.title,
        entry.details,
      );
    case "education":
      return chunk(
        `education-${index}`,
        "Education",
        "Education",
        entry.details,
      );
    default:
      return chunk(`entry-${index}`, "Portfolio", "Entry", "");
  }
}

export function buildKnowledgeBase(
  document: PortfolioDocument,
  context: AssistantContext,
): KnowledgeChunk[] {
  const { profile, currentFocus } = document.neuralCore;
  const chunks: KnowledgeChunk[] = [
    chunk(
      "profile",
      "Profile",
      profile.name,
      [
        profile.role,
        profile.headline,
        profile.tagline,
        profile.bio,
        profile.location,
        profile.timezone,
      ].join("\n"),
      [profile.role, profile.location],
    ),
    chunk(
      "focus",
      "Current Focus",
      currentFocus.title,
      [
        currentFocus.summary,
        ...currentFocus.items.map(
          (item) => `${item.label}: ${item.detail}`,
        ),
      ].join("\n"),
    ),
    chunk(
      "contact",
      "Contact",
      "Contact Information",
      [
        document.contact.email ? `Email: ${document.contact.email}` : "",
        document.contact.phone ? `Phone: ${document.contact.phone}` : "",
        `Availability: ${document.contact.availability}`,
        `Response time: ${document.contact.responseTime}`,
        `Preferred channels: ${document.contact.preferredChannels.join(", ")}`,
        ...document.social.map(
          (link) => `${link.platform}: ${link.url}${link.handle ? ` (${link.handle})` : ""}`,
        ),
      ]
        .filter(Boolean)
        .join("\n"),
      document.social.map((link) => link.platform),
    ),
  ];

  const allowed = new Set(context.includeSections);

  for (const section of context.includeSections) {
    const sectionEntries = document.entries
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry }) => entry.type === section && allowed.has(entry.type))
      .slice(0, context.maxEntriesPerSection);

    for (const { entry, index } of sectionEntries) {
      chunks.push(entryToChunk(entry, index));
    }
  }

  return chunks;
}

export { tokenize };
