export { Desktop, DesktopShell } from "./Desktop";
export { registerApp, getApp, getAllApps } from "./app-registry";
export { useWindowManager } from "./window-manager/window-manager-context";
export type {
  AppDefinition,
  AppId,
  AppWindowProps,
  WindowBounds,
  WindowId,
  WindowInstance,
  WindowState,
} from "./types";
