import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useIsLoggedIn() {
  return useAppSelector((state) => state.user.isAuthorized);
}

export function useAuthorizedRoute() {
  const router = useRouter();
  const loggedIn = useIsLoggedIn();

  useEffect(() => {
    if (!loggedIn) {
      router.replace("/");
    }
  }, [loggedIn, router]);
}

export function useAdminRoute() {
  const router = useRouter();
  const isAdmin = useAppSelector(
    (state) => state.user.userData?.role === "ADMIN"
  );

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/");
    }
  }, [isAdmin, router]);
}
