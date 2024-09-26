"use client";

import Button from "@/app/_components/common/Button/Button";
import { Form } from "@/app/_components/common/Form";
import { ToggleInput } from "@/app/_components/common/input/ToggleInput";
import { ErrorMessage } from "@/app/_components/ErrorMessage";
import { useUpdateUserPersonalDataMutation } from "@/store/features/api/subApi/userApi";
import { useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  emailNotification?: boolean;
};

interface Params extends FormValues {
  userDataEmailNotification?: boolean;
}

const isPersonalDetailsChanged = ({
  emailNotification,
  userDataEmailNotification,
}: Params) => {
  if (emailNotification === userDataEmailNotification) {
    return false;
  }

  return true;
};

export function Notifications() {
  const { register, handleSubmit, reset, watch } = useForm<FormValues>();

  const [formError, setFormError] = useState("");
  const [showFormError, setShowFormError] = useState(false);

  const [updateUserPersonalData, { isLoading: isUserCreating, error }] =
    useUpdateUserPersonalDataMutation();

  const userData = useAppSelector((state) => state.user.userData);
  const emailNotification = watch(
    "emailNotification",
    userData?.emailNotification
  );

  useEffect(() => {
    if (userData) {
      const { emailNotification } = userData;
      reset({ emailNotification });
    }
  }, [reset, userData]);

  const onSubmit = handleSubmit(async ({ emailNotification }) => {
    if (
      !isPersonalDetailsChanged({
        emailNotification,
        userDataEmailNotification: userData?.emailNotification,
      })
    ) {
      setShowFormError(true);
      setFormError("Никакие данные не были изменены");
      return;
    }

    try {
      await updateUserPersonalData({ emailNotification }).unwrap();
    } catch (error: any) {
      if (typeof error?.data?.message === "string") {
        setFormError(error?.data?.message);
        setShowFormError(true);
      }
    }
  });
  return (
    <div className="w-full max-w-[450px] flex flex-col gap-6">
      <h2 className="text-2xl font-head font-semibold ">
        Здесь вы можете управлять отправкой имэйл оповещений на{" "}
        {userData ? userData.email : "твою электронную почту"}
      </h2>
      {userData && (
        <p className="text-sm self-start">
          Сейчас вы {userData.emailNotification ? "" : "не"} получаете
          уведомления c различной интересной информацией и новостями на вашу
          электронную почту
        </p>
      )}

      <Form
        autoComplete="off"
        preventSubmission={isUserCreating}
        onChange={() => setShowFormError(false)}
        onSubmit={onSubmit}
        className="flex flex-col gap-4 w-full"
      >
        <ToggleInput
          label={
            emailNotification
              ? "Отключить имэйл уведомления"
              : "Подключить имэйл уведомления"
          }
          name="emailNotification"
          register={register}
        />

        <ErrorMessage visible={showFormError}>{formError}</ErrorMessage>

        <Button
          type="submit"
          size="large"
          loading={isUserCreating}
          disabled={isUserCreating}
          className="w-full"
        >
          Обновить данные
        </Button>
      </Form>
    </div>
  );
}
