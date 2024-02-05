"use client";

import messages from "@/app/constants/messages.json";
import { PASSWORD_MIN_LENGTH } from "@/app/constants/validation";
import { UserLoginBody } from "@/models/users";
import { toggleRegistrationModal } from "@/store/authentication";
import { useCreateUserMutation } from "@/store/features/api/subApi/userApi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  validateNumberOrSymbolInclusion,
  validatePassword,
  validatePasswordLength,
  validateUpperAndLowerCaseInclusion,
} from "@/utils/validation";
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
import { ModalHalfImage } from "../templates/ModalHalfImage";

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
          "px-5 py-10 md:px-20 md:py-20 sm:w-[390px]",
          "w-[70%] box-content overflow-hidden"
        ),
      }}
      withCloseIcon
      {...props}
    >
      <h1 className="text-3xl font-semibold mb-6">Let’s create your account</h1>

      <Form
        preventSubmission={isUserCreating}
        onChange={() => setShowFormError(false)}
        onSubmit={onSubmit}
        className="flex flex-col gap-4 w-full overflow-y-auto"
      >
        <EmailInput error={errors.email?.message} register={register} />
        <NameInput
          variant="firstName"
          register={register}
          error={errors.firstName?.message}
        />
        <PasswordInput
          register={register}
          label="Password"
          name="password"
          error={errors.password?.message}
          containerClassName="mb-2"
          registerOptions={{
            minLength: {
              message: messages.validation.minLengthPassword,
              value: PASSWORD_MIN_LENGTH,
            },
            onBlur: () => {
              trigger("confirmPassword");
            },
          }}
        />
        <PasswordRequirements password={password} />
        <PasswordInput
          register={register}
          label="Confirm password"
          name="confirmPassword"
          registerOptions={{
            validate: (confirmPassword) =>
              confirmPassword === watch("password") ||
              messages.validation.passwordConfirmation,
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
          Submit
        </Button>
      </Form>
    </Modal>
  );
}

const requirements = [
  {
    label: "Upper and lowercase letters",
    validationRule: validateUpperAndLowerCaseInclusion,
  },
  {
    label: "More than 8 characters",
    validationRule: validatePasswordLength,
  },
  {
    label: "Contains a number or symbol",
    validationRule: validateNumberOrSymbolInclusion,
  },
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
        fulfilled ? "opacity-100" : "opacity-60"
      )}
    >
      <Icon name="checkmark.svg" size={14} />
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
