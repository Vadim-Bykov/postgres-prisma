import clsx from "clsx";
import { useEffect, useState } from "react";
import { MobileNavbar } from "./MobileNavbar";
import { UserBadge } from "../../molecules/header/UserBadge";
import { BurgerMenuButton } from "./BurgerMenuButton";
import { NavbarItem } from "../Header";

export const BURGER_TRANSITION_CLASSNAMES = "ease-in duration-300";

export function MobileMenu({ navbarItems }: { navbarItems: NavbarItem[] }) {
  const [isOpen, setOpen] = useState(false);

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
        "absolute md:hidden left-0 top-0 right-0 z-20 flex flex-col bg-zinc-950 ",
        "transition-height",
        BURGER_TRANSITION_CLASSNAMES,
        isOpen ? "h-full" : "h-[96px]"
      )}
    >
      <div className="flex justify-between items-center text-center gap-5 pt-5 px-5">
        <BurgerMenuButton isOpen={isOpen} onClick={toggleMenu} />

        <h1 className="text-3xl font-semibold">PRO IT SCHOOL</h1>
      </div>

      <section
        className={clsx(
          "flex flex-col grow items-center justify-center gap-y-6 overflow-hidden transition-opacity",
          !isOpen && "opacity-0",
          BURGER_TRANSITION_CLASSNAMES
        )}
      >
        <UserBadge onLoginLogoutClick={toggleMenu} />

        <MobileNavbar navbarItems={navbarItems} onNavItemClick={toggleMenu} />
      </section>
    </menu>
  );
}
