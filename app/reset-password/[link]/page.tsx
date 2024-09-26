"use client";

import Button from "@/app/_components/common/Button/Button";
import { Modal } from "@/app/_components/Modal/Modal";
import { useResetPasswordLinkQuery } from "@/store/features/api/subApi/resetPasswordApi";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function ResetPasswordPage({
  params,
}: {
  params: { link: string };
}) {
  const [open, setOpen] = useState(false);
  const { push } = useRouter();
  const { isSuccess, isError } = useResetPasswordLinkQuery({
    link: params.link,
  });

  const goHome = useCallback(() => {
    setOpen(false);
    push("/");
  }, [push]);

  useEffect(() => {
    if (isSuccess) {
      setOpen(true);
    } else if (isError) {
      goHome();
    }
  }, [isSuccess, goHome, isError]);

  return (
    <div className="min-h-[calc(100vh-68px-112px)] lg:min-h-[calc(100vh-88px-80px)]">
      <Modal
        className={{
          base: clsx(
            "p-10 lg:p-20 sm:w-[390px]",
            "w-[70%] box-content overflow-hidden"
          ),
        }}
        open={open}
        withCloseIcon
        onAfterClose={goHome}
        onRequestClose={goHome}
      >
        <div className="flex flex-col basis-full gap-6 w-ful">
          <div>
            <h1 className="font-head text-3xl font-semibold mb-2">
              Мы сбросили ваш пароль.
            </h1>
            <p>Войдите в аккаунт с паролем, который выслан на почту.</p>
          </div>
          <Button size="large" onClick={goHome}>
            Понял
          </Button>
        </div>
      </Modal>
    </div>
  );
}
