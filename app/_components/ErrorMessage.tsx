import clsx from "clsx";
import { PropsWithChildren } from "react";

export function ErrorMessage({
  children,
  visible,
  className,
}: PropsWithChildren<{ visible: boolean; className?: string }>) {
  return (
    <p
      className={clsx(
        "overflow-hidden text-pink h-fit",
        "transition-max-height duration-500 ease-in-out",
        visible ? "max-h-32" : "max-h-0",
        className
      )}
    >
      {children}
    </p>
  );
}
