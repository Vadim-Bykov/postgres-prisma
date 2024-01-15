import {
  AppRouterInstance,
  NavigateOptions,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";

export type Pathname =
  | "/"
  | "/admin"
  | "/account"
  | "/consultation"
  | `/consultation/${number}`
  | "/purchase"
  | `/purchase/${number}`;

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
