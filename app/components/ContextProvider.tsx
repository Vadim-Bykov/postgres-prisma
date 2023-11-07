"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import Button from "./atoms/common/Button";
import { Navbar } from "./organisms/Navbar";

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <Navbar />
      {children}
    </Provider>
  );
}
