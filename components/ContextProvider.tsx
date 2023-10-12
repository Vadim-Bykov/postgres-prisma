"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
