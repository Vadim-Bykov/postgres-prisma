import { appApi } from "@/store/features/api/appApi";
import {
  useAuthenticationQuery,
  useLoginMutation,
  useLogoutMutation,
} from "@/store/features/api/subApi/userApi";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface NavbarItem {
  route: string;
  title: string;
  authenticationRequired: boolean;
}

export const NAVBAR_ITEMS: NavbarItem[] = [
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
    route: "/users",
    title: "Мой аккаунт",
    authenticationRequired: true,
  },
];

export function Navbar({ className }: { className?: string }) {
  const { data: userData, isLoading } = useAuthenticationQuery();
  const [login, { isLoading: isAuthorizing }] = useLoginMutation();
  const [logout, { isLoading: isLogouting }] = useLogoutMutation();
  const [trigger, { data: location }] =
    appApi.endpoints.getLocation.useLazyQuery();

  const pathname = usePathname();

  useEffect(() => {
    if (!!userData && (!userData.user?.location || !userData.auth)) {
      trigger();
    }
  }, [userData, trigger]);

  const sendUserData = () => {
    login({ email: "bvntaev@gmail.com", password: "Password!" });
  };

  const loggedIn = !!userData?.auth;

  const filteredNavbarItems = loggedIn
    ? NAVBAR_ITEMS
    : NAVBAR_ITEMS.filter(
        ({ authenticationRequired }) => !authenticationRequired
      );

  return (
    <div
      className={clsx(
        "flex flex-grow justify-between items-center pt-10",
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
        {filteredNavbarItems.map(({ route, title }) => (
          <NavbarItem
            key={route}
            route={route}
            title={title}
            isActive={
              route === "/" ? pathname === "/" : pathname.includes(route)
            }
          />
        ))}
      </nav>
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
    <Link href={route} className={clsx(["relative min-w-fit h-full"])}>
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
