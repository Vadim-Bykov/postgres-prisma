import { toggleLogoutModal } from "@/store/authentication";
import { appApi } from "@/store/features/api/appApi";
import { useAuthenticationQuery } from "@/store/features/api/subApi/userApi";
import { useAppDispatch } from "@/store/store";
import clsx from "clsx";
import { HTMLAttributes, useEffect } from "react";
import { AuthenticationButton } from "../../atoms/AuthenticationButton";
import Button from "../../atoms/common/Button";

export function UserBadge({
  className,
}: {
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
  const { data: userData, isLoading: isUserDataLoading } =
    useAuthenticationQuery();
  const [trigger, { data: location }] =
    appApi.endpoints.getLocation.useLazyQuery();

  const loggedIn = !!userData?.auth;

  useEffect(() => {
    if (!!userData && (!userData.user?.location || !userData.auth)) {
      trigger();
    }
  }, [userData, trigger]);

  const dispatch = useAppDispatch();

  const openLogoutModal = () => {
    dispatch(toggleLogoutModal(true));
  };

  return (
    <div className={clsx(className)}>
      {loggedIn ? (
        <Button onClick={openLogoutModal}>{userData?.user?.name}</Button>
      ) : (
        <AuthenticationButton
          disabled={isUserDataLoading}
          loading={isUserDataLoading}
        />
      )}
    </div>
  );
}
