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
