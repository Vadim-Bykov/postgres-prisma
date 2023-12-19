import { appApi } from "@/store/features/api/appApi";
import { useAuthenticationQuery } from "@/store/features/api/subApi/userApi";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HeaderContent } from "../molecules/header/HeaderContent";
import { MobileMenu } from "./MobileMenu/MobileMenu";
import { Navbar } from "./Navbar";

export type Pathname = "/" | "/course" | "/admin" | "/account";

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
    route: "/course",
    title: "Курсы",
    authenticationRequired: false,
  },
  {
    route: "/account",
    title: "Мой аккаунт",
    authenticationRequired: true,
  },
  {
    route: "/admin",
    title: "Admin",
    authenticationRequired: true,
  },
];

export function Header({}) {
  const [animation, runAnimation] = useState(false);
  // @ts-ignore
  const pathname: Pathname = usePathname();

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
          (route === "/admin" && userData?.user?.roles === "ADMIN")
        );
      });

  return (
    <>
      <header
        className={clsx(
          "bg-zinc-950 flex flex-col text-white px-5 md:px-20 duration-[3000ms] ease-in-out transition-opacity",
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

        <HeaderContent runAnimation={pathname === "/" && animation} />
      </header>
    </>
  );
}
