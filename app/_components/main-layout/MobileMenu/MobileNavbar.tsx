import { NavItem } from "@/app/_components/main-layout/header/NavItem";
import { useAppPathname } from "@/utils/useAppRouter";
import clsx from "clsx";
import { NavbarItem } from "../../main-layout/Header";

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
