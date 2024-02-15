import React from "react";
import clsx from "clsx";
import { LogoutNavItem, NavItem } from "./AccountNavItem";
import { Pathname } from "@/utils/useAppRouter";

export interface AccountNavItem {
  text: string;
  href: Pathname;
  target?: "_blank";
  iconSource: string;
}

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  {
    text: "Личные данные",
    href: "/account/personal-details",
    iconSource: "account/account-circle-line.svg",
  },
  {
    text: "Мои покупки",
    href: "/account/purchases",
    iconSource: "account/bank-line.svg",
  },
  {
    text: "Уведомления",
    href: "/account/notifications",
    iconSource: "account/notification-3-line.svg",
  },
  {
    text: "Поддержка",
    href: "/account/support",
    iconSource: "account/question-line.svg",
  },
];

export function AccountNavigation({
  isTablet = false,
}: {
  isTablet?: boolean;
}) {
  return (
    <nav
      className={clsx(
        "flex flex-col flex-grow gap-4",
        isTablet && "w-full max-w-lg"
      )}
    >
      <NavItem isTablet={isTablet} {...ACCOUNT_NAV_ITEMS[0]} />
      <NavItem isTablet={isTablet} {...ACCOUNT_NAV_ITEMS[1]} />
      <NavItem isTablet={isTablet} {...ACCOUNT_NAV_ITEMS[2]} />
      <NavItem isTablet={isTablet} {...ACCOUNT_NAV_ITEMS[3]} />
      <LogoutNavItem isTablet={isTablet} />
    </nav>
  );
}
