export { windowManagerReducer, initialWindowManagerState } from "./window-manager-reducer";
export type { WindowManagerState, WindowManagerAction } from "./window-manager-reducer";
export { WindowManagerProvider, useWindowManager } from "./window-manager-context";
export {
  TASKBAR_HEIGHT,
  clampBounds,
  getWorkAreaSize,
  getCascadePosition,
  centerWindow,
} from "./geometry";
