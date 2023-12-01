"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import { Navbar } from "./organisms/Navbar";
import { Header } from "./organisms/Header";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Header />
      {children}
    </Provider>
  );
}
