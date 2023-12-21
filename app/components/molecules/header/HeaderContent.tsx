import Image from "next/image";
import React from "react";
import Button from "../../atoms/common/Button";
import clsx from "clsx";

export function HeaderContent({ runAnimation }: { runAnimation: boolean }) {
  return (
    <div
      className={clsx(
        "self-center flex flex-col md:flex-row items-center max-w-7xl gap-5 md:gap-10 transition-height pt-[68px] md:pt-0 overflow-hidden",
        runAnimation ? "h-[100vh]" : "h-[0vh]"
      )}
    >
      <div
        className={clsx(
          "basis-1/2  duration-700 ease-in-out transition-transform",
          runAnimation ? "translate-x-[0]" : "-translate-x-[200%]"
        )}
      >
        <h1 className="hidden md:inline-block text-6xl font-semibold mb-5">
          PRO IT SCHOOL
        </h1>
        <p className="md:text-xl mb-12">
          Курсы повышения квалификации по робототехнике для педагогов начальной
          школы
        </p>
        <Button>Записаться на курс</Button>
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
