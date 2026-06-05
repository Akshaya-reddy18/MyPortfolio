import { createContext, type Dispatch } from "react";
import type { PortfolioAction, PortfolioState } from "@/types";
import { initialPortfolioState } from "./portfolio-reducer";

export interface PortfolioContextValue {
  state: PortfolioState;
  dispatch: Dispatch<PortfolioAction>;
  reload: () => Promise<void>;
}

export const PortfolioContext = createContext<PortfolioContextValue | null>(
  null,
);

export const portfolioContextDefault: PortfolioContextValue = {
  state: initialPortfolioState,
  dispatch: () => {
    throw new Error("PortfolioProvider is required");
  },
  reload: async () => {
    throw new Error("PortfolioProvider is required");
  },
};
