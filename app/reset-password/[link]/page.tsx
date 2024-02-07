"use client";

import Button from "@/app/components/atoms/common/Button";
import { Modal } from "@/app/components/common/Modal/Modal";
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
          <h1 className="text-3xl font-semibold mb-2">
            We have reset your password.
          </h1>
          <p>Login with the password in the email.</p>
        </div>
        <Button size="large" onClick={goHome}>
          Okay!
        </Button>
      </div>
    </Modal>
  );
}
