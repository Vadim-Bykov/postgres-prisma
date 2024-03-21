"use client";

import { store } from "@/store/store";
import { useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import ReactModal from "react-modal";
import { Provider } from "react-redux";
import { Footer } from "./common/Footer";
import { AuthenticationFlow } from "./organisms/AuthenticationFlow";
import { Header } from "./organisms/Header";
import { AnalyticsHandler } from "./AnalyticsHandler";

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
      </SkeletonTheme>
    </Provider>
  );
}
