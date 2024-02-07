import clsx from "clsx";
import React, { PropsWithChildren } from "react";

export function PageLayout({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main
      className={clsx(
        "flex min-h-screen lg:min-h-[calc(100vh-78px)]  min-w-full flex-col pb-10 gap-10 lg:gap-20",
        className
      )}
    >
      {children}
    </main>
  );
}
