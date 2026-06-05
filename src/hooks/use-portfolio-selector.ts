import { useMemo } from "react";
import type { PortfolioData } from "@/types";
import { usePortfolioData } from "./use-portfolio-data";

/**
 * Run pure selector functions against loaded portfolio data.
 * Returns `fallback` while data is not yet loaded.
 */
export function usePortfolioSelector<T>(
  selector: (data: PortfolioData) => T,
  fallback: T,
): T {
  const { data } = usePortfolioData();

  return useMemo(() => {
    if (!data) return fallback;
    return selector(data);
  }, [data, selector, fallback]);
}
