import type { KnowledgeChunk } from "./knowledge-base";
import { retrieveRelevantChunks } from "./retrieve";

const FALLBACK =
  "I couldn't find relevant portfolio information for that question. Try asking about projects, skills, experience, or contact details.";

function trimContent(content: string, maxLength = 420): string {
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength).trim()}…`;
}

export function composeAssistantResponse(
  chunks: KnowledgeChunk[],
  query: string,
): string {
  const matches = retrieveRelevantChunks(chunks, query);

  if (matches.length === 0) {
    return FALLBACK;
  }

  const intro = matches.length === 1
    ? "Here's what I found in the portfolio data:"
    : `I found ${matches.length} relevant sections in the portfolio data:`;

  const body = matches
    .map(
      (chunk) =>
        `${chunk.section} — ${chunk.title}\n${trimContent(chunk.content)}`,
    )
    .join("\n\n");

  return `${intro}\n\n${body}`;
}

export function buildRetrievalQuery(
  currentQuery: string,
  recentUserMessages: string[],
): string {
  const context = recentUserMessages.slice(-2).join(" ");
  return context ? `${context} ${currentQuery}` : currentQuery;
}
