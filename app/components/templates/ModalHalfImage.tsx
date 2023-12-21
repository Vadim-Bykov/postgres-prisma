import { PropsWithChildren } from "react";
import clsx from "clsx";
import Image from "next/image";
import EyecatchImage from "@/public/images/login/eyecatch.png";
import { Modal, ModalProps } from "../common/Modal/Modal";

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
      <div className={clsx("bg-yellow", "w-full", "md:w-[45%]")}>
        <Image
          src={EyecatchImage}
          alt="Woman in a red sweater surrounded by flying reward providers logos"
          className={clsx("w-full h-64 object-cover", "md:h-full")}
        />
      </div>
      <div
        className={clsx(
          "w-full p-5",
          "md:w-[55%] md:py-14 md:px-10",
          "lg:py-28 lg:px-20"
        )}
      >
        {children}
      </div>
    </Modal>
  );
}
