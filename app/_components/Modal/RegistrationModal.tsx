"use client";

import Button from "@/app/_components/common/Button/Button";
import { Form } from "@/app/_components/common/Form";
import { EmailInput } from "@/app/_components/common/input/EmailInput";
import { NameInput } from "@/app/_components/common/input/NameInput";
import { PasswordInput } from "@/app/_components/common/input/PasswordInput";
import { ToggleInput } from "@/app/_components/common/input/ToggleInput";
import { Modal, ModalProps } from "@/app/_components/Modal/Modal";
import { PasswordRequirements } from "@/app/_components/PasswordRequirements";
import {
  REGISTRATION_BONUS,
  REGISTRATION_WITH_REFERRAL_EMAIL_BONUS,
} from "@/app/constants/constants";
import messages from "@/app/constants/messages.json";
import { PASSWORD_MIN_LENGTH } from "@/app/constants/validation";
import { UserLoginBody } from "@/models/users";
import { toggleRegistrationModal } from "@/store/authentication";
import { useCreateUserMutation } from "@/store/features/api/subApi/userApi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { cn } from "@/utils/css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { shallowEqual } from "react-redux";
import { ErrorMessage } from "../ErrorMessage";
import { useGetFeatureFlagsQuery } from "@/store/features/api/subApi/featureFlag";

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
  const { data: featureFlags } = useGetFeatureFlagsQuery();

  const showBonusProgram = featureFlags?.some(
    (flag) => flag.title === "SIGN_UP_PROMPT" && flag.value === true
  );

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

  const [createUser, { isLoading: isUserCreating }] = useCreateUserMutation();
  const [showPasswordConfirmationError, setShowPasswordConfirmationError] =
    useState(false);
  const password = watch("password");
  const location = useAppSelector(
    (state) => state.user.currentLocation,
    shallowEqual
  );
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
        base: cn(
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
        {showBonusProgram && (
          <>
            <p>
              Ты получишь бонус{" "}
              <span className="font-semibold">{REGISTRATION_BONUS}</span>{" "}
              баллов.
            </p>
            <p>1 балл = 1 RUB</p>
          </>
        )}
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
            autoComplete="new-password"
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
          autoComplete="new-password"
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
