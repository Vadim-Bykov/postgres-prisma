"use client";

import { cn } from "@/utils/css";
import { useHoloTilt } from "@/utils/useHoloTilt";
import { ReactNode } from "react";
import styles from "./HoloCard.module.css";

interface Props {
  children: ReactNode;
  /** Inner card that tilts: background, border, radius, size. */
  className?: string;
  /** Outer wrapper that is never transformed: layout slot and hit-region. */
  wrapperClassName?: string;
  /** Max tilt in degrees on each axis at the card edge. Default 15. */
  maxTilt?: number;
  /** Hover scale; `1` disables the lift. Default 1.02. */
  hoverScale?: number;
}

/**
 * The pointer hit-region extends 32px beyond the wrapper on every side: leave
 * that much room around the card or clip x on an ancestor (`overflow-x-clip`).
 */
export function HoloCard({
  children,
  className,
  wrapperClassName,
  maxTilt,
  hoverScale,
}: Props) {
  const { wrapperRef, handlers } = useHoloTilt({ maxTilt, hoverScale });

  return (
    <div
      ref={wrapperRef}
      className={cn(styles.wrapper, wrapperClassName)}
      {...handlers}
    >
      <div className={styles.proximityZone} aria-hidden="true" />
      <div className={cn(styles.root, className)}>
        <div className={styles.holoLayer} aria-hidden="true" />
        <div className={styles.textureLayer} aria-hidden="true" />
        <div className={styles.glareLayer} aria-hidden="true" />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
