import Lion from "@/public/lion.svg";
import clsx from "clsx";
import Image from "next/image";
import { PropsWithChildren } from "react";
import { Modal, ModalProps } from "./Modal";

export function ModalHalfImage({
  children,
  className,
  ...props
}: PropsWithChildren<ModalProps>) {
  return (
    <Modal
      className={{
        base: clsx(
          "overflow-hidden",
          "w-[90%] max-h-[99%]",
          "lg:w-[920px]",
          typeof className === "object" && className.base
        ),
      }}
      withCloseIcon
      {...props}
    >
      <div className={clsx("bg-yellow", "w-full", "lg:w-[45%] p-1")}>
        <Image
          src={Lion}
          alt="Woman in a red sweater surrounded by flying reward providers logos"
          className={clsx("w-full h-64 object-cover", "lg:h-full")}
        />
      </div>
      <div
        className={clsx(
          "w-full p-5",
          "lg:w-[55%] lg:py-14 lg:px-10",
          "lg:py-28 lg:px-20"
        )}
      >
        {children}
      </div>
    </Modal>
  );
}
