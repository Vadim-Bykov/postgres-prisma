import clsx from "clsx";
import { usePathname } from "next/navigation";
import { NavItem } from "../../molecules/header/NavItem";
import { NavbarItem, Pathname } from "../Header";

export function MobileNavbar({
  navbarItems,
  onNavItemClick,
}: {
  navbarItems: NavbarItem[];
  onNavItemClick: () => void;
}) {
  // @ts-ignore
  const pathname: Pathname = usePathname();

  return (
    <nav className={clsx(["flex flex-col items-center gap-y-8"])}>
      {navbarItems.map(({ route, title }) => (
        <NavItem
          key={route}
          route={route}
          title={title}
          isActive={pathname === route}
          onClick={onNavItemClick}
        />
      ))}
    </nav>
  );
}
