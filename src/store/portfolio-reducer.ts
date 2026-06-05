import type { PortfolioAction, PortfolioState } from "@/types";

export const initialPortfolioState: PortfolioState = {
  status: "idle",
  document: null,
  data: null,
  collections: null,
  meta: null,
  error: null,
};

export function portfolioReducer(
  state: PortfolioState,
  action: PortfolioAction,
): PortfolioState {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        status: "loading",
        error: null,
      };
    case "LOAD_SUCCESS":
      return {
        status: "loaded",
        document: action.payload.document,
        data: action.payload.data,
        collections: action.payload.collections,
        meta: action.payload.meta,
        error: null,
      };
    case "LOAD_ERROR":
      return {
        ...state,
        status: "error",
        error: action.payload.error,
      };
    case "RESET":
      return initialPortfolioState;
    default:
      return state;
  }
}
