import { appApi } from "@/store/features/api/appApi";
import {
  useAuthenticationQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/store/features/api/subApi/userApi";
import { useEffect } from "react";
import Button from "../atoms/common/Button";

export function Navbar() {
  const { data: userData, isLoading } = useAuthenticationQuery();
  const [login, { isLoading: isAuthorizing }] = useLoginMutation();
  const [logout, { isLoading: isLogouting }] = useLogoutMutation();
  const [trigger, { data: location }] =
    appApi.endpoints.getLocation.useLazyQuery();

  useEffect(() => {
    if (!!userData && (!userData.user?.location || !userData.auth)) {
      trigger();
    }
  }, [userData, trigger]);

  const sendUserData = () => {
    login({ email: "bvntaev@gmail.com", password: "Password!" });
  };

  return (
    <div className="flex flex-grow justify-center bg-blue-400 h-10">
      {userData?.auth ? (
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
      {userData?.user && (
        <p className="font-medium">User: {userData?.user.email} </p>
      )}
      <p className="font-medium">
        {"  "}
        location: {userData?.user?.location?.country || location?.country}{" "}
        {userData?.user?.location?.country_name || location?.country_name}
      </p>
    </div>
  );
}
