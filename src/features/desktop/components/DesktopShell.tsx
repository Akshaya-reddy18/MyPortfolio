import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useEffect } from "react";
import { AKSHAYA_DURATION, AKSHAYA_EASING } from "@/design-system";
import { FloatingAssistant } from "@/features/assistant/FloatingAssistant";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { useIsMobile } from "@/hooks/use-media-query";
import { getApp } from "../app-registry";
import { useViewportSize } from "../hooks/use-viewport-size";
import { useWindowManager } from "../window-manager/window-manager-context";
import { WindowManagerProvider } from "../window-manager/window-manager-context";
import { DesktopSurface } from "./DesktopSurface";
import { MobileShell } from "./MobileShell";
import { Taskbar } from "./Taskbar";
import "../desktop-shell.css";
import "@/features/apps/apps.css";
import "@/features/apps/app-themes.css";

function DesktopTopbar() {
  const { document } = usePortfolioData();
  const { openAppFromDock } = useWindowManager();
  const profile = document?.neuralCore.profile;
  if (!profile) return null;

  const { name, role, status, avatar } = profile;
  const avatarSrc = avatar.src;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat) return;
      if (event.key.toLowerCase() !== "t") return;

      const target = event.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName.toLowerCase();
        const isEditable =
          tag === "input" ||
          tag === "textarea" ||
          (target as HTMLElement).isContentEditable;
        if (isEditable) return;
      }

      event.preventDefault();
      openAppFromDock("terminal");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openAppFromDock]);

  return (
    <header className="akshaya-desktop-topbar">
      <div className="akshaya-desktop-topbar__brand">
        <div className="akshaya-desktop-topbar__profile-capsule">
          <div
            className="akshaya-desktop-topbar__avatar"
            style={{ backgroundImage: `url("${avatarSrc}")` }}
            role="img"
            aria-label={avatar.alt}
          />
          <div className="akshaya-desktop-topbar__meta">
            <p className="akshaya-desktop-topbar__name">{name}</p>
            <p className="akshaya-desktop-topbar__role">{role}</p>
          </div>
        </div>
      </div>

      <div className="akshaya-desktop-topbar__actions">
        {status && (
          <span
            className={`akshaya-desktop-topbar__status akshaya-desktop-topbar__status--${status.state}`}
          >
            <span className="akshaya-desktop-topbar__status-dot" aria-hidden />
            {status.label}
          </span>
        )}

        <button
          type="button"
          className="akshaya-desktop-topbar__terminal akshaya-focus-ring"
          onClick={() => openAppFromDock("terminal")}
          aria-label="Open Terminal (T)"
          title="Terminal"
        >
          <Terminal className="h-3.5 w-3.5" strokeWidth={2} />
          <span>Terminal</span>
          <kbd className="akshaya-desktop-topbar__kbd">T</kbd>
        </button>
      </div>
    </header>
  );
}

function DesktopShellInner() {
  useDocumentTitle();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <MobileShell />
        <FloatingAssistant />
      </>
    );
  }

  return (
    <div className="akshaya-desktop-shell">
      <div className="pointer-events-none absolute inset-0 akshaya-os-grid opacity-[0.08]" />

      <DesktopTopbar />
      <DesktopSurface />
      <Taskbar />
      <FloatingAssistant />
    </div>
  );
}

export function DesktopShell() {
  const viewport = useViewportSize();

  return (
    <motion.div
      className="fixed inset-0 overflow-hidden bg-void"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: AKSHAYA_DURATION.slow / 1000,
        ease: AKSHAYA_EASING.out,
      }}
    >
      <WindowManagerProvider getApp={getApp} viewport={viewport}>
        <DesktopShellInner />
      </WindowManagerProvider>
    </motion.div>
  );
}
