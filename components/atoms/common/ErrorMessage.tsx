import clsx from "clsx";
import { PropsWithChildren } from "react";

export function ErrorMessage({
  children,
  visible,
}: PropsWithChildren<{ visible: boolean }>) {
  return (
    <p
      className={clsx(
        "overflow-hidden ml-2 text-pink h-fit",
        "transition-max-height duration-500 ease-in-out",
        visible ? "max-h-28" : "max-h-0"
      )}
    >
      {children}
    </p>
  );
}
