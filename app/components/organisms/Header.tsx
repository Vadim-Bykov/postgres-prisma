import { useGetLocationQuery } from "@/store/features/api/appApi";
import { useAuthenticationQuery } from "@/store/features/api/subApi/userApi";
import { Pathname, useAppPathname } from "@/utils/useAppRouter";
import { useEffect, useState } from "react";

import { useAppSelector } from "@/store/store";
import { useIsLoggedIn } from "@/utils/authorization";
import { useWindowDimensions } from "@/utils/useWindowDimensions";
import dynamic from "next/dynamic";
import { cn } from "@/utils/css";

const Navbar = dynamic(() => import("./Navbar").then((mod) => mod.Navbar), {
  ssr: false,
});
const MobileMenu = dynamic(
  () => import("./MobileMenu/MobileMenu").then((mod) => mod.MobileMenu),
  { ssr: false }
);

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
  const { isTablet } = useWindowDimensions();

  useEffect(() => {
    runAnimation(true);
  }, [pathname]);

  useAuthenticationQuery();
  useGetLocationQuery();

  const userData = useAppSelector((state) => state.user.userData);
  const loggedIn = useIsLoggedIn();

  const filteredNavbarItems = loggedIn
    ? NAVBAR_ITEMS
    : NAVBAR_ITEMS.filter(({ authenticationRequired, route }) => {
        return (
          !authenticationRequired ||
          (route === "/admin" && userData?.role === "ADMIN")
        );
      });
  return (
    <>
      <header
        className={cn(
          "relative bg-primary flex flex-col text-white px-5 lg:px-20 h-[68px] lg:h-auto",
          "ease-in-out transition-opacity duration-1000 opacity-70",
          animation && "opacity-100"
        )}
      >
        {isTablet ? (
          <MobileMenu navbarItems={filteredNavbarItems} />
        ) : (
          <Navbar
            className={cn(
              "-translate-y-20 duration-700 ease-in-out transition-transform",
              animation && "translate-y-[0]"
            )}
            navbarItems={filteredNavbarItems}
          />
        )}
      </header>
    </>
  );
}
