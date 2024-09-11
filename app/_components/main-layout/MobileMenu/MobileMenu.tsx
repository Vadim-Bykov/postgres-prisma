import { BRAND_NAME } from "@/app/constants/brand";
import { useAppPathname } from "@/utils/useAppRouter";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NavbarItem } from "../../main-layout/Header";
import { BurgerMenuButton } from "./BurgerMenuButton";
import { MobileNavbar } from "./MobileNavbar";
import { UserBadge } from "../../main-layout/header/UserBadge";

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

        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-3xl text-white">{BRAND_NAME}</h1>
          <Image
            src={require("@/public/lion.svg")}
            className="w-11 h-10"
            alt="Lion image"
          />
        </Link>
      </div>

      <section
        className={clsx(
          "flex flex-col grow items-center justify-center gap-y-6 overflow-hidden transition-opacity z-10",
          isOpen ? "opacity-100" : "opacity-0",
          BURGER_TRANSITION_CLASSNAMES
        )}
      >
        <UserBadge className="mb-10" />

        <MobileNavbar navbarItems={navbarItems} />
      </section>
    </menu>
  );
}
