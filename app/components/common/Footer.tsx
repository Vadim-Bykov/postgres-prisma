import Image from "next/image";
import Link from "next/link";

const CONTACT_LINKS = [
  {
    name: "telegram",
    logo: require("@/public/images/email/telegram.webp"),
    href: "https://t.me/bvntaev",
  },
  {
    name: "instagram",
    logo: require("@/public/images/email/instagram.png"),
    href: "https://www.instagram.com/",
  },
  {
    name: "email",
    logo: require("@/public/images/email/email.png"),
    href: "mailto:vadya1981@yandex.by",
  },
];

export function Footer() {
  return (
    <div className="flex flex-grow justify-center gap-5 md:gap-8 p-10 bg-primary">
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
