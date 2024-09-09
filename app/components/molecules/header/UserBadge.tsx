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
import { useWalletQuery, walletApi } from "@/store/features/api/subApi/wallet";
import { Coin } from "@/public/icons/Coin";
import { cn } from "@/utils/css";
import { shallowEqual } from "react-redux";

export function UserBadge({
  onAvatarLogoClick,
  className,
}: {
  onAvatarLogoClick?: () => void;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
  const userData = useAppSelector((state) => state.user.userData, shallowEqual);
  const loggedIn = useIsLoggedIn();

  const isUserDataLoading = loggedIn === undefined;

  const dispatch = useAppDispatch();

  const asPath = useAppPathname();
  const { push, isTransitioning } = useAppRouter();
  const { isTablet } = useWindowDimensions();

  const walletApiResult = walletApi.endpoints.wallet.useQueryState();
  const currentWalletData = walletApiResult.currentData?.bonusAmount;

  const { data: wallet } = useWalletQuery(undefined, {
    skip: !loggedIn,
    pollingInterval: currentWalletData === null ? 2000 : undefined,
  });
  const walletBallance = wallet?.bonusAmount ?? "--";

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
          className={cn(
            "flex flex-col lg:flex-row items-center gap-3 relative",
            isTransitioning && "opacity-60"
          )}
        >
          <Image
            priority
            src={AvatarImage}
            alt="Placeholder image for user avatar"
            className="w-10 h-10"
          />
          <Icon
            color="white"
            name="account/settings-2-fill.svg"
            className="absolute top-6 left-10 lg:left-7"
          />
          <span>
            <span
              className={clsx(
                "transition-all duration-300",
                isUserDataLoading ? "max-w-0" : "max-w-xs"
              )}
            >
              {userData?.name || ""}
            </span>
            <br />
            <Coin />{" "}
            <span className="text-pink font-semibold">{walletBallance}</span>
          </span>
          <div
            className={cn(
              "h-[6px] w-full absolute -bottom-2",
              isTransitioning && "animate-pulse-fast bg-slate-500"
            )}
          />
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
