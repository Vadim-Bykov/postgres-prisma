import clsx from "clsx";
import { useEffect, useState } from "react";
import { MobileNavbar } from "./MobileNavbar";
import { UserBadge } from "../../molecules/header/UserBadge";
import { BurgerMenuButton } from "./BurgerMenuButton";
import { NavbarItem } from "../Header";
import { useAppPathname } from "@/utils/useAppRouter";

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
        "absolute md:hidden left-0 top-0 right-0 z-20 flex flex-col bg-primary h-screen max-w-md",
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
      <div className="absolute w-[calc(100vw-20px)] h-[68px] flex justify-between items-center text-center gap-5 px-5">
        <BurgerMenuButton isOpen={isOpen} onClick={toggleMenu} />

        <h1 className="text-3xl font-semibold">АСТРО</h1>
      </div>

      <section
        className={clsx(
          "flex flex-col grow items-center justify-center gap-y-6 overflow-hidden transition-opacity z-10",
          !isOpen && "opacity-0",
          BURGER_TRANSITION_CLASSNAMES
        )}
      >
        <UserBadge onLoginLogoutClick={toggleMenu} className="mb-10" />

        <MobileNavbar navbarItems={navbarItems} onNavItemClick={toggleMenu} />
      </section>
    </menu>
  );
}
