"use client";

import { useAppPathname } from "@/utils/useAppRouter";
import React from "react";
import { AccountNavigationLayout } from "./components/AccountNavigationLayout";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = useAppPathname();

  return pathname === "/account" ? (
    <>{children}</>
  ) : (
    <AccountNavigationLayout>{children}</AccountNavigationLayout>
  );
}
