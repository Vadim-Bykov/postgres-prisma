import { BRAND_NAME } from "@/app/constants/brand";
import Image from "next/image";
import { ContactLinks } from "./ContactLinks";
import { Coin } from "@/public/icons/Coin";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="flex flex-grow flex-col lg:flex-row items-center justify-center gap-2 bg-primary px-10 ld:px-20 py-2 lg:py-5">
      <div className="basis-1/3 flex flex-row-reverse lg:flex-row items-center gap-2">
        <Image
          src={require("@/public/lion.svg")}
          className="w-11 h-10"
          alt="Lion image"
        />
        <h3 className="text-3xl text-white">{BRAND_NAME}</h3>
      </div>

      <ContactLinks className="basis-1/3 flex flex-grow justify-center gap-3 lg:gap-8" />

      <Link
        href="/bonus-program"
        className="basis-1/3 font-head text-white flex flex-grow justify-end items-center"
      >
        <span>
          Бонусная программа&nbsp;
          <Coin size={32} />
        </span>
      </Link>
    </footer>
  );
}
