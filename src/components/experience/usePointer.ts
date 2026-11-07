"use client";

import { useMemo, useRef } from "react";

export type PointerState = { x: number; y: number; inside: boolean; down: boolean };

/** Tracks the pointer over an element, in that element's own pixels. */
export function usePointer() {
  const ref = useRef<PointerState>({ x: 0, y: 0, inside: false, down: false });
  const handlers = useMemo(() => {
    const at = (e: React.PointerEvent) => {
      const r = e.currentTarget.getBoundingClientRect();
      ref.current.x = e.clientX - r.left;
      ref.current.y = e.clientY - r.top;
    };
    return {
      onPointerMove: (e: React.PointerEvent) => {
        at(e);
        ref.current.inside = true;
      },
      onPointerEnter: (e: React.PointerEvent) => {
        at(e);
        ref.current.inside = true;
      },
      onPointerLeave: () => {
        ref.current.inside = false;
        ref.current.down = false;
      },
      onPointerUp: () => {
        ref.current.down = false;
      },
      onPointerCancel: () => {
        ref.current.down = false;
        ref.current.inside = false;
      },
    };
  }, []);
  return Object.assign(ref, { handlers });
}
