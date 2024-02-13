import { BRAND_NAME } from "@/app/constants/brand";
import {
  EMAIL_ADDRESS,
  INSTAGRAM_ACCOUNT,
  TELEGRAM_ACCOUNT,
} from "@/app/constants/socialConnections";
import Image from "next/image";
import Link from "next/link";

const CONTACT_LINKS = [
  {
    name: "telegram",
    logo: require("@/public/images/email/telegram.webp"),
    href: TELEGRAM_ACCOUNT,
  },
  {
    name: "instagram",
    logo: require("@/public/images/email/instagram.png"),
    href: INSTAGRAM_ACCOUNT,
  },
  {
    name: "email",
    logo: require("@/public/images/email/email.png"),
    href: `mailto:${EMAIL_ADDRESS}`,
  },
];

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
      <div className="basis-1/3 flex flex-grow justify-center gap-3 lg:gap-8">
        {CONTACT_LINKS.map(({ href, logo, name }) => {
          return (
            <Link target="_blank" href={href} key={name}>
              <Image
                priority
                height={40}
                width={40}
                src={logo}
                alt={`${logo} logo`}
              />
            </Link>
          );
        })}
      </div>

      <div className="basis-1/3 " />
    </footer>
  );
}
