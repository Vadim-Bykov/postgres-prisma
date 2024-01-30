import React, { PropsWithChildren } from "react";

export function PageLayout({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main className="flex min-h-screen md:min-h-[calc(100vh-78px)]  min-w-full flex-col pb-10 px-10 md:px-20 gap-10 md:gap-20">
      {children}
    </main>
  );
}
