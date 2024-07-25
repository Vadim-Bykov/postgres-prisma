import clsx from "clsx";
import Link from "next/link";
import React from "react";

export function NavItem({
  route,
  title,
  isActive,
  onClick,
}: {
  route: string;
  title: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={route}
      className="relative min-w-fit h-full font-head"
      onClick={onClick}
    >
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
