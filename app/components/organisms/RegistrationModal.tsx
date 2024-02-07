"use client";

import messages from "@/app/constants/messages.json";
import { PASSWORD_MIN_LENGTH } from "@/app/constants/validation";
import { UserLoginBody } from "@/models/users";
import { toggleRegistrationModal } from "@/store/authentication";
import { useCreateUserMutation } from "@/store/features/api/subApi/userApi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { validatePasswordLength } from "@/utils/validation";
import clsx from "clsx";
import { HTMLAttributes, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../atoms/common/Button";
import Icon from "../atoms/common/Icon/Icon";
import { Form } from "../common/Form";
import { Modal, ModalProps } from "../common/Modal/Modal";
import { EmailInput } from "../molecules/inputs/EmailInput";
import { NameInput } from "../molecules/inputs/NameInput";
import { PasswordInput } from "../molecules/inputs/PasswordInput";

type FormValues = {
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface Props extends ModalProps {
  email?: UserLoginBody["email"];
  onSuccess?: () => void;
}

export function RegistrationModal({ email = "", onSuccess, ...props }: Props) {
  const dispatch = useAppDispatch();
  const defaultValues = useMemo(() => ({ email }), [email]);

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

  const [createUser, { isLoading: isUserCreating, error }] =
    useCreateUserMutation();
  const [showPasswordConfirmationError, setShowPasswordConfirmationError] =
    useState(false);
  const password = watch("password");
  const { location } = useAppSelector((state) => state.user);

  const onSubmit = handleSubmit(async ({ email, firstName, password }) => {
    try {
      await createUser({
        email,
        name: firstName,
        password,
        location,
      }).unwrap();

      reset();
      dispatch(toggleRegistrationModal(false));
    } catch (error: any) {
      if (typeof error?.data?.message === "string") {
        setFormError(error?.data?.message);
        setShowFormError(true);
      }
    }
  });

  return (
    <Modal
      className={{
        base: clsx(
          "px-5 py-10 lg:px-20 lg:py-20 sm:w-[390px]",
          "w-[70%] box-content overflow-hidden"
        ),
      }}
      withCloseIcon
      {...props}
    >
      <h1 className="text-3xl font-semibold mb-6">
        Давай создадим тебе аккаунт
      </h1>

      <Form
        preventSubmission={isUserCreating}
        onChange={() => setShowFormError(false)}
        onSubmit={onSubmit}
        className="flex flex-col gap-4 w-full overflow-y-auto p-0.5"
      >
        <EmailInput error={errors.email?.message} register={register} />
        <NameInput
          variant="firstName"
          register={register}
          error={errors.firstName?.message}
        />
        <div>
          <PasswordInput
            register={register}
            name="password"
            containerClassName="mb-1"
            error={errors.password?.message}
            registerOptions={{
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
          <PasswordRequirements password={password} />
        </div>
        <PasswordInput
          register={register}
          label="Подтверждение пароля"
          name="confirmPassword"
          registerOptions={{
            validate: (confirmPassword) => {
              console.log({
                'confirmPassword === watch("password")':
                  confirmPassword === watch("password"),
              });

              return (
                confirmPassword === watch("password") ||
                messages.validation.passwordConfirmation
              );
            },
            onChange: () => {
              trigger("confirmPassword");
            },
            onBlur: () => {
              setShowPasswordConfirmationError(true);
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
          Зарегистрироваться
        </Button>
      </Form>
    </Modal>
  );
}

const requirements = [
  // {
  //   label: "Upper and lowercase letters",
  //   validationRule: validateUpperAndLowerCaseInclusion,
  // },
  {
    label: "Более 8 символов",
    validationRule: validatePasswordLength,
  },
  // {
  //   label: "Contains a number or symbol",
  //   validationRule: validateNumberOrSymbolInclusion,
  // },
];

function PasswordRequirement({
  label,
  fulfilled,
}: {
  label: string;
  fulfilled: boolean;
}) {
  return (
    <li
      className={clsx(
        "flex items-center gap-2 text-xs font-medium mb-1",
        fulfilled ? "text-green-500" : "text-purple-light"
      )}
    >
      <Icon
        name="checkmark.svg"
        size={14}
        color={fulfilled ? "green" : "purple-light"}
      />
      {label}
    </li>
  );
}

function PasswordRequirements({
  password,
  containerClassName,
}: {
  password: string;
  containerClassName?: HTMLAttributes<HTMLUListElement>["className"];
}) {
  return (
    <ul className={containerClassName}>
      {requirements.map(({ label, validationRule }) => (
        <PasswordRequirement
          key={label}
          label={label}
          fulfilled={validationRule(password)}
        />
      ))}
    </ul>
  );
}
