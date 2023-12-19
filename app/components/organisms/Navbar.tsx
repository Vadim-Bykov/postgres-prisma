import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      <h1 className="text-3xl font-semibold">PRO IT SCHOOL</h1>

      <nav
        className={clsx([
          "flex grow justify-center items-center gap-x-10 mx-10 h-full",
          "lg:gap-x-16 xl:gap-x-32 xl:mx-20",
        ])}
      >
        {navbarItems.map(({ route, title }) => (
          <NavbarItem
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

function NavbarItem({
  route,
  title,
  isActive,
}: {
  route: string;
  title: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={route}
      className={clsx(["relative min-w-fit h-full"])}
      scroll={false}
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
