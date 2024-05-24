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
import { ToggleInput } from "../molecules/inputs/ToggleInput";
import { ErrorMessage } from "../atoms/common/ErrorMessage";
import {
  REGISTRATION_BONUS,
  REGISTRATION_WITH_REFERRAL_EMAIL_BONUS,
} from "@/app/constants/constants";

type FormValues = {
  firstName: string;
  email: string;
  password: string;
  confirmPassword: string;
  showFriendEmail?: boolean;
  invitedByFriendEmail?: string;
};

interface Props extends ModalProps {
  email?: UserLoginBody["email"];
  onSuccess?: () => void;
}

export function RegistrationModal({ email = "", onSuccess, ...props }: Props) {
  const dispatch = useAppDispatch();

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
  const location = useAppSelector((state) => state.user.currentLocation);
  const showFriendEmail = watch("showFriendEmail", false);

  const onSubmit = handleSubmit(
    async ({
      email,
      firstName,
      password,
      invitedByFriendEmail,
      showFriendEmail,
    }) => {
      try {
        await createUser({
          email,
          name: firstName,
          password,
          location,
          invitedByFriendEmail: showFriendEmail
            ? invitedByFriendEmail
            : undefined,
        }).unwrap();

        reset();
        dispatch(toggleRegistrationModal(false));
      } catch (error: any) {
        if (typeof error?.data?.message === "string") {
          setFormError(error?.data?.message);
          setShowFormError(true);
        }
      }
    }
  );

  return (
    <Modal
      className={{
        base: clsx(
          "px-5 py-10 lg:px-20 lg:py-20 sm:w-[390px]",
          "w-[70%] box-content max-h-[calc(100vh-100px)] overflow-y-auto"
        ),
      }}
      shouldCloseOnOverlayClick={false}
      withCloseIcon
      {...props}
    >
      <div className="mb-6">
        <h1 className="font-head text-2xl sm:text-3xl font-semibold ">
          Давай создадим тебе аккаунт
        </h1>
        <p>
          Ты получишь бонус{" "}
          <span className="font-semibold">{REGISTRATION_BONUS}</span> баллов.
        </p>
        <p>1 балл = 1 RUB</p>
      </div>

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

        <div className="flex flex-col gap-4">
          <ToggleInput
            label={`Меня пригласил друг (получаешь дополнительный бонус ${REGISTRATION_WITH_REFERRAL_EMAIL_BONUS} баллов)`}
            name="showFriendEmail"
            register={register}
            labelClassName="text-xs lg:text-sm basis-3/4"
          />
          {showFriendEmail && (
            <EmailInput
              label="Электронная почта друга"
              name="invitedByFriendEmail"
              error={errors.invitedByFriendEmail?.message}
              register={register}
              required={false}
            />
          )}
        </div>

        <ErrorMessage visible={showFormError}>{formError}</ErrorMessage>

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
    label: "Минимум 8 символов",
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

export function PasswordRequirements({
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
