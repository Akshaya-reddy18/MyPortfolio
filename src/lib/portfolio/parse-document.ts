import type { PortfolioDataV1, PortfolioDocument } from "@/types";
import { parsePortfolioDocument } from "./document-guards";
import { migrateV1ToV2 } from "./migrate-v1";

export type RawPortfolioFormat = "v1-array" | "v2-document";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function detectRawPortfolioFormat(raw: unknown): RawPortfolioFormat {
  if (Array.isArray(raw)) {
    return "v1-array";
  }

  if (isRecord(raw) && typeof raw.schemaVersion === "string") {
    return "v2-document";
  }

  throw new Error(
    "Unrecognized portfolio JSON: expected a v1 array or v2 document with schemaVersion",
  );
}

export interface ParsePortfolioResult {
  document: PortfolioDocument;
  format: RawPortfolioFormat;
  migratedFromV1: boolean;
}

export function parseRawPortfolioJson(raw: unknown): ParsePortfolioResult {
  const format = detectRawPortfolioFormat(raw);

  if (format === "v1-array") {
    return {
      document: migrateV1ToV2(raw as PortfolioDataV1),
      format,
      migratedFromV1: true,
    };
  }

  return {
    document: parsePortfolioDocument(raw),
    format,
    migratedFromV1: false,
  };
}
