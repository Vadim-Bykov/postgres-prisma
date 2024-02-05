"use client";

import { store } from "@/store/store";
import { useEffect } from "react";
import ReactModal from "react-modal";
import { Provider } from "react-redux";
import { AuthenticationFlow } from "./organisms/AuthenticationFlow";
import { Header } from "./organisms/Header";
import { Footer } from "./common/Footer";

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
      <Header />
      <AuthenticationFlow />
      {children}
      <Footer />
    </Provider>
  );
}
