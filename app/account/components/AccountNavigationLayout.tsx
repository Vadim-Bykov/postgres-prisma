"use client";

import AvatarImage from "@/public/icons/avatar.svg";
import { useAppSelector } from "@/store/store";
import { useAuthorizedRoute } from "@/utils/authorization";
import clsx from "clsx";
import Image from "next/image";
import { PropsWithChildren } from "react";
import { LogoutNavItem, NavItem } from "./AccountNavItem";
import { MobileHeader } from "./MobileHeader";
import { Pathname } from "@/utils/useAppRouter";

export interface AccountNavItem {
  id: number;
  text: string;
  route?: Pathname;
  iconSource: string;
}

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  {
    id: 1,
    text: "Личные данные",
    route: "/account/personal-details",
    iconSource: "account/account-circle-line.svg",
  },
  {
    id: 2,
    text: "Мои покупки",
    route: "/account/purchases",
    iconSource: "account/bank-line.svg",
  },
  {
    id: 3,
    text: "Уведомления",
    route: "/account/notifications",
    iconSource: "account/notification-3-line.svg",
  },
  {
    id: 4,
    text: "Поддержка",
    route: "/account/support",
    iconSource: "account/question-line.svg",
  },
  {
    id: 5,
    text: "Выйти из аккаунта",
    iconSource: "account/logout-box-r-line.svg",
  },
];

export function AccountNavigationLayout({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  useAuthorizedRoute();
  const { userData } = useAppSelector((state) => state.user);
  const userName = userData?.name ?? "";
  const userEmail = userData?.email ?? "";

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
              alt="Placeholder image for user avatar depicting an piñata Max mascot"
              className="w-24 h-24"
            />
          </div>
          <h1 className="text-2xl font-semibold font-serif">{userName}</h1>
          <p className="text-sm">{userEmail}</p>
        </div>
        <nav className="flex flex-col flex-grow gap-4">
          {ACCOUNT_NAV_ITEMS.map((navItem) => {
            const { id, route } = navItem;
            return route ? (
              <NavItem key={id} {...navItem} />
            ) : (
              <LogoutNavItem key={id} {...navItem} />
            );
          })}
        </nav>
      </section>

      <MobileHeader />
      <section className={clsx("flex-grow", className)}>{children}</section>
    </div>
  );
}
