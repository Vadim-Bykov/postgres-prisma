import { appApi } from "@/store/features/api/appApi";
import {
  useAuthenticationQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/store/features/api/subApi/userApi";
import { useEffect } from "react";
import Button from "../atoms/common/Button";

export function Navbar() {
  const { data, isLoading } = useAuthenticationQuery();
  const [login, { isLoading: isAuthorizing }] = useLoginMutation();
  const [logout, { isLoading: isLogouting }] = useLogoutMutation();
  const [trigger, { data: location }] =
    appApi.endpoints.getLocation.useLazyQuery();

  useEffect(() => {
    if (!!data && (!data.user?.location || !data.auth)) {
      trigger();
    }
  }, [data, trigger]);

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
      {data?.user && <p className="font-medium">User: {data?.user.email} </p>}
      <p className="font-medium">
        {"  "}
        location: {data?.user?.location?.country || location?.country}{" "}
        {data?.user?.location?.country_name || location?.country_name}
      </p>
    </div>
  );
}
