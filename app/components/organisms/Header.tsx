import { appApi } from "@/store/features/api/appApi";
import { useAuthenticationQuery } from "@/store/features/api/subApi/userApi";
import { Pathname, useAppPathname } from "@/utils/useAppRouter";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { MobileMenu } from "./MobileMenu/MobileMenu";
import { Navbar } from "./Navbar";

export interface NavbarItem {
  route: Pathname;
  title: string;
  authenticationRequired: boolean;
}

const NAVBAR_ITEMS: NavbarItem[] = [
  {
    route: "/",
    title: "Главная",
    authenticationRequired: false,
  },
  {
    route: "/consultation",
    title: "Консультации",
    authenticationRequired: false,
  },
  {
    route: "/article",
    title: "Статьи",
    authenticationRequired: false,
  },
  // {
  //   route: "/account",
  //   title: "Мой аккаунт",
  //   authenticationRequired: true,
  // },
  // {
  //   route: "/admin",
  //   title: "Admin",
  //   authenticationRequired: true,
  // },
];

export function Header({}) {
  const [animation, runAnimation] = useState(false);
  const pathname = useAppPathname();

  useEffect(() => {
    runAnimation(true);
  }, [pathname]);

  const { data: userData } = useAuthenticationQuery();

  const [trigger, { data: location }] =
    appApi.endpoints.getLocation.useLazyQuery();

  useEffect(() => {
    if (!!userData && (!userData.user?.location || !userData.auth)) {
      trigger();
    }
  }, [userData, trigger]);

  const loggedIn = !!userData?.auth;

  const filteredNavbarItems = loggedIn
    ? NAVBAR_ITEMS
    : NAVBAR_ITEMS.filter(({ authenticationRequired, route }) => {
        return (
          !authenticationRequired ||
          (route === "/admin" && userData?.user?.role === "ADMIN")
        );
      });

  return (
    <>
      <header
        className={clsx(
          "relative bg-primary flex flex-col text-white px-5 lg:px-20 duration-[3000ms] ease-in-out transition-opacity h-[68px] lg:h-auto",
          animation ? "opacity-100" : "opacity-70"
        )}
      >
        <MobileMenu navbarItems={filteredNavbarItems} />

        <Navbar
          className={clsx(
            "-translate-y-20 duration-700 ease-in-out transition-transform",
            animation && "translate-y-[0]"
          )}
          navbarItems={filteredNavbarItems}
        />
      </header>
    </>
  );
}
