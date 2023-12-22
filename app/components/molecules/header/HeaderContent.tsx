import Image from "next/image";
import React from "react";
import Button from "../../atoms/common/Button";
import clsx from "clsx";

export function HeaderContent({
  runAnimation,
  className,
}: {
  runAnimation: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "self-center flex flex-col md:flex-row items-center max-w-7xl gap-5 md:gap-10 transition-height pt-[68px] md:pt-0 overflow-y-hidden",
        runAnimation ? "h-[calc(100vh-68px)]" : "h-[0vh]",
        className
      )}
    >
      <div
        className={clsx(
          "basis-1/2 flex flex-col grow items-start justify-center duration-700 ease-in-out transition-transform mt-5 md:mt-0",
          runAnimation ? "translate-x-[0]" : "-translate-x-[200%]"
        )}
      >
        <h1 className="hidden md:inline-block text-6xl font-semibold mb-5">
          АСТРО
          <br />
          консультации
        </h1>
        <p className="md:text-xl mb-5 md:mb-12">
          Заказать полный пакет со скидкой 20%
        </p>
        <Button>Заказать со скидкой 20%</Button>
      </div>

      <div
        className={clsx(
          "basis-1/2 duration-700 ease-in-out transition-transform",
          runAnimation ? "translate-x-[0]" : "translate-x-[150%]"
        )}
      >
        <Image
          src={require("@/public/header.png")}
          priority
          className="w-auto"
          alt="Header image"
        />
      </div>
    </div>
  );
}
