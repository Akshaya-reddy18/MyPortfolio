import { useMemo } from "react";
import type {
  PortfolioCollections,
  PortfolioData,
  PortfolioDocument,
  PortfolioMeta,
} from "@/types";
import { usePortfolio } from "./use-portfolio";

export interface UsePortfolioDataResult {
  status: "idle" | "loading" | "loaded" | "error";
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
  error: string | null;
  document: PortfolioDocument | null;
  data: PortfolioData | null;
  collections: PortfolioCollections | null;
  meta: PortfolioMeta | null;
  reload: () => Promise<void>;
}

export function usePortfolioData(): UsePortfolioDataResult {
  const { state, reload } = usePortfolio();

  return useMemo(
    () => ({
      status: state.status,
      isLoading: state.status === "loading",
      isLoaded: state.status === "loaded",
      isError: state.status === "error",
      error: state.error,
      document: state.document,
      data: state.data,
      collections: state.collections,
      meta: state.meta,
      reload,
    }),
    [state, reload],
  );
}
