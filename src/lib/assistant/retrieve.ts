import type { KnowledgeChunk } from "./knowledge-base";
import { tokenize } from "./knowledge-base";

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "my",
  "me",
  "i",
  "you",
  "your",
  "what",
  "which",
  "who",
  "how",
  "when",
  "where",
  "why",
  "about",
  "with",
  "from",
  "that",
  "this",
  "these",
  "those",
  "can",
  "tell",
  "show",
  "give",
  "list",
  "summarize",
  "describe",
]);

function queryTokens(query: string): string[] {
  return tokenize(query).filter((token) => !STOP_WORDS.has(token));
}

function scoreChunk(chunk: KnowledgeChunk, tokens: string[], query: string): number {
  if (tokens.length === 0) return 0;

  const normalizedQuery = query.toLowerCase();
  const haystack = `${chunk.title} ${chunk.content} ${chunk.keywords.join(" ")}`.toLowerCase();
  let score = 0;

  if (haystack.includes(normalizedQuery)) {
    score += 12;
  }

  for (const token of tokens) {
    if (chunk.title.toLowerCase().includes(token)) score += 4;
    if (chunk.section.toLowerCase().includes(token)) score += 2;
    if (chunk.keywords.some((keyword) => keyword.includes(token))) score += 3;

    const matches = haystack.split(token).length - 1;
    score += matches;
  }

  return score;
}

export function retrieveRelevantChunks(
  chunks: KnowledgeChunk[],
  query: string,
  limit = 4,
): KnowledgeChunk[] {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];

  return [...chunks]
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, tokens, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ chunk }) => chunk);
}
