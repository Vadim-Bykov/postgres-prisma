"use client";

import { usePathname } from "next/navigation";
import Wrapper from "./Wrapper";

export function ConditionalWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/doctronic-embed")) {
    return <>{children}</>;
  }

  return <Wrapper>{children}</Wrapper>;
}
