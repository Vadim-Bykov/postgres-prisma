import React from "react";
import {
  EMAIL_ADDRESS,
  INSTAGRAM_ACCOUNT,
  TELEGRAM_ACCOUNT,
} from "@/app/constants/socialConnections";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

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

export function ContactLinks({ className }: { className?: string }) {
  return (
    <div className={clsx(className)}>
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
  );
}
