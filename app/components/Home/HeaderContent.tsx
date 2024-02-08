import { BRAND_NAME } from "@/app/constants/brand";
import { useAppRouter } from "@/utils/useAppRouter";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";

export function HeaderContent({ className }: { className?: string }) {
  const [runAnimation, setAnimation] = useState(false);
  const { push } = useAppRouter();

  useEffect(() => {
    setAnimation(true);
  }, []);

  return (
    <section
      className={clsx(
        "relative bg-primary flex flex-col text-white px-5 lg:px-20 duration-[3000ms] ease-in-out transition-opacity overflow-y-hidden",
        runAnimation ? "opacity-100" : "opacity-70"
      )}
    >
      <div
        className={clsx(
          "bg-primary text-white self-center flex flex-col lg:flex-row items-center max-w-7xl gap-5 lg:gap-10 transition-height",
          runAnimation
            ? "min-h-[calc(100vh-68px)] lg:min-h-[calc(100vh-88px)]"
            : "min-h-[0vh]",
          className
        )}
      >
        <div
          className={clsx(
            "w-full basis-1/2 flex flex-col grow items-start justify-center duration-700 ease-in-out transition-transform mt-5 lg:mt-0 ",
            runAnimation ? "translate-x-[0]" : "-translate-x-[200%]"
          )}
        >
          <div className="flex lg:flex-col items-center gap-5">
            <Image
              src={require("@/public/lion.svg")}
              className="w-28 h-28 lg:w-72 lg:h-72"
              alt="Lion image"
            />
            <h1 className="text-3xl lg:text-6xl  mb-5">{BRAND_NAME}</h1>
          </div>
        </div>

        <div
          className={clsx(
            "basis-1/2 duration-700 ease-in-out transition-transform",
            runAnimation ? "translate-x-[0]" : "translate-x-[200%]"
          )}
        >
          <Image
            src={require("@/public/header.jpeg")}
            priority
            className="w-auto max-h-screen"
            alt="Header image"
          />
        </div>
      </div>
    </section>
  );
}
