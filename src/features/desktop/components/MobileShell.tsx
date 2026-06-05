import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AKSHAYA_DURATION, AKSHAYA_EASING } from "@/design-system";
import { getAllApps } from "../app-registry";
import { cn } from "@/lib/utils";
import { useWindowManager } from "../window-manager/window-manager-context";

export function MobileShell() {
  const {
    windows,
    openAppFromDock,
    exitApplicationMode,
    desktopMode,
    getApp,
  } = useWindowManager();

  const dockApps = getAllApps().filter((app) => app.showInDock !== false);
  const activeWindow = windows.find(
    (w) => w.launchMode === "dock" && w.state !== "minimized",
  );
  const isAppOpen = desktopMode === "application" && activeWindow != null;
  const ActiveComponent = activeWindow ? getApp(activeWindow.appId)?.component : null;

  return (
    <div className="mobile-os-shell">
      <div className="mobile-os-shell__ambient" aria-hidden />

      <AnimatePresence mode="wait">
        {isAppOpen && activeWindow && ActiveComponent ? (
          <motion.section
            key={activeWindow.id}
            className="mobile-os-shell__app"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{
              duration: AKSHAYA_DURATION.normal / 1000,
              ease: AKSHAYA_EASING.out,
            }}
          >
            <header className="mobile-os-shell__app-header">
              <button
                type="button"
                className="mobile-os-shell__back"
                onClick={exitApplicationMode}
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Home</span>
              </button>
              <p className="mobile-os-shell__app-title">{activeWindow.title}</p>
              <div className="w-16" aria-hidden />
            </header>
            <div
              className={cn(
                "mobile-os-shell__app-body",
                getApp(activeWindow.appId)?.themeClass,
              )}
            >
              <ActiveComponent
                windowId={activeWindow.id}
                appId={activeWindow.appId}
              />
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="home"
            className="mobile-os-shell__home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mobile-os-shell__hero">
              <div className="mobile-os-shell__hero-avatar" aria-hidden />
              <h1 className="mobile-os-shell__hero-title">Neural OS</h1>
              <p className="mobile-os-shell__hero-subtitle">
                AI portfolio operating system
              </p>
            </div>
            <div className="mobile-os-shell__grid">
              {dockApps.map((app) => {
                const Icon = app.icon;
                return (
                  <button
                    key={app.id}
                    type="button"
                    className="mobile-os-shell__tile"
                    onClick={() => openAppFromDock(app.id)}
                  >
                    <span className="mobile-os-shell__tile-icon">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="mobile-os-shell__tile-label">{app.title}</span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <nav className="mobile-os-shell__nav" aria-label="Mobile navigation">
        {dockApps.slice(0, 5).map((app) => {
          const Icon = app.icon;
          const isActive = activeWindow?.appId === app.id;
          return (
            <button
              key={app.id}
              type="button"
              className={cn(
                "mobile-os-shell__nav-btn",
                isActive && "mobile-os-shell__nav-btn--active",
              )}
              onClick={() => openAppFromDock(app.id)}
              aria-label={app.title}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              <span>{app.title}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
