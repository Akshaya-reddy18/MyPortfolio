import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export type WindowState = "normal" | "minimized" | "maximized";

export type LaunchMode = "dock" | "neural";

export type DesktopMode = "network" | "application";

export type WindowId = string;

export type AppId = string;

export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowInstance {
  id: WindowId;
  appId: AppId;
  title: string;
  state: WindowState;
  bounds: WindowBounds;
  /** Bounds before maximize — used when restoring */
  restoredBounds: WindowBounds | null;
  zIndex: number;
  launchMode: LaunchMode;
}

/** Props passed to every application mounted inside a window */
export interface AppWindowProps {
  windowId: WindowId;
  appId: AppId;
}

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: LucideIcon;
  defaultSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  component: ComponentType<AppWindowProps>;
  singleton?: boolean;
  /** Show in bottom dock (default true) */
  showInDock?: boolean;
  /** Visual theme class applied to app body */
  themeClass?: string;
}

export interface DesktopInsets {
  top: number;
  left: number;
  right: number;
  bottom: number;
}
