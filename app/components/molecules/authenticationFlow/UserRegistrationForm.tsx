"use client";

import { useCreateUserMutation } from "@/store/features/api/subApi/userApi";
import { useForm } from "react-hook-form";
import { EmailInput } from "../inputs/EmailInput";
import { NameInput } from "../inputs/NameInput";
import Button from "../../atoms/common/Button";
import { PasswordInput } from "../inputs/PasswordInput";
import { PASSWORD_MIN_LENGTH } from "@/app/constants/validation";
import {
  validateNumberOrSymbolInclusion,
  validatePassword,
  validatePasswordLength,
  validateUpperAndLowerCaseInclusion,
} from "@/utils/validation";
import { HTMLAttributes, useState } from "react";
import messages from "@/app/constants/messages.json";
import Icon from "../../atoms/common/Icon/Icon";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleRegistrationModal } from "@/store/authentication";
import { Form } from "../../common/Form";

type FormValues = {
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function UserRegistrationForm() {
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const dispatch = useAppDispatch();
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

  console.log({ showFormError });

  return (
    <Form
      preventSubmission={isUserCreating}
      onChange={() => setShowFormError(false)}
      onSubmit={onSubmit}
      className="w-full"
    >
      <EmailInput error={errors.email?.message} register={register} />
      <br />
      <NameInput
        variant="firstName"
        register={register}
        error={errors.firstName?.message}
      />
      <br />
      <fieldset>
        <PasswordInput
          register={register}
          label="Password"
          name="password"
          error={errors.password?.message}
          containerClassName="mb-2"
          registerOptions={{
            // validate: validatePassword,
            minLength: PASSWORD_MIN_LENGTH,
            onBlur: () => {
              trigger("confirmPassword");
            },
          }}
        />
        <PasswordRequirements password={password} containerClassName="mb-5" />
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
            "overflow-hidden text-pink",
            "transition-max-height duration-500 ease-in-out",
            showFormError ? "max-h-28" : "max-h-0"
          )}
        >
          {formError}
        </span>
      </fieldset>
      <br />

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
