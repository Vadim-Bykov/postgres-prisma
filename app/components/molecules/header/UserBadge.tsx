import AvatarImage from "@/public/icons/avatar.svg";
import { storeAccountEntryRoute } from "@/store/app";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useIsLoggedIn } from "@/utils/authorization";
import { useAppPathname, useAppRouter } from "@/utils/useAppRouter";
import { useWindowDimensions } from "@/utils/useWindowDimensions";
import clsx from "clsx";
import Image from "next/image";
import { HTMLAttributes } from "react";
import { AuthenticationButton } from "../../atoms/AuthenticationButton";
import Icon from "../../atoms/common/Icon/Icon";

export function UserBadge({
  onAvatarLogoClick,
  className,
}: {
  onAvatarLogoClick?: () => void;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
  const userData = useAppSelector((state) => state.user.userData);
  const loggedIn = useIsLoggedIn();

  const isUserDataLoading = loggedIn === undefined;

  const dispatch = useAppDispatch();

  const asPath = useAppPathname();
  const { push } = useAppRouter();
  const { isTablet } = useWindowDimensions();

  const onAvatarClick = () => {
    if (isUserDataLoading) return;

    onAvatarLogoClick?.();
    const isAccountRoute = asPath.includes("/account");
    if (!isAccountRoute) {
      dispatch(storeAccountEntryRoute(asPath));
    }
    isTablet ? push("/account") : push("/account/personal-details");
  };

  return (
    <div className={clsx(className)}>
      {loggedIn || isUserDataLoading ? (
        <button
          onClick={onAvatarClick}
          className="flex flex-col lg:flex-row items-center gap-3 relative"
        >
          <Image
            priority
            src={AvatarImage}
            alt="Placeholder image for user avatar depicting an piñata Max mascot"
            className="w-10 h-10"
          />
          <Icon
            color="white"
            name="account/settings-2-fill.svg"
            className="absolute top-6 left-10 lg:left-7"
          />
          <span>{userData?.name || ""}</span>
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
