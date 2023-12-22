import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { Url } from "url";
import { usePathname, useRouter } from "next/navigation";
import {
  AppRouterInstance,
  NavigateOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";

export type Pathname = "/" | "/admin" | "/account" | "/consultation";

interface AppRouter extends AppRouterInstance {
  push(href: Pathname, options?: NavigateOptions): void;
}
const useAppRouter = () => {
  const router: AppRouter = useRouter();
  return router;
};

export const useAppPathname = () => {
  // @ts-ignore
  const pathname: Pathname = usePathname();

  return pathname;
};
