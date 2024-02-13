import { toggleLogoutModal } from "@/store/authentication";
import { appApi } from "@/store/features/api/appApi";
import { useAuthenticationQuery } from "@/store/features/api/subApi/userApi";
import { useAppDispatch } from "@/store/store";
import clsx from "clsx";
import { HTMLAttributes, useEffect } from "react";
import { AuthenticationButton } from "../../atoms/AuthenticationButton";
import Button from "../../atoms/common/Button";
import AvatarImage from "@/public/icons/avatar.svg";
import Image from "next/image";
import { useAppPathname, useAppRouter } from "@/utils/useAppRouter";
import { useWindowDimensions } from "@/utils/useWindowDimensions";
import { storeAccountEntryRoute } from "@/store/app";

export function UserBadge({
  onAvatarLogoClick,
  className,
}: {
  onAvatarLogoClick?: () => void;
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

  const asPath = useAppPathname();
  const { push } = useAppRouter();
  const { isTablet } = useWindowDimensions();

  const onAvatarClick = () => {
    onAvatarLogoClick?.();
    dispatch(storeAccountEntryRoute(asPath));
    isTablet ? push("/account") : push("/account/personal-details");
  };

  return (
    <div className={clsx(className)}>
      {loggedIn ? (
        <button
          onClick={onAvatarClick}
          className="flex flex-col lg:flex-row items-center gap-3"
        >
          <Image
            priority
            src={AvatarImage}
            alt="Placeholder image for user avatar depicting an piñata Max mascot"
            className="w-10 h-10"
          />
          <span>{userData?.user?.name}</span>
        </button>
      ) : (
        <AuthenticationButton
          disabled={isUserDataLoading}
          loading={isUserDataLoading}
          onClick={onAvatarLogoClick}
        />
      )}
    </div>
  );
}
