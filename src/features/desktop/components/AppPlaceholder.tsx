import type { AppWindowProps } from "../types";

/**
 * Placeholder mount point for future applications.
 * Not a real app — demonstrates window infrastructure only.
 */
export function AppPlaceholder({ appId, windowId }: AppWindowProps) {
  return (
    <div className="flex h-full min-h-[12rem] flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="akshaya-type-label text-cyan-400/80">Application Mount</p>
      <p className="akshaya-type-mono-sm text-muted-foreground">
        appId: <span className="text-foreground/80">{appId}</span>
      </p>
      <p className="akshaya-type-mono-sm text-muted-foreground">
        windowId: <span className="text-foreground/80">{windowId}</span>
      </p>
      <p className="akshaya-type-body-sm max-w-xs">
        Replace this component via the app registry when building real applications.
      </p>
    </div>
  );
}
