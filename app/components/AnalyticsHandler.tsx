import { useAppSelector } from "@/store/store";
import { Analytics } from "@vercel/analytics/react";
import React from "react";

export function AnalyticsHandler() {
  const isAdmin =
    useAppSelector((state) => state.user.userData?.role || "ADMIN") === "ADMIN";

  const isAuthorized = useAppSelector((state) => state.user.isAuthorized);

  const sentAnalytics =
    (isAuthorized && !isAdmin) ||
    (typeof isAuthorized === "boolean" && !isAuthorized);

  return (
    <Analytics
      mode="production"
      debug={false}
      beforeSend={(event) => {
        if (sentAnalytics) {
          return event;
        } else {
          return null;
        }
      }}
    />
  );
}
