import Image from "next/image";
import React from "react";
import Button from "../../atoms/common/Button";
import clsx from "clsx";

export function HeaderContent({ runAnimation }: { runAnimation: boolean }) {
  return (
    <div className="self-center flex items-center max-w-7xl gap-10">
      <div
        className={clsx(
          "basis-1/2  duration-700 ease-in-out transition-transform",
          runAnimation ? "translate-x-[0]" : "-translate-x-[200%]"
        )}
      >
        <h1 className="text-6xl font-semibold mb-5">PRO IT SCHOOL</h1>
        <p className="text-xl mb-12">
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
