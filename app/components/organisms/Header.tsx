import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../atoms/common/Button";
import { Navbar } from "./Navbar";
import { HeaderContent } from "../molecules/header/HeaderContent";

export function Header() {
  const [animation, runAnimation] = useState(false);

  useEffect(() => {
    runAnimation(true);
  }, []);

  return (
    <header
      className={clsx(
        "bg-zinc-950 flex flex-col text-white px-20 duration-[3000ms] ease-in-out transition-opacity",
        animation ? "opacity-100" : "opacity-70"
      )}
    >
      <Navbar
        className={clsx(
          "-translate-y-20 duration-700 ease-in-out transition-transform",
          animation && "translate-y-[0]"
        )}
      />

      <HeaderContent runAnimation={animation} />
    </header>
  );
}
