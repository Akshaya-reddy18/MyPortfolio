import { SystemClock } from "./SystemClock";
import { cn } from "@/lib/utils";
import { getAllApps } from "../app-registry";
import type { WindowInstance } from "../types";
import { useWindowManager } from "../window-manager/window-manager-context";

function TaskbarWindowButton({ window }: { window: WindowInstance }) {
  const { focusedWindowId, focusWindow, restoreWindow, minimizeWindow, getApp } =
    useWindowManager();
  const app = getApp(window.appId);
  const Icon = app?.icon;
  const isMinimized = window.state === "minimized";
  const isActive = focusedWindowId === window.id && !isMinimized;

  const handleClick = () => {
    if (isMinimized) {
      restoreWindow(window.id);
    } else if (isActive) {
      minimizeWindow(window.id);
    } else {
      focusWindow(window.id);
    }
  };

  if (window.launchMode === "dock") return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "akshaya-taskbar__window-btn akshaya-focus-ring",
        isActive && "akshaya-taskbar__window-btn--active",
        isMinimized && "akshaya-taskbar__window-btn--minimized",
      )}
      aria-label={`${window.title}${isMinimized ? " (minimized)" : ""}`}
      aria-pressed={isActive}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={1.75} />}
      <span className="truncate max-w-[8rem]">{window.title}</span>
    </button>
  );
}

export function Taskbar() {
  const {
    windows,
    openAppFromDock,
    focusedWindowId,
    desktopMode,
    exitApplicationMode,
  } = useWindowManager();

  const dockApps = getAllApps().filter((app) => app.showInDock !== false);
  const floatingWindows = windows.filter((w) => w.launchMode === "neural");
  const applicationWindow = windows.find(
    (w) => w.launchMode === "dock" && w.state !== "minimized",
  );

  const sortedWindows = [...floatingWindows].sort((a, b) => {
    if (a.id === focusedWindowId) return 1;
    if (b.id === focusedWindowId) return -1;
    return a.title.localeCompare(b.title);
  });

  return (
    <footer className="akshaya-taskbar" role="toolbar" aria-label="Taskbar">
      <div className="akshaya-taskbar__section akshaya-taskbar__section--start">
        <nav className="akshaya-taskbar__dock" aria-label="Launch applications">
          {dockApps.map((app) => {
            const Icon = app.icon;
            const isRunning =
              applicationWindow?.appId === app.id ||
              windows.some((w) => w.appId === app.id && w.state !== "minimized");
            const isActiveApp = applicationWindow?.appId === app.id;

            return (
              <button
                key={app.id}
                type="button"
                className={cn(
                  "akshaya-taskbar__app-btn akshaya-focus-ring",
                  isRunning && "akshaya-taskbar__app-btn--running",
                  isActiveApp && "akshaya-taskbar__app-btn--active",
                )}
                onClick={() => {
                  if (isActiveApp && desktopMode === "application") {
                    exitApplicationMode();
                    return;
                  }
                  openAppFromDock(app.id);
                }}
                aria-label={`Open ${app.title}`}
                title={app.title}
              >
                <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.75} />
                <span className="akshaya-taskbar__app-tooltip">{app.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="akshaya-taskbar__section akshaya-taskbar__section--center">
        <div className="flex max-w-full items-center gap-1.5 overflow-x-auto px-1">
          {sortedWindows.length === 0 ? (
            <span className="akshaya-type-caption px-2 text-muted-foreground">
              {desktopMode === "application"
                ? "Application mode"
                : "Neural desktop"}
            </span>
          ) : (
            sortedWindows.map((win) => (
              <TaskbarWindowButton key={win.id} window={win} />
            ))
          )}
        </div>
      </div>

      <div className="akshaya-taskbar__section akshaya-taskbar__section--end">
        <SystemClock />
      </div>
    </footer>
  );
}
