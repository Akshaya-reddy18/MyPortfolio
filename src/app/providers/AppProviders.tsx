import type { ReactNode } from "react";
import { PortfolioProvider } from "./PortfolioProvider";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Root provider composition. Add theme, motion, or flow providers here in UI phase.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <PortfolioProvider autoLoad>{children}</PortfolioProvider>;
}
