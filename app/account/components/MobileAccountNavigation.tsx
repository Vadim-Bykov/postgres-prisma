import AvatarImage from "@/public/icons/avatar.svg";
import { useAppSelector } from "@/store/store";
import Image from "next/image";
import { LogoutNavItem, NavItem } from "./AccountNavItem";
import { ACCOUNT_NAV_ITEMS } from "./AccountNavigationLayout";
import { MobileHeader } from "./MobileHeader";

export function MobileAccountNavigation() {
  const { userData } = useAppSelector((state) => state.user);
  const userName = userData?.name ?? "";
  const userEmail = userData?.email ?? "";

  return (
    <section
      className={
        "min-h-[calc(100vh-68px-112px)] flex flex-col items-center px-8"
      }
    >
      <MobileHeader />

      <div className="mt-10 mb-14 flex flex-col items-center">
        <div className="relative mb-4">
          <Image
            priority
            src={AvatarImage}
            alt="Placeholder image for user avatar depicting an piñata Max mascot"
            className="w-24 h-24"
          />
        </div>
        <h1 className="text-2xl font-semibold font-serif">{userName}</h1>
        <p className="text-sm">{userEmail}</p>
      </div>
      <nav className="flex flex-col flex-grow gap-4 w-full max-w-lg">
        {ACCOUNT_NAV_ITEMS.map((navItem) => {
          const { id, route } = navItem;
          return route === "/" ? (
            <LogoutNavItem key={id} {...navItem} isTablet />
          ) : (
            <NavItem key={id} {...navItem} isTablet />
          );
        })}
      </nav>
    </section>
  );
}
