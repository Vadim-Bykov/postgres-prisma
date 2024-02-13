import clsx from "clsx";
import { useEffect, useState } from "react";
import { MobileNavbar } from "./MobileNavbar";
import { UserBadge } from "../../molecules/header/UserBadge";
import { BurgerMenuButton } from "./BurgerMenuButton";
import { NavbarItem } from "../Header";
import { useAppPathname } from "@/utils/useAppRouter";
import { BRAND_NAME } from "@/app/constants/brand";
import Image from "next/image";

export const BURGER_TRANSITION_CLASSNAMES = "ease-in duration-300";

export function MobileMenu({ navbarItems }: { navbarItems: NavbarItem[] }) {
  const [isOpen, setOpen] = useState(false);
  const pathname = useAppPathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = isOpen ? "hidden" : "auto";
    }
  }, [isOpen]);

  return (
    <menu
      className={clsx(
        "absolute lg:hidden left-0 top-0 right-0 z-20 flex flex-col bg-primary h-screen max-w-md",
        "transition-width",
        BURGER_TRANSITION_CLASSNAMES,
        isOpen ? "w-full" : "w-[0px]"
      )}
    >
      <div
        className={clsx(
          "absolute left-0 top-0 w-[calc(100vw-20px)] z-0",
          isOpen ? "h-screen" : "h-0"
        )}
        onClick={isOpen ? toggleMenu : undefined}
      />
      <div className="absolute w-[calc(100vw-20px)] h-[68px] flex justify-between items-center text-center gap-5 pl-5">
        <BurgerMenuButton isOpen={isOpen} onClick={toggleMenu} />

        <div className="flex items-center gap-2">
          <h1 className="text-3xl">{BRAND_NAME}</h1>
          <Image
            src={require("@/public/lion.svg")}
            className="w-11 h-10"
            alt="Lion image"
          />
        </div>
      </div>

      <section
        className={clsx(
          "flex flex-col grow items-center justify-center gap-y-6 overflow-hidden transition-opacity z-10",
          !isOpen && "opacity-0",
          BURGER_TRANSITION_CLASSNAMES
        )}
      >
        <UserBadge onAvatarLogoClick={toggleMenu} className="mb-10" />

        <MobileNavbar navbarItems={navbarItems} onNavItemClick={toggleMenu} />
      </section>
    </menu>
  );
}
