import React, { PropsWithChildren } from "react";

export function PageLayout({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main className="flex min-h-screen min-w-full flex-col py-10 px-10 md:px-20 1 gap-10 md:gap-20">
      {children}
    </main>
  );
}
