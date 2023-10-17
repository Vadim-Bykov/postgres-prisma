import clsx from "clsx";
import styles from "./icon.module.css";
import { CSSProperties } from "react";
import open from "@/public/icons/eye-open.svg";
import Image from "next/image";

export type ColorVariant =
  | "purple-dark"
  | "purple-light"
  | "purple"
  | "white"
  | "pink"
  | "yellow"
  | "gray"
  | "red"
  | "green";

const colorVariants: Record<ColorVariant, string> = {
  "purple-dark": "bg-purple-dark",
  "purple-light": "bg-purple-light",
  purple: "bg-purple",
  white: "bg-white",
  pink: "bg-pink",
  yellow: "bg-yellow",
  gray: "bg-gray",
  red: "bg-red",
  green: "bg-[#02C57E]",
};

export type Props = {
  name: string;
  size?: number; // TODO: proper types
  color?: ColorVariant;
  inline?: boolean;
  className?: string;
  style?: CSSProperties;
};

// TODO: make this more accessible, refactor
export default function Icon({
  name,
  size = 18,
  color = "purple-dark",
  inline = false,
  className,
  style = {},
}: Props) {
  const iconPath = "@/public/icons/" + name;
  // console.log({ "colorVariants[color]": colorVariants[color] });

  return (
    <Image
      src={require("@/public/icons/" + name)}
      width={size}
      height={size}
      alt="icon"
      // style={{
      //   width: size,
      //   height: size,
      //   WebkitMaskImage: `url(${"@/public/icons/" + name})`,
      //   maskImage: `url(${"@/public/icons/" + name})`,
      //   ...style,
      // }}
      className={clsx(
        styles.icon,
        !inline && "block",
        inline && "inline-block",
        // colorVariants[color],
        // color,
        className
      )}
    />
  );
}
