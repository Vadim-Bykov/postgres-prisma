import React from "react";
import Button from "../atoms/common/Button";
import { useAppSelector } from "@/store/store";

export function Navbar() {
  // const app = useAppSelector(state => state.api.queries)

  return (
    <div className="flex flex-grow justify-center bg-blue-400 h-10">
      <Button>User</Button>
    </div>
  );
}
