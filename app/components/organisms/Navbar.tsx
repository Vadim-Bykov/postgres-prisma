import clsx from "clsx";
import { usePathname } from "next/navigation";
import { NavItem } from "../molecules/header/NavItem";
import { UserBadge } from "../molecules/header/UserBadge";
import { NavbarItem, Pathname } from "./Header";

export function Navbar({
  navbarItems,
  className,
}: {
  navbarItems: NavbarItem[];
  className?: string;
}) {
  // @ts-ignore
  const pathname: Pathname = usePathname();

  return (
    <div
      className={clsx(
        "hidden md:flex flex-grow justify-between items-center py-5",
        className
      )}
    >
      <h1 className="text-3xl font-semibold">АСТРО</h1>

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
