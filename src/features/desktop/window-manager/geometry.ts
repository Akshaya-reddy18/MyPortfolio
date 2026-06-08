import type { DesktopInsets, WindowBounds } from "../types";

export const TASKBAR_HEIGHT = 44;

export const TOPBAR_HEIGHT = 50;

export const WINDOW_TITLEBAR_HEIGHT = 40;

/** Viewport insets matching desktop shell chrome (top bar + taskbar) */
export const DEFAULT_INSETS: DesktopInsets = {
  top: TOPBAR_HEIGHT,
  left: 0,
  right: 0,
  bottom: TASKBAR_HEIGHT,
};

export function getWorkAreaSize(viewport: { width: number; height: number }, insets: DesktopInsets) {
  return {
    width: viewport.width - insets.left - insets.right,
    height: viewport.height - insets.top - insets.bottom,
  };
}

export function clampBounds(bounds: WindowBounds, workArea: { width: number; height: number }): WindowBounds {
  const minVisible = 80;
  const maxW = Math.max(workArea.width, minVisible);
  const maxH = Math.max(workArea.height, minVisible);

  const width = Math.min(Math.max(bounds.width, minVisible), maxW);
  const height = Math.min(Math.max(bounds.height, minVisible), maxH);

  const maxX = Math.max(0, workArea.width - minVisible);
  const maxY = Math.max(0, workArea.height - minVisible);

  return {
    x: Math.max(0, Math.min(bounds.x, maxX)),
    y: Math.max(0, Math.min(bounds.y, maxY)),
    width,
    height,
  };
}

export function getMaximizedBounds(workArea: { width: number; height: number }): WindowBounds {
  return {
    x: 0,
    y: 0,
    width: workArea.width,
    height: workArea.height,
  };
}

let cascadeOffset = 0;

export function getCascadePosition(
  workArea: { width: number; height: number },
  size: { width: number; height: number },
): { x: number; y: number } {
  const step = 28;
  const maxOffset = 7;
  const offset = (cascadeOffset % maxOffset) * step;
  cascadeOffset += 1;

  const x = Math.min(offset + 48, Math.max(0, workArea.width - size.width - 24));
  const y = Math.min(offset + 32, Math.max(0, workArea.height - size.height - 24));

  return { x, y };
}

export function centerWindow(
  workArea: { width: number; height: number },
  size: { width: number; height: number },
): { x: number; y: number } {
  return {
    x: Math.max(0, (workArea.width - size.width) / 2),
    y: Math.max(0, (workArea.height - size.height) / 2),
  };
}
