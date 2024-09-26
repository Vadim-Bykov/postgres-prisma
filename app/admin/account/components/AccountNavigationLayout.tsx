"use client";

import AvatarImage from "@/public/icons/avatar.svg";
import { useAppSelector } from "@/store/store";
import { useAuthorizedRoute } from "@/utils/authorization";
import clsx from "clsx";
import Image from "next/image";
import { PropsWithChildren } from "react";
import { AccountNavigation } from "./AccountNavigation";
import { MobileHeader } from "./MobileHeader";
import { useWalletQuery } from "@/store/features/api/subApi/wallet";
import { Coin } from "@/public/icons/Coin";

export function AccountNavigationLayout({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  useAuthorizedRoute();
  const { userData } = useAppSelector((state) => state.user);
  const userName = userData?.name ?? "";
  const userEmail = userData?.email ?? "";
  const { data: wallet } = useWalletQuery();
  const walletBallance = wallet?.bonusAmount ?? "--";

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-68px-112px)] lg:min-h-[calc(100vh-88px-80px)]">
      <section
        className={clsx(
          "hidden lg:flex flex-col items-center min-w-[364px] pt-20 mb-20",
          "lg:border-r border-r-[#EFEDF4]"
        )}
      >
        <div className="mb-12 flex flex-col items-center">
          <div className="w-fit mb-4">
            <Image
              priority
              src={AvatarImage}
              alt="Placeholder image for user avatar"
              className="w-24 h-24"
            />
          </div>
          <h1 className="font-head text-2xl font-semibold">{userName}</h1>
          <p className="text-sm">{userEmail}</p>
          <p>
            Бонусы: <Coin />{" "}
            <span className="text-pink font-semibold">{walletBallance}</span>
          </p>
        </div>

        <AccountNavigation />
      </section>

      <MobileHeader />
      <section
        className={clsx("w-full flex flex-col items-center p-5", className)}
      >
        {children}
      </section>
    </div>
  );
}
