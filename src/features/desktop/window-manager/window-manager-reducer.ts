import type { AppDefinition, DesktopMode, LaunchMode } from "../types";
import type { WindowBounds, WindowInstance, WindowState } from "../types";
import {
  clampBounds,
  getCascadePosition,
  getMaximizedBounds,
} from "./geometry";

export interface WindowManagerState {
  windows: WindowInstance[];
  focusedWindowId: string | null;
  nextZIndex: number;
  desktopMode: DesktopMode;
}

export type WindowManagerAction =
  | {
      type: "OPEN_APP";
      app: AppDefinition;
      workArea: { width: number; height: number };
      launchMode: LaunchMode;
    }
  | { type: "CLOSE_WINDOW"; windowId: string }
  | { type: "FOCUS_WINDOW"; windowId: string }
  | { type: "MINIMIZE_WINDOW"; windowId: string }
  | { type: "RESTORE_WINDOW"; windowId: string }
  | { type: "TOGGLE_MAXIMIZE"; windowId: string; workArea: { width: number; height: number } }
  | {
      type: "MOVE_WINDOW";
      windowId: string;
      bounds: WindowBounds;
      workArea: { width: number; height: number };
    }
  | { type: "BLUR_FOCUS" }
  | { type: "EXIT_APPLICATION_MODE" }
  | { type: "SYNC_WORKAREA"; workArea: { width: number; height: number } };

function createWindowId(): string {
  return `win-${crypto.randomUUID()}`;
}

function focusWindow(
  state: WindowManagerState,
  windowId: string,
): WindowManagerState {
  const nextZ = state.nextZIndex + 1;
  return {
    ...state,
    focusedWindowId: windowId,
    nextZIndex: nextZ,
    windows: state.windows.map((w) =>
      w.id === windowId ? { ...w, zIndex: nextZ } : w,
    ),
  };
}

function openDockApp(
  state: WindowManagerState,
  app: AppDefinition,
  workArea: { width: number; height: number },
): WindowManagerState {
  const maximized = getMaximizedBounds(workArea);
  const zIndex = state.nextZIndex + 1;

  if (app.singleton !== false) {
    const existing = state.windows.find((w) => w.appId === app.id);
    if (existing) {
      const nextWindows = state.windows.map((w) =>
        w.id === existing.id
          ? {
              ...w,
              state: "maximized" as WindowState,
              launchMode: "dock" as LaunchMode,
              bounds: maximized,
              restoredBounds: w.state === "maximized" ? w.restoredBounds : w.bounds,
              zIndex,
            }
          : w,
      );

      return focusWindow(
        {
          ...state,
          windows: nextWindows,
          desktopMode: "application",
          nextZIndex: zIndex,
        },
        existing.id,
      );
    }
  }

  const nextWindows = state.windows.filter((w) => w.launchMode !== "dock");

  const window: WindowInstance = {
    id: createWindowId(),
    appId: app.id,
    title: app.title,
    state: "maximized",
    bounds: maximized,
    restoredBounds: null,
    zIndex,
    launchMode: "dock",
  };

  return {
    windows: [...nextWindows, window],
    focusedWindowId: window.id,
    nextZIndex: zIndex,
    desktopMode: "application",
  };
}

function openNeuralApp(
  state: WindowManagerState,
  app: AppDefinition,
  workArea: { width: number; height: number },
): WindowManagerState {
  if (app.singleton !== false) {
    const existing = state.windows.find((w) => w.appId === app.id);
    if (existing) {
      const position = getCascadePosition(workArea, app.defaultSize);
      const bounds = clampBounds(
        {
          x: position.x,
          y: position.y,
          width: app.defaultSize.width,
          height: app.defaultSize.height,
        },
        workArea,
      );

      let nextWindows = state.windows.map((w) => {
        if (w.id !== existing.id) return w;
        if (w.state === "minimized") {
          return {
            ...w,
            state: "normal" as WindowState,
            launchMode: "neural" as LaunchMode,
            bounds,
            restoredBounds: null,
          };
        }
        return {
          ...w,
          state: "normal" as WindowState,
          launchMode: "neural" as LaunchMode,
          bounds: w.launchMode === "dock" ? bounds : w.bounds,
          restoredBounds: null,
        };
      });

      if (state.desktopMode === "application") {
        nextWindows = nextWindows.filter(
          (w) => !(w.launchMode === "dock" && w.id !== existing.id),
        );
      }

      return focusWindow(
        {
          ...state,
          windows: nextWindows,
          desktopMode: "network",
        },
        existing.id,
      );
    }
  }

  const position = getCascadePosition(workArea, app.defaultSize);
  const bounds = clampBounds(
    {
      x: position.x,
      y: position.y,
      width: app.defaultSize.width,
      height: app.defaultSize.height,
    },
    workArea,
  );

  const zIndex = state.nextZIndex + 1;
  const window: WindowInstance = {
    id: createWindowId(),
    appId: app.id,
    title: app.title,
    state: "normal",
    bounds,
    restoredBounds: null,
    zIndex,
    launchMode: "neural",
  };

  const withoutDock = state.windows.filter((w) => w.launchMode !== "dock");

  return focusWindow(
    {
      ...state,
      windows: [...withoutDock, window],
      desktopMode: "network",
      nextZIndex: zIndex,
    },
    window.id,
  );
}

export const initialWindowManagerState: WindowManagerState = {
  windows: [],
  focusedWindowId: null,
  nextZIndex: 100,
  desktopMode: "network",
};

export function windowManagerReducer(
  state: WindowManagerState,
  action: WindowManagerAction,
): WindowManagerState {
  switch (action.type) {
    case "OPEN_APP": {
      const { app, workArea, launchMode } = action;
      if (launchMode === "dock") {
        return openDockApp(state, app, workArea);
      }
      return openNeuralApp(state, app, workArea);
    }

    case "CLOSE_WINDOW": {
      const closing = state.windows.find((w) => w.id === action.windowId);
      const remaining = state.windows.filter((w) => w.id !== action.windowId);
      const top = remaining
        .filter((w) => w.state !== "minimized")
        .sort((a, b) => b.zIndex - a.zIndex)[0];

      const nextDesktopMode =
        closing?.launchMode === "dock" ? "network" : state.desktopMode;

      return {
        ...state,
        windows: remaining,
        focusedWindowId:
          state.focusedWindowId === action.windowId
            ? (top?.id ?? null)
            : state.focusedWindowId,
        desktopMode: remaining.some((w) => w.launchMode === "dock")
          ? "application"
          : nextDesktopMode,
      };
    }

    case "FOCUS_WINDOW": {
      const target = state.windows.find((w) => w.id === action.windowId);
      if (!target || target.state === "minimized") return state;
      return focusWindow(state, action.windowId);
    }

    case "MINIMIZE_WINDOW": {
      const target = state.windows.find((w) => w.id === action.windowId);
      const remaining = state.windows.filter(
        (w) => w.id !== action.windowId && w.state !== "minimized",
      );
      const top = [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0];

      const nextDesktopMode =
        target?.launchMode === "dock" ? "network" : state.desktopMode;

      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.windowId ? { ...w, state: "minimized" } : w,
        ),
        focusedWindowId:
          state.focusedWindowId === action.windowId
            ? (top?.id ?? null)
            : state.focusedWindowId,
        desktopMode: state.windows.some(
          (w) =>
            w.id !== action.windowId &&
            w.launchMode === "dock" &&
            w.state !== "minimized",
        )
          ? "application"
          : nextDesktopMode,
      };
    }

    case "RESTORE_WINDOW": {
      const target = state.windows.find((w) => w.id === action.windowId);
      if (!target) return state;

      let nextWindows = state.windows;

      if (target.state === "maximized" && target.restoredBounds) {
        nextWindows = state.windows.map((w) =>
          w.id === action.windowId
            ? {
                ...w,
                state: "normal" as WindowState,
                bounds: target.restoredBounds!,
                restoredBounds: null,
              }
            : w,
        );
      } else if (target.state === "minimized") {
        nextWindows = state.windows.map((w) =>
          w.id === action.windowId ? { ...w, state: "normal" as WindowState } : w,
        );
      }

      const restored = nextWindows.find((w) => w.id === action.windowId);
      const nextDesktopMode =
        restored?.launchMode === "dock" ? "application" : state.desktopMode;

      return focusWindow(
        { ...state, windows: nextWindows, desktopMode: nextDesktopMode },
        action.windowId,
      );
    }

    case "TOGGLE_MAXIMIZE": {
      const target = state.windows.find((w) => w.id === action.windowId);
      if (!target || target.state === "minimized" || target.launchMode === "dock") {
        return state;
      }

      if (target.state === "maximized") {
        return focusWindow(
          {
            ...state,
            windows: state.windows.map((w) =>
              w.id === action.windowId && w.restoredBounds
                ? {
                    ...w,
                    state: "normal" as WindowState,
                    bounds: w.restoredBounds,
                    restoredBounds: null,
                  }
                : w,
            ),
          },
          action.windowId,
        );
      }

      const maximized = getMaximizedBounds(action.workArea);
      return focusWindow(
        {
          ...state,
          windows: state.windows.map((w) =>
            w.id === action.windowId
              ? {
                  ...w,
                  state: "maximized" as WindowState,
                  restoredBounds: w.bounds,
                  bounds: maximized,
                }
              : w,
          ),
        },
        action.windowId,
      );
    }

    case "MOVE_WINDOW": {
      const target = state.windows.find((w) => w.id === action.windowId);
      if (!target || target.launchMode === "dock") return state;

      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.windowId
            ? { ...w, bounds: clampBounds(action.bounds, action.workArea) }
            : w,
        ),
      };
    }

    case "BLUR_FOCUS":
      return { ...state, focusedWindowId: null };

    case "EXIT_APPLICATION_MODE": {
      const appWindow = state.windows.find(
        (w) => w.launchMode === "dock" && w.state !== "minimized",
      );
      if (!appWindow) {
        return { ...state, desktopMode: "network" };
      }

      const remaining = state.windows.filter((w) => w.id !== appWindow.id);
      const top = remaining
        .filter((w) => w.state !== "minimized")
        .sort((a, b) => b.zIndex - a.zIndex)[0];

      return {
        ...state,
        windows: remaining,
        focusedWindowId: top?.id ?? null,
        desktopMode: "network",
      };
    }

    case "SYNC_WORKAREA": {
      const maximized = getMaximizedBounds(action.workArea);
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.launchMode === "dock" && w.state === "maximized") {
            return { ...w, bounds: maximized };
          }
          if (w.state !== "maximized") return w;
          return { ...w, bounds: maximized };
        }),
      };
    }

    default:
      return state;
  }
}
