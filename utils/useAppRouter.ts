import {
  AppRouterInstance,
  NavigateOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export type Pathname =
  | "/"
  | "/admin"
  | "/account"
  | "/account/personal-details"
  | "/account/notifications"
  | "/account/bonuses"
  | "/account/friends"
  | "/account/support"
  | "/account/purchases"
  | "/article"
  | `/article/${number}`
  | "/bonus-program"
  | "/consultation"
  | `/consultation/${number}`;

interface AppRouter extends AppRouterInstance {
  push(href: Pathname, options?: NavigateOptions): void;
  isTransitioning: boolean;
}
export const useAppRouter = (): AppRouter => {
  const router = useRouter();

  const [isTransitioning, setTransition] = useTransition();
  const push = (href: Pathname, options?: NavigateOptions) => {
    setTransition(() => {
      router.push(href, options);
    });
  };

  return { ...router, push, isTransitioning };
};

export const useAppPathname = () => {
  // @ts-ignore
  const pathname: Pathname = usePathname();

  return pathname;
};
