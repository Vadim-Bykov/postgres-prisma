"use client";

import Button from "@/app/components/atoms/common/Button";
import { Form } from "@/app/components/common/Form";
import { EmailInput } from "@/app/components/molecules/inputs/EmailInput";
import { NameInput } from "@/app/components/molecules/inputs/NameInput";
import { PasswordInput } from "@/app/components/molecules/inputs/PasswordInput";
import { PasswordRequirements } from "@/app/components/organisms/RegistrationModal";
import messages from "@/app/constants/messages.json";
import { PASSWORD_MIN_LENGTH } from "@/app/constants/validation";
import { useCreateUserMutation } from "@/store/features/api/subApi/userApi";
import { useAppSelector } from "@/store/store";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  firstName?: string;
  email?: string;
  oldPassword?: string;
  password?: string;
  confirmPassword?: string;
};

export function PersonalDetails() {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    setValue,
    formState: { errors, touchedFields },
  } = useForm<FormValues>();

  const [formError, setFormError] = useState("");
  const [showFormError, setShowFormError] = useState(false);

  const [createUser, { isLoading: isUserCreating, error }] =
    useCreateUserMutation();
  const [showPasswordConfirmationError, setShowPasswordConfirmationError] =
    useState(false);
  const password = watch("password");
  const oldPassword = watch("oldPassword");
  const userData = useAppSelector((state) => state.user.userData);
  useEffect(() => {
    if (userData) {
      const { email, name } = userData;
      reset({
        email,
        firstName: name,
      });
    }
  }, [reset, userData]);
  //   console.log({ errors });

  const onSubmit = handleSubmit(
    async ({ email, firstName, password, confirmPassword, oldPassword }) => {
      console.log({ email, firstName, password, confirmPassword, oldPassword });
      const dataToChange = {
        name:
          !!firstName && firstName.trim() !== userData?.name
            ? firstName.trim()
            : undefined,
        email:
          !!email && email.trim() !== userData?.email
            ? email.trim()
            : undefined,
        oldPassword: !!oldPassword ? oldPassword : undefined,
        password: !!password ? password : undefined,
        confirmPassword: !!confirmPassword ? confirmPassword : undefined,
      };

      console.log({ dataToChange });

      try {
        // await createUser({
        //   email,
        //   name: firstName,
        //   password,
        //   location,
        // }).unwrap();
        //   reset();
        // dispatch(toggleRegistrationModal(false));
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
      <h2 className="text-2xl font-semibold mb-6">
        Здесь ты можешь исправить личные данные своего аккаунта
      </h2>

      <Form
        autoComplete="off"
        preventSubmission={isUserCreating}
        onChange={() => setShowFormError(false)}
        onSubmit={onSubmit}
        className="flex flex-col gap-4 w-full"
      >
        <EmailInput error={errors.email?.message} register={register} />
        <NameInput
          variant="firstName"
          register={register}
          error={errors.firstName?.message}
        />
        <PasswordInput
          autoComplete="new-password"
          register={register}
          name="oldPassword"
          label="Старый пароль"
          containerClassName="mb-1"
          error={errors.oldPassword?.message}
          registerOptions={{
            minLength: {
              message: messages.validation.minLengthPassword,
              value: PASSWORD_MIN_LENGTH,
            },
            required: false,
            onChange(event) {
              setValue("oldPassword", event?.target.value?.trim());
            },
          }}
        />
        <div>
          <PasswordInput
            register={register}
            name="password"
            label="Новый пароль"
            containerClassName="mb-1"
            error={errors.password?.message}
            registerOptions={{
              required: !!oldPassword && messages.validation.required,
              minLength: {
                message: messages.validation.minLengthPassword,
                value: PASSWORD_MIN_LENGTH,
              },
              onChange(event) {
                setValue("password", event?.target.value?.trim());
              },
              onBlur: () => {
                trigger("confirmPassword");
              },
            }}
          />
          {password && <PasswordRequirements password={password} />}
        </div>
        <PasswordInput
          register={register}
          label="Подтверждение нового пароля"
          name="confirmPassword"
          registerOptions={{
            required: false,
            validate: (confirmPassword) => {
              return (
                confirmPassword === watch("password") ||
                messages.validation.passwordConfirmation
              );
            },
            onChange: () => {
              trigger("confirmPassword");
            },
            onBlur: () => {
              if (!!password) {
                setShowPasswordConfirmationError(true);
              }
            },
          }}
          error={
            showPasswordConfirmationError
              ? errors.confirmPassword?.message
              : undefined
          }
        />

        <span
          className={clsx(
            "overflow-hidden text-pink inline-block",
            "transition-max-height duration-500 ease-in-out",
            showFormError ? "max-h-28" : "max-h-0"
          )}
        >
          {formError}
        </span>

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
