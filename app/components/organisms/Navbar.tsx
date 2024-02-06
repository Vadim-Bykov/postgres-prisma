import { useAppPathname } from "@/utils/useAppRouter";
import clsx from "clsx";
import { NavItem } from "../molecules/header/NavItem";
import { UserBadge } from "../molecules/header/UserBadge";
import { NavbarItem } from "./Header";
import { BRAND_NAME } from "@/app/constants/brand";
import Image from "next/image";

export function Navbar({
  navbarItems,
  className,
}: {
  navbarItems: NavbarItem[];
  className?: string;
}) {
  const pathname = useAppPathname();

  return (
    <div
      className={clsx(
        "hidden lg:flex flex-grow justify-between items-center py-5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Image
          src={require("@/public/lion.svg")}
          className="w-14 h-12"
          alt="Lion image"
        />
        <h1 className="text-3xl">{BRAND_NAME}</h1>
      </div>

      <nav
        className={clsx([
          "flex grow justify-center items-center gap-x-10 mx-10 h-full",
          "lg:gap-x-16 xl:gap-x-32 xl:mx-20",
        ])}
      >
        {navbarItems.map(({ route, title }) => (
          <NavItem
            key={route}
            route={route}
            title={title}
            isActive={pathname === route}
          />
        ))}
      </nav>

      <UserBadge />
    </div>
  );
}
