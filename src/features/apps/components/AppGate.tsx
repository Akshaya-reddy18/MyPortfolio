import type { ReactNode } from "react";
import { usePortfolioData } from "@/hooks/use-portfolio-data";

interface AppGateProps {
  children: (data: NonNullable<ReturnType<typeof usePortfolioData>["document"]>) => ReactNode;
}

export function AppLoading() {
  return (
    <div className="app-state" aria-busy>
      <div className="app-state__spinner" />
      <p className="akshaya-type-mono-sm">Loading portfolio data…</p>
    </div>
  );
}

export function AppError({ message }: { message: string }) {
  return (
    <div className="app-state app-state--error" role="alert">
      <p className="akshaya-type-body-sm text-error">{message}</p>
    </div>
  );
}

export function AppGate({ children }: AppGateProps) {
  const { document, isLoading, isError, error } = usePortfolioData();

  if (isLoading) return <AppLoading />;
  if (isError || !document) {
    return <AppError message={error ?? "Portfolio data unavailable."} />;
  }

  return <>{children(document)}</>;
}

export function AppGateWithCollections({
  children,
}: {
  children: (props: {
    document: NonNullable<ReturnType<typeof usePortfolioData>["document"]>;
    collections: NonNullable<ReturnType<typeof usePortfolioData>["collections"]>;
  }) => ReactNode;
}) {
  const { document, collections, isLoading, isError, error } = usePortfolioData();

  if (isLoading) return <AppLoading />;
  if (isError || !document || !collections) {
    return <AppError message={error ?? "Portfolio data unavailable."} />;
  }

  return <>{children({ document, collections })}</>;
}
