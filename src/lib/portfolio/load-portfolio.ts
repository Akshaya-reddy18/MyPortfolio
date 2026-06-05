import {
  PORTFOLIO_DATA_URL,
  PORTFOLIO_FETCH_OPTIONS,
} from "@/config/portfolio.config";
import type {
  PortfolioCollections,
  PortfolioData,
  PortfolioDocument,
  PortfolioMeta,
} from "@/types";
import { buildPortfolioMeta, partitionPortfolioData } from "./selectors";
import { isPortfolioData } from "./type-guards";
import { parseRawPortfolioJson } from "./parse-document";

export class PortfolioLoadError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "PortfolioLoadError";
  }
}

export interface LoadedPortfolio {
  document: PortfolioDocument;
  /** @deprecated Use `document.entries`. Kept for existing hooks. */
  data: PortfolioData;
  collections: PortfolioCollections;
  meta: PortfolioMeta;
  format: "v1-array" | "v2-document";
  migratedFromV1: boolean;
}

export function normalizePortfolioData(raw: unknown): LoadedPortfolio {
  let parsed;

  try {
    parsed = parseRawPortfolioJson(raw);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse portfolio JSON";
    throw new PortfolioLoadError(message, error);
  }

  const { document, format, migratedFromV1 } = parsed;
  const data = document.entries;

  if (!isPortfolioData(data)) {
    throw new PortfolioLoadError("Portfolio entries failed validation");
  }

  const collections = partitionPortfolioData(data);
  const meta = buildPortfolioMeta(data);

  return {
    document,
    data,
    collections,
    meta,
    format,
    migratedFromV1,
  };
}

export async function fetchPortfolioData(
  url: string = PORTFOLIO_DATA_URL,
  init: RequestInit = PORTFOLIO_FETCH_OPTIONS,
): Promise<LoadedPortfolio> {
  let response: Response;

  try {
    response = await fetch(url, init);
  } catch (error) {
    throw new PortfolioLoadError(
      `Failed to fetch portfolio data from ${url}`,
      error,
    );
  }

  if (!response.ok) {
    throw new PortfolioLoadError(
      `Portfolio fetch failed (${response.status} ${response.statusText})`,
    );
  }

  let raw: unknown;
  try {
    raw = await response.json();
  } catch (error) {
    throw new PortfolioLoadError("portfolio_data.json is not valid JSON", error);
  }

  return normalizePortfolioData(raw);
}
