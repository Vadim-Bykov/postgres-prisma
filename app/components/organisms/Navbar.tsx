import React from "react";
import Button from "../atoms/common/Button";
import { useAppSelector } from "@/store/store";
import {
  useAuthenticationQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/store/features/api/appApi";

export function Navbar() {
  const { data, isLoading } = useAuthenticationQuery();
  const [login, { isLoading: isAuthorizing }] = useLoginMutation();
  const [logout, { isLoading: isLogouting }] = useLogoutMutation();

  const sendUserData = () => {
    login({ email: "bvntaev@gmail.com", password: "Password!" });
  };

  return (
    <div className="flex flex-grow justify-center bg-blue-400 h-10">
      {data?.auth ? (
        <Button
          loading={isLogouting}
          disabled={isLoading}
          onClick={() => logout()}
        >
          Logout
        </Button>
      ) : (
        <Button
          disabled={isLoading || isAuthorizing}
          loading={isLoading || isAuthorizing}
          onClick={sendUserData}
        >
          Login
        </Button>
      )}
      {data?.user && <p className="font-medium">User: {data?.user.email}</p>}
    </div>
  );
}
