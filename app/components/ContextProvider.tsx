"use client";

import { store } from "@/store/store";
import { Provider } from "react-redux";
import Button from "./atoms/common/Button";

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <div className="flex flex-grow justify-center bg-blue-400 h-10">
        <Button>User</Button>
      </div>
      {children}
    </Provider>
  );
}
