"use client";

import { useAuthorizedRoute } from "@/utils/authorization";
import { useWindowDimensions } from "@/utils/useWindowDimensions";
import { useEffect } from "react";
import { MobileAccountNavigation } from "./components/MobileAccountNavigation";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function Account() {
  useAuthorizedRoute();
  const { isTablet } = useWindowDimensions();
  const { replace } = useRouter();

  useEffect(() => {
    if (!isTablet) {
      replace("/account/personal-details");
    }
  }, [isTablet, replace]);

  return <MobileAccountNavigation />;
}
