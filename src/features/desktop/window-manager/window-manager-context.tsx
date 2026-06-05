import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type {
  AppDefinition,
  AppId,
  DesktopMode,
  LaunchMode,
  WindowBounds,
  WindowInstance,
} from "../types";
import { DEFAULT_INSETS, getWorkAreaSize } from "./geometry";
import {
  initialWindowManagerState,
  windowManagerReducer,
} from "./window-manager-reducer";

interface WindowManagerContextValue {
  windows: WindowInstance[];
  focusedWindowId: string | null;
  workArea: { width: number; height: number };
  desktopMode: DesktopMode;
  openApp: (appId: AppId, launchMode?: LaunchMode) => void;
  openAppFromDock: (appId: AppId) => void;
  openAppFromNeural: (appId: AppId) => void;
  exitApplicationMode: () => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  toggleMaximize: (windowId: string) => void;
  moveWindow: (windowId: string, bounds: WindowBounds) => void;
  blurDesktop: () => void;
  getApp: (appId: AppId) => AppDefinition | undefined;
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(
  null,
);

interface WindowManagerProviderProps {
  children: ReactNode;
  getApp: (appId: AppId) => AppDefinition | undefined;
  viewport: { width: number; height: number };
}

export function WindowManagerProvider({
  children,
  getApp,
  viewport,
}: WindowManagerProviderProps) {
  const [state, dispatch] = useReducer(
    windowManagerReducer,
    initialWindowManagerState,
  );

  const workArea = useMemo(
    () => getWorkAreaSize(viewport, DEFAULT_INSETS),
    [viewport.width, viewport.height],
  );

  const openApp = useCallback(
    (appId: AppId, launchMode: LaunchMode = "dock") => {
      const app = getApp(appId);
      if (!app) return;
      dispatch({ type: "OPEN_APP", app, workArea, launchMode });
    },
    [getApp, workArea],
  );

  const openAppFromDock = useCallback(
    (appId: AppId) => openApp(appId, "dock"),
    [openApp],
  );

  const openAppFromNeural = useCallback(
    (appId: AppId) => openApp(appId, "neural"),
    [openApp],
  );

  const exitApplicationMode = useCallback(() => {
    dispatch({ type: "EXIT_APPLICATION_MODE" });
  }, []);

  const closeWindow = useCallback((windowId: string) => {
    dispatch({ type: "CLOSE_WINDOW", windowId });
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    dispatch({ type: "FOCUS_WINDOW", windowId });
  }, []);

  const minimizeWindow = useCallback((windowId: string) => {
    dispatch({ type: "MINIMIZE_WINDOW", windowId });
  }, []);

  const restoreWindow = useCallback((windowId: string) => {
    dispatch({ type: "RESTORE_WINDOW", windowId });
  }, []);

  const toggleMaximize = useCallback(
    (windowId: string) => {
      dispatch({ type: "TOGGLE_MAXIMIZE", windowId, workArea });
    },
    [workArea],
  );

  const moveWindow = useCallback(
    (windowId: string, bounds: WindowBounds) => {
      dispatch({ type: "MOVE_WINDOW", windowId, bounds, workArea });
    },
    [workArea],
  );

  const blurDesktop = useCallback(() => {
    dispatch({ type: "BLUR_FOCUS" });
  }, []);

  useEffect(() => {
    dispatch({ type: "SYNC_WORKAREA", workArea });
  }, [workArea.width, workArea.height]);

  const value = useMemo(
    () => ({
      windows: state.windows,
      focusedWindowId: state.focusedWindowId,
      workArea,
      desktopMode: state.desktopMode,
      openApp,
      openAppFromDock,
      openAppFromNeural,
      exitApplicationMode,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      moveWindow,
      blurDesktop,
      getApp,
    }),
    [
      state.windows,
      state.focusedWindowId,
      state.desktopMode,
      workArea,
      openApp,
      openAppFromDock,
      openAppFromNeural,
      exitApplicationMode,
      closeWindow,
      focusWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      moveWindow,
      blurDesktop,
      getApp,
    ],
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext);
  if (!ctx) {
    throw new Error("useWindowManager must be used within WindowManagerProvider");
  }
  return ctx;
}
