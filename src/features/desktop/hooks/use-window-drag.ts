import { useCallback, useRef } from "react";
import type { WindowBounds } from "../types";
import { useWindowManager } from "../window-manager/window-manager-context";

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  originBounds: WindowBounds;
}

export function useWindowDrag(windowId: string, enabled: boolean) {
  const { moveWindow, focusWindow, windows } = useWindowManager();
  const dragRef = useRef<DragState | null>(null);

  const window = windows.find((w) => w.id === windowId);

  const onTitlebarPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || !window || window.state === "maximized") return;
      if (event.button !== 0) return;

      event.preventDefault();
      event.stopPropagation();
      focusWindow(windowId);

      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originBounds: window.bounds,
      };

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [enabled, window, focusWindow, windowId],
  );

  const onTitlebarPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;

      moveWindow(windowId, {
        ...drag.originBounds,
        x: drag.originBounds.x + dx,
        y: drag.originBounds.y + dy,
      });
    },
    [moveWindow, windowId],
  );

  const onTitlebarPointerUp = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;

      dragRef.current = null;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  return {
    onTitlebarPointerDown,
    onTitlebarPointerMove,
    onTitlebarPointerUp,
  };
}
