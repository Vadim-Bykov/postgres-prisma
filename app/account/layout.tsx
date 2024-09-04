"use client";

import { useAppPathname } from "@/utils/useAppRouter";
import React from "react";
import { AccountNavigationLayout } from "./components/AccountNavigationLayout";
import { useAuthorizedRoute } from "@/utils/authorization";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = useAppPathname();
  useAuthorizedRoute();

  return pathname === "/account" ? (
    <>{children}</>
  ) : (
    <AccountNavigationLayout>{children}</AccountNavigationLayout>
  );
}
