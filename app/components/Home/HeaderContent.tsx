import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../atoms/common/Button";
import { AuthenticationButton } from "../atoms/AuthenticationButton";
import { useAppRouter } from "@/utils/useAppRouter";

export function HeaderContent({ className }: { className?: string }) {
  const [runAnimation, setAnimation] = useState(false);
  const { push } = useAppRouter();

  useEffect(() => {
    setAnimation(true);
  }, []);

  const purchaseFullDiscountPackage = () => push("/purchase");

  return (
    <section
      className={clsx(
        "relative bg-primary flex flex-col text-white px-5 md:px-20 duration-[3000ms] ease-in-out transition-opacity overflow-y-hidden",
        runAnimation ? "opacity-100" : "opacity-70"
      )}
    >
      <div
        className={clsx(
          "bg-primary text-white self-center flex flex-col md:flex-row items-center max-w-7xl gap-5 md:gap-10 transition-height",
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
          <AuthenticationButton
            authenticationForActionRequired
            onClick={purchaseFullDiscountPackage}
          >
            Заказать со скидкой 20%
          </AuthenticationButton>
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
    </section>
  );
}
