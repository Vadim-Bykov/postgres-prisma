import {
  AppRouterInstance,
  NavigateOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";

export type Pathname =
  | "/"
  | "/admin"
  | "/account"
  | "/account/personal-details"
  | "/account/notifications"
  | "/account/friends"
  | "/account/support"
  | "/account/purchases"
  | "/consultation"
  | `/consultation/${number}`
  | "/article"
  | `/article/${number}`;

interface AppRouter extends AppRouterInstance {
  push(href: Pathname, options?: NavigateOptions): void;
}
export const useAppRouter = () => {
  const router: AppRouter = useRouter();
  return router;
};

export const useAppPathname = () => {
  // @ts-ignore
  const pathname: Pathname = usePathname();

  return pathname;
};
