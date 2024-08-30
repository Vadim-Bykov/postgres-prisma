import { useAppPathname } from "@/utils/useAppRouter";
import clsx from "clsx";
import { NavItem } from "../../molecules/header/NavItem";
import { NavbarItem } from "../Header";

export function MobileNavbar({
  navbarItems,
  onNavItemClick,
}: {
  navbarItems: NavbarItem[];
  onNavItemClick?: () => void;
}) {
  const pathname = useAppPathname();
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
