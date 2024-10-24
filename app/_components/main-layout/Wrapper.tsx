"use client";

import { Footer } from "@/app/_components/Footer";
import { Toast } from "@/app/_components/Toast/Toast";
import { store } from "@/store/store";
import { useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import ReactModal from "react-modal";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { AnalyticsHandler } from "./AnalyticsHandler";
import { AuthenticationFlow } from "./AuthenticationFlow";
import { Header } from "./Header";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    ReactModal.setAppElement("body");

    const root = document.querySelector(":root");
    if (root) {
      root.classList.add("antialiased", "font-sans", "text-purple-dark");
    }
  }, []);

  return (
    <Provider store={store}>
      <SkeletonTheme baseColor="#CDCDCD">
        <Header />
        <AuthenticationFlow />
        {children}
        <Footer />
        <AnalyticsHandler />
        <SpeedInsights />
        <Toast />
      </SkeletonTheme>
    </Provider>
  );
}
