import { useAppPathname } from "@/utils/useAppRouter";
import clsx from "clsx";
import { NavItem } from "../molecules/header/NavItem";
import { UserBadge } from "../molecules/header/UserBadge";
import { NavbarItem } from "./Header";
import { BRAND_NAME } from "@/app/constants/brand";

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
        "hidden md:flex flex-grow justify-between items-center py-5",
        className
      )}
    >
      <h1 className="text-3xl font-semibold">{BRAND_NAME}</h1>

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
