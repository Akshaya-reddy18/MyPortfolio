/**
 * Single source of truth URL for portfolio_data.json.
 * File is served from /public at build time; keep public/ in sync with project root.
 */
export const PORTFOLIO_DATA_URL = "/portfolio_data.json";

export const PORTFOLIO_FETCH_OPTIONS: RequestInit = {
  headers: { Accept: "application/json" },
  cache: "no-cache",
};
