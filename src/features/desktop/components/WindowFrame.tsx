import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { AKSHAYA_DURATION, AKSHAYA_EASING } from "@/design-system";
import { cn } from "@/lib/utils";
import { useWindowDrag } from "../hooks/use-window-drag";
import type { WindowInstance } from "../types";
import { useWindowManager } from "../window-manager/window-manager-context";

interface WindowFrameProps {
  window: WindowInstance;
  variant: "floating" | "application";
}

export function WindowFrame({ window, variant }: WindowFrameProps) {
  const {
    focusedWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    exitApplicationMode,
    getApp,
  } = useWindowManager();

  const isApplication = variant === "application";
  const isFocused = focusedWindowId === window.id;
  const isMaximized = window.state === "maximized" || isApplication;
  const app = getApp(window.appId);
  const AppComponent = app?.component;
  const themeClass = app?.themeClass;

  const dragEnabled = !isApplication && window.state === "normal";
  const { onTitlebarPointerDown, onTitlebarPointerMove, onTitlebarPointerUp } =
    useWindowDrag(window.id, dragEnabled);

  const handleTitlebarDoubleClick = () => {
    if (window.state === "minimized" || isApplication) return;
    toggleMaximize(window.id);
  };

  return (
    <motion.div
      role="dialog"
      aria-label={window.title}
      aria-modal={isApplication}
      data-window-id={window.id}
      data-focused={isFocused}
      data-launch-mode={window.launchMode}
      layout={false}
      initial={
        isApplication
          ? undefined
          : { opacity: 0, scale: 0.96, y: 8 }
      }
      animate={
        isApplication
          ? undefined
          : { opacity: 1, scale: 1, y: 0 }
      }
      exit={isApplication ? undefined : { opacity: 0, scale: 0.95, y: 4 }}
      transition={{
        duration: AKSHAYA_DURATION.normal / 1000,
        ease: AKSHAYA_EASING.out,
      }}
      className={cn(
        "akshaya-window flex flex-col",
        isApplication
          ? "akshaya-window--application h-full w-full"
          : "akshaya-window--managed akshaya-window--floating absolute",
        isFocused ? "akshaya-window--active" : "akshaya-window--inactive",
        isMaximized && !isApplication && "akshaya-window--maximized",
      )}
      style={
        isApplication
          ? undefined
          : {
              left: window.bounds.x,
              top: window.bounds.y,
              width: window.bounds.width,
              height: window.bounds.height,
              zIndex: window.zIndex,
            }
      }
      onPointerDown={(e) => {
        e.stopPropagation();
        focusWindow(window.id);
      }}
    >
      <div
        className={cn(
          "akshaya-window__titlebar",
          dragEnabled && "akshaya-window__titlebar--draggable",
          isApplication && "akshaya-window__titlebar--application",
        )}
        onPointerDown={onTitlebarPointerDown}
        onPointerMove={onTitlebarPointerMove}
        onPointerUp={onTitlebarPointerUp}
        onPointerCancel={onTitlebarPointerUp}
        onDoubleClick={handleTitlebarDoubleClick}
      >
        {isApplication ? (
          <button
            type="button"
            className="akshaya-window__back-btn akshaya-focus-ring"
            onClick={exitApplicationMode}
            aria-label="Back to neural desktop"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            <span>Desktop</span>
          </button>
        ) : (
          <div className="akshaya-window__traffic">
            <button
              type="button"
              className="akshaya-window__traffic-btn akshaya-window__traffic-dot akshaya-window__traffic-dot--close"
              aria-label={`Close ${window.title}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => closeWindow(window.id)}
            />
            <button
              type="button"
              className="akshaya-window__traffic-btn akshaya-window__traffic-dot akshaya-window__traffic-dot--minimize"
              aria-label={`Minimize ${window.title}`}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => minimizeWindow(window.id)}
            />
            <button
              type="button"
              className="akshaya-window__traffic-btn akshaya-window__traffic-dot akshaya-window__traffic-dot--maximize"
              aria-label={
                isMaximized ? `Restore ${window.title}` : `Maximize ${window.title}`
              }
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => {
                if (isMaximized) {
                  restoreWindow(window.id);
                } else {
                  toggleMaximize(window.id);
                }
              }}
            />
          </div>
        )}

        <span
          className={cn(
            "akshaya-window__title",
            isFocused && "akshaya-window__title--active",
            isApplication && "akshaya-window__title--application",
          )}
        >
          {window.title}
        </span>

        {isApplication ? (
          <button
            type="button"
            className="akshaya-window__close-btn akshaya-focus-ring"
            onClick={() => closeWindow(window.id)}
            aria-label={`Close ${window.title}`}
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-[3.25rem] shrink-0" aria-hidden />
        )}
      </div>

      <div
        className={cn(
          "akshaya-window__body akshaya-window__body--flush min-h-0 flex-1 overflow-auto",
          themeClass,
          isApplication && "akshaya-window__body--application",
        )}
      >
        {AppComponent ? (
          <AppComponent windowId={window.id} appId={window.appId} />
        ) : (
          <p className="p-4 akshaya-type-body-sm text-error">
            Application not registered: {window.appId}
          </p>
        )}
      </div>
    </motion.div>
  );
}
