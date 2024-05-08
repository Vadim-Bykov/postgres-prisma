"use client";

import Button from "@/app/components/atoms/common/Button";
import { ErrorMessage } from "@/app/components/atoms/common/ErrorMessage";
import { Form } from "@/app/components/common/Form";
import { EmailInput } from "@/app/components/molecules/inputs/EmailInput";
import { NameInput } from "@/app/components/molecules/inputs/NameInput";
import { PasswordInput } from "@/app/components/molecules/inputs/PasswordInput";
import { ToggleInput } from "@/app/components/molecules/inputs/ToggleInput";
import { PasswordRequirements } from "@/app/components/organisms/RegistrationModal";
import messages from "@/app/constants/messages.json";
import { PASSWORD_MIN_LENGTH } from "@/app/constants/validation";
import { useUpdateUserPersonalDataMutation } from "@/store/features/api/subApi/userApi";
import { useAppSelector } from "@/store/store";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  firstName?: string;
  email?: string;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  changePassword?: boolean;
};

interface Params extends FormValues {
  userDataEmail?: string;
  userDataFirstName?: string;
}

const isPersonalDetailsChanged = ({
  email,
  firstName,
  password,
  newPassword,
  confirmNewPassword,
  userDataEmail,
  userDataFirstName,
}: Params) => {
  if (!email && !firstName && !newPassword && !confirmNewPassword) {
    return false;
  }
  if (
    email?.trim() === userDataEmail &&
    firstName?.trim() === userDataFirstName &&
    !newPassword &&
    !confirmNewPassword
  ) {
    return false;
  }

  if (!!newPassword && password === newPassword) {
    return false;
  }

  return true;
};

export function PersonalDetails() {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const [formError, setFormError] = useState("");
  const [showFormError, setShowFormError] = useState(false);

  const [updateUserPersonalData, { isLoading: isUserCreating }] =
    useUpdateUserPersonalDataMutation();
  const [showPasswordConfirmationError, setShowPasswordConfirmationError] =
    useState(false);
  const password = watch("password");
  const newPassword = watch("newPassword");
  const changePassword = watch("changePassword", false);

  const userData = useAppSelector(
    (state) => state.user.userData || { email: "", name: "" }
  );
  const { email, name } = userData;

  useEffect(() => {
    if (!!email && !!name) {
      reset({
        email,
        firstName: name,
      });
    }
  }, [reset, email, name]);

  useEffect(() => {
    if (!changePassword) {
      reset({ newPassword: "", confirmNewPassword: "", changePassword });
    }
  }, [changePassword, reset]);

  const onSubmit = handleSubmit(
    async ({ email, firstName, password, newPassword, confirmNewPassword }) => {
      if (
        !isPersonalDetailsChanged({
          email,
          firstName,
          password,
          newPassword,
          confirmNewPassword,
          userDataEmail: userData?.email,
          userDataFirstName: userData?.name,
        })
      ) {
        setShowFormError(true);
        setFormError("Никакие данные не были изменены");
        return;
      }

      const dataToChange = {
        name:
          !!firstName && firstName.trim() !== userData?.name
            ? firstName.trim()
            : undefined,
        email:
          !!email && email.trim() !== userData?.email
            ? email.trim()
            : undefined,
        password,
        newPassword: !!newPassword ? newPassword : undefined,
        // confirmPassword: !!confirmNewPassword ? confirmNewPassword : undefined,
      };

      try {
        await updateUserPersonalData(dataToChange).unwrap();

        reset({
          password: "",
          newPassword: "",
          confirmNewPassword: "",
          changePassword,
        });
      } catch (error: any) {
        if (typeof error?.data?.message === "string") {
          setFormError(error?.data?.message);
          setShowFormError(true);
        }
      }
    }
  );
  return (
    <div className="w-full max-w-[450px] flex flex-col items-center">
      <h2 className="text-2xl font-head font-semibold mb-6">
        Здесь ты можешь исправить личные данные своего аккаунта
      </h2>

      <Form
        autoComplete="off"
        preventSubmission={isUserCreating}
        onChange={() => setShowFormError(false)}
        onSubmit={onSubmit}
        className="flex flex-col gap-4 w-full"
      >
        <EmailInput
          error={errors.email?.message}
          register={register}
          defaultValue={userData?.email}
        />
        <NameInput
          variant="firstName"
          register={register}
          error={errors.firstName?.message}
          defaultValue={userData?.name}
        />
        <PasswordInput
          autoComplete="new-password"
          register={register}
          name="password"
          label="Пароль"
          containerClassName="mb-1"
          error={errors.password?.message}
          registerOptions={{
            minLength: {
              message: messages.validation.minLengthPassword,
              value: PASSWORD_MIN_LENGTH,
            },
            // required: messages.validation.required,
            required: false,
            onChange(event) {
              setValue("password", event?.target.value?.trim());
            },
          }}
        />

        <ToggleInput
          label="Сменить пароль"
          name="changePassword"
          register={register}
        />

        {changePassword && (
          <>
            <div>
              <PasswordInput
                register={register}
                name="newPassword"
                label="Новый пароль"
                containerClassName="mb-1"
                error={errors.password?.message}
                registerOptions={{
                  required: !!password && messages.validation.required,
                  minLength: {
                    message: messages.validation.minLengthPassword,
                    value: PASSWORD_MIN_LENGTH,
                  },
                  onChange(event) {
                    setValue("newPassword", event?.target.value?.trim());
                  },
                  onBlur: () => {
                    trigger("confirmNewPassword");
                  },
                }}
              />
              {newPassword && <PasswordRequirements password={newPassword} />}
            </div>
            <PasswordInput
              register={register}
              label="Подтверждение нового пароля"
              name="confirmNewPassword"
              registerOptions={{
                required: false,
                validate: (confirmPassword) => {
                  return (
                    confirmPassword === watch("newPassword") ||
                    messages.validation.passwordConfirmation
                  );
                },
                onChange: () => {
                  trigger("confirmNewPassword");
                },
                onBlur: () => {
                  if (!!newPassword) {
                    setShowPasswordConfirmationError(true);
                  }
                },
              }}
              error={
                showPasswordConfirmationError
                  ? errors.confirmNewPassword?.message
                  : undefined
              }
            />{" "}
          </>
        )}

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
