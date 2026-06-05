import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { fetchPortfolioData, PortfolioLoadError } from "@/lib/portfolio";
import {
  initialPortfolioState,
  portfolioReducer,
} from "@/store/portfolio-reducer";
import { PortfolioContext } from "@/store/portfolio-context";

interface PortfolioProviderProps {
  children: ReactNode;
  /** When false, data is not fetched until `reload()` is called */
  autoLoad?: boolean;
}

export function PortfolioProvider({
  children,
  autoLoad = true,
}: PortfolioProviderProps) {
  const [state, dispatch] = useReducer(portfolioReducer, initialPortfolioState);

  const reload = useCallback(async () => {
    dispatch({ type: "LOAD_START" });

    try {
      const loaded = await fetchPortfolioData();
      dispatch({
        type: "LOAD_SUCCESS",
        payload: {
          document: loaded.document,
          data: loaded.data,
          collections: loaded.collections,
          meta: loaded.meta,
        },
      });
    } catch (error) {
      const message =
        error instanceof PortfolioLoadError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unknown error loading portfolio data";

      dispatch({ type: "LOAD_ERROR", payload: { error: message } });
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      void reload();
    }
  }, [autoLoad, reload]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      reload,
    }),
    [state, reload],
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}
