import React from "react";
import clsx from "clsx";
import { LogoutNavItem, NavItem } from "./AccountNavItem";
import { Pathname, useAppPathname } from "@/utils/useAppRouter";

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
    text: "Друзья",
    href: "/account/friends",
    iconSource: "account/friends.svg",
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
  const pathname = useAppPathname();

  return (
    <nav
      className={clsx("flex flex-col flex-grow", isTablet && "w-full max-w-lg")}
    >
      <NavItem
        isTablet={isTablet}
        {...ACCOUNT_NAV_ITEMS[0]}
        isActive={pathname === ACCOUNT_NAV_ITEMS[0].href}
      />
      <NavItem
        isTablet={isTablet}
        {...ACCOUNT_NAV_ITEMS[1]}
        isActive={pathname === ACCOUNT_NAV_ITEMS[1].href}
      />
      <NavItem
        isTablet={isTablet}
        {...ACCOUNT_NAV_ITEMS[2]}
        isActive={pathname === ACCOUNT_NAV_ITEMS[2].href}
      />
      <NavItem
        isTablet={isTablet}
        {...ACCOUNT_NAV_ITEMS[3]}
        isActive={pathname === ACCOUNT_NAV_ITEMS[3].href}
      />
      <NavItem
        isTablet={isTablet}
        {...ACCOUNT_NAV_ITEMS[4]}
        isActive={pathname === ACCOUNT_NAV_ITEMS[4].href}
      />
      <LogoutNavItem isTablet={isTablet} />
    </nav>
  );
}
