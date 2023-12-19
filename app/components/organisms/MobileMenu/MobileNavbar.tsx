import { appApi } from "@/store/features/api/appApi";
import { useAuthenticationQuery } from "@/store/features/api/subApi/userApi";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavbarItem, Pathname } from "../Header";

export function MobileNavbar({
  navbarItems,
  onNavItemClick,
}: {
  navbarItems: NavbarItem[];
  onNavItemClick: () => void;
}) {
  const { data: userData } = useAuthenticationQuery();

  const [trigger, { data: location }] =
    appApi.endpoints.getLocation.useLazyQuery();

  // @ts-ignore
  const pathname: Pathname = usePathname();

  return (
    <nav className={clsx(["flex flex-col items-center gap-y-8"])}>
      {navbarItems.map(({ route, title }) => (
        <NavbarItem
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

function NavbarItem({
  route,
  title,
  isActive,
  onClick,
}: {
  route: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={route}
      className={clsx(["relative min-w-fit h-full"])}
      scroll={false}
      onClick={onClick}
    >
      <div
        className={clsx(
          "bg-red w-full h-[6px] absolute -top-2 transition duration-300 scale-0 opacity-100",
          isActive && " scale-100"
        )}
      />
      <span className="text-xl">{title}</span>
    </Link>
  );
}
