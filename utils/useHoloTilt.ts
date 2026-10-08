"use client";

import { usePrefersReducedMotion } from "@/utils/usePrefersReducedMotion";
import { clamp } from "lodash-es";
import {
  DOMAttributes,
  PointerEvent as ReactPointerEvent,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

// Keep in sync with --holo-proximity-radius in HoloCard.module.css.
const PROXIMITY_RADIUS_PX = 32;

const HOLO_VARS = [
  "--holo-rx",
  "--holo-ry",
  "--holo-scale",
  "--holo-glare-x",
  "--holo-glare-y",
  "--holo-bg-x",
  "--holo-bg-y",
  "--holo-shadow-x",
  "--holo-shadow-y",
  "--holo-inset-x",
  "--holo-inset-y",
] as const;

function getDistanceToRect(rect: DOMRect, x: number, y: number): number {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.hypot(dx, dy);
}

function getProximityFactor(
  rect: DOMRect,
  x: number,
  y: number,
  radius: number
): number {
  const distance = getDistanceToRect(rect, x, y);
  if (distance >= radius) return 0;
  return 1 - distance / radius;
}

interface Options {
  maxTilt?: number;
  hoverScale?: number;
}

type HoloTiltHandlers = Pick<
  DOMAttributes<HTMLDivElement>,
  | "onPointerEnter"
  | "onPointerDown"
  | "onPointerMove"
  | "onPointerUp"
  | "onPointerCancel"
  | "onPointerLeave"
>;

export function useHoloTilt({ maxTilt = 15, hoverScale = 1.02 }: Options): {
  wrapperRef: RefObject<HTMLDivElement>;
  handlers: HoloTiltHandlers;
} {
  // The wrapper owns pointer events and is never transformed, so its rect is
  // the card's idle rect and stays stable under tilt.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  // Mouse path applies proximity attenuation; touch/pen stays at factor=1.
  const pointerTypeRef = useRef<string | null>(null);
  const motionReduced = usePrefersReducedMotion();
  const motionReducedRef = useRef(motionReduced);
  // Set on every touch/pen activation: the next finger lift anywhere on the
  // page (including a second finger) resets us via the touchend listener.
  const awaitingTouchEndRef = useRef(false);

  const writeVarsFromPointer = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const wrapper = wrapperRef.current;
      const rect = rectRef.current;
      if (!wrapper || !rect) return;
      lastPointerRef.current = { x: clientX, y: clientY };

      const tilt = maxTilt;
      const offsetX = clientX - rect.left;
      const offsetY = clientY - rect.top;
      const pointerXPercent = clamp((offsetX / rect.width) * 100, 0, 100);
      const pointerYPercent = clamp((offsetY / rect.height) * 100, 0, 100);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateXDeg =
        clamp(((offsetY - centerY) / centerY) * -tilt, -tilt, tilt) * factor;
      const rotateYDeg =
        clamp(((offsetX - centerX) / centerX) * tilt, -tilt, tilt) * factor;
      const scale = 1 + (hoverScale - 1) * factor;

      wrapper.style.setProperty("--holo-rx", `${rotateXDeg}deg`);
      wrapper.style.setProperty("--holo-ry", `${rotateYDeg}deg`);
      wrapper.style.setProperty("--holo-scale", String(scale));
      wrapper.style.setProperty("--holo-glare-x", `${pointerXPercent}%`);
      wrapper.style.setProperty("--holo-glare-y", `${pointerYPercent}%`);
      wrapper.style.setProperty("--holo-bg-x", `${100 - pointerXPercent}%`);
      wrapper.style.setProperty("--holo-bg-y", `${100 - pointerYPercent}%`);

      // Shadow offsets piggy-back on tilt, which is already × factor.
      wrapper.style.setProperty("--holo-shadow-x", `${-rotateYDeg * 0.8}px`);
      wrapper.style.setProperty(
        "--holo-shadow-y",
        `${rotateXDeg * 0.8 + 15}px`
      );
      wrapper.style.setProperty("--holo-inset-x", `${rotateYDeg * 0.5}px`);
      wrapper.style.setProperty("--holo-inset-y", `${-rotateXDeg * 0.5}px`);
    },
    [maxTilt, hoverScale]
  );

  const resetVars = useCallback(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    for (const name of HOLO_VARS) wrapper.style.removeProperty(name);
  }, []);

  const refreshActiveState = useCallback(() => {
    const wrapper = wrapperRef.current;
    const last = lastPointerRef.current;
    if (!wrapper || !last) return;
    const rect = wrapper.getBoundingClientRect();
    rectRef.current = rect;
    const factor =
      pointerTypeRef.current === "mouse"
        ? getProximityFactor(rect, last.x, last.y, PROXIMITY_RADIUS_PX)
        : 1;
    // Scrolled past the proximity buffer — stop updating tilt.
    if (factor <= 0) return;
    writeVarsFromPointer(last.x, last.y, factor);
  }, [writeVarsFromPointer]);

  const detachActiveListeners = useCallback(() => {
    window.removeEventListener("scroll", refreshActiveState, { capture: true });
    window.removeEventListener("resize", refreshActiveState);
  }, [refreshActiveState]);

  const deactivate = useCallback(() => {
    awaitingTouchEndRef.current = false;
    pointerIdRef.current = null;
    pointerTypeRef.current = null;
    detachActiveListeners();
    rectRef.current = null;
    lastPointerRef.current = null;
    wrapperRef.current?.removeAttribute("data-active");
    resetVars();
  }, [detachActiveListeners, resetVars]);

  // Fallback reset for touch. A normal press ends with pointerup; after
  // pointercancel (browser took over the gesture) no further pointer events
  // fire, so touchend is the only way to learn the finger has lifted.
  useEffect(() => {
    const onTouchEnd = () => {
      if (awaitingTouchEndRef.current) deactivate();
    };
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [deactivate]);

  // Defensive: detach listeners if we unmount mid-interaction.
  useEffect(() => () => deactivate(), [deactivate]);

  useEffect(() => {
    motionReducedRef.current = motionReduced;
    if (motionReduced && pointerIdRef.current !== null) deactivate();
  }, [motionReduced, deactivate]);

  const activate = (
    event: ReactPointerEvent<HTMLDivElement>,
    factor: number
  ) => {
    if (motionReducedRef.current) return;
    if (pointerIdRef.current !== null) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    pointerIdRef.current = event.pointerId;
    pointerTypeRef.current = event.pointerType;
    rectRef.current = wrapper.getBoundingClientRect();
    // Touch / pen: no explicit pointer capture - it would retarget the click
    // away from the inner Button. Implicit touch capture still routes
    // pointerup through the wrapper; touchend is the fallback.
    if (event.pointerType !== "mouse") awaitingTouchEndRef.current = true;
    window.addEventListener("scroll", refreshActiveState, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", refreshActiveState);
    writeVarsFromPointer(event.clientX, event.clientY, factor);
    wrapper.setAttribute("data-active", "true");
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const factor = getProximityFactor(
      wrapper.getBoundingClientRect(),
      event.clientX,
      event.clientY,
      PROXIMITY_RADIUS_PX
    );
    if (factor <= 0) return;
    activate(event, factor);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    activate(event, 1);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      // pointerenter may have missed (e.g. first pointermove after entry from
      // a different surface); compute factor and activate if needed.
      const rect = rectRef.current ?? wrapper.getBoundingClientRect();
      const factor = getProximityFactor(
        rect,
        event.clientX,
        event.clientY,
        PROXIMITY_RADIUS_PX
      );
      if (factor <= 0) {
        if (pointerIdRef.current !== null) deactivate();
        return;
      }
      if (pointerIdRef.current === null) {
        activate(event, factor);
        return;
      }
      if (event.pointerId !== pointerIdRef.current) return;
      writeVarsFromPointer(event.clientX, event.clientY, factor);
      return;
    }
    // Touch / pen: always at full strength while the pointer is down.
    if (event.pointerId !== pointerIdRef.current) return;
    writeVarsFromPointer(event.clientX, event.clientY, 1);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    if (event.pointerId !== pointerIdRef.current) return;
    deactivate();
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerId !== pointerIdRef.current) return;
    if (event.pointerType !== "touch") {
      deactivate();
      return;
    }
    // Browser took over the gesture (e.g. vertical scroll under pan-y).
    // Freeze the visual until the finger lifts: stop tilt re-computing, but
    // leave data-active and the CSS vars in place. The persistent touchend
    // listener resets us on the eventual lift.
    detachActiveListeners();
    awaitingTouchEndRef.current = true;
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    if (event.pointerId !== pointerIdRef.current) return;
    // Fires when the cursor leaves the wrapper's stable hit-region (which
    // includes the proximity buffer). The wrapper isn't transformed, so its
    // bounds stay aligned with the cursor while the inner card tilts.
    deactivate();
  };

  return {
    wrapperRef,
    handlers: {
      onPointerEnter: handlePointerEnter,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onPointerLeave: handlePointerLeave,
    },
  };
}
