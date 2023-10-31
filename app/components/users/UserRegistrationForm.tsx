"use client";

import { useCreateUserMutation } from "@/store/features/api/apiSlice";
import { useForm } from "react-hook-form";
import { EmailInput } from "../molecules/inputs/EmailInput";
import { NameInput } from "../molecules/inputs/NameInput";
import Button from "../atoms/common/Button";
import { PasswordInput } from "../molecules/inputs/PasswordInput";
import { PASSWORD_MIN_LENGTH } from "@/app/constants/validation";
import {
  validateNumberOrSymbolInclusion,
  validatePassword,
  validatePasswordLength,
  validateUpperAndLowerCaseInclusion,
} from "@/utils/validation";
import { HTMLAttributes, useState } from "react";
import messages from "@/app/constants/messages.json";
import Icon from "../atoms/common/Icon/Icon";
import clsx from "clsx";

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

  const [createUser] = useCreateUserMutation();
  const [showPasswordConfirmationError, setShowPasswordConfirmationError] =
    useState(false);
  const password = watch("password");

  const onSubmit = handleSubmit(async ({ email, firstName, password }) => {
    await createUser({
      email,
      name: firstName,
      password,
    }).then((user) => console.log(user));

    reset();
  });

  return (
    <section className="mb-10 flex justify-center">
      <form onSubmit={onSubmit}>
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
        </fieldset>
        <Button type="submit">Submit</Button>
      </form>
    </section>
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
        "flex items-center gap-2 text-xs mb-1",
        fulfilled ? "opacity-100" : "opacity-60"
      )}
    >
      <Icon
        name="checkmark.svg"
        size={14}
        color={fulfilled ? "purple" : "purple-dark"}
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
