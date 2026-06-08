import { useEffect } from "react";
import { usePortfolioData } from "./use-portfolio-data";

export function useDocumentTitle(suffix = "AKSHAYA OS") {
  const { document: portfolio } = usePortfolioData();

  useEffect(() => {
    const name = portfolio?.neuralCore.profile.name;
    window.document.title = name ? `${name} · ${suffix}` : suffix;
  }, [portfolio?.neuralCore.profile.name, suffix]);
}
