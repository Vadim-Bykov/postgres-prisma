import { UserLoginBody } from "@/models/users";
import {
  toggleLoginModal,
  toggleRegistrationModal,
  toggleResetPasswordModal,
} from "@/store/authentication";
import { useLoginMutation } from "@/store/features/api/subApi/userApi";
import { useAppDispatch } from "@/store/store";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../atoms/common/Button";
import { Form } from "../common/Form";
import { ModalProps } from "../common/Modal/Modal";
import { EmailInput } from "../molecules/inputs/EmailInput";
import { PasswordInput } from "../molecules/inputs/PasswordInput";
import { ModalHalfImage } from "../templates/ModalHalfImage";
import { BRAND_NAME } from "@/app/constants/brand";

type FormValues = UserLoginBody;

interface Props extends ModalProps {
  email?: UserLoginBody["email"];
  onSuccess?: () => void;
}

export function LoginModal({
  email = "",
  onSuccess: handleSuccessfulLogin,
  ...props
}: Props) {
  const dispatch = useAppDispatch();
  const defaultValues = useMemo(() => ({ email }), [email]);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const [formError, setFormError] = useState("");
  const [showFormError, setShowFormError] = useState(false);

  const [login, { isLoading: isAuthorizing }] = useLoginMutation();

  const onSubmit = handleSubmit(async ({ email, password }) => {
    const trimmedEmail = email.trim();

    try {
      await login({
        email: trimmedEmail,
        password,
      }).unwrap();

      handleSuccessfulLogin?.();
    } catch (error: any) {
      if (typeof error?.data?.message === "string") {
        setFormError(error?.data?.message);
        setShowFormError(true);
      }
    }
  });

  const handleForgetPasswordClick = () => {
    dispatch(toggleLoginModal(false));
    dispatch(toggleResetPasswordModal(true));
  };

  const handleSignUpClick = () => {
    dispatch(toggleLoginModal(false));
    dispatch(toggleRegistrationModal(true));
  };

  useEffect(() => {
    if (props.open) {
      reset(defaultValues);
    }
  }, [defaultValues, props.open, reset]);

  return (
    <ModalHalfImage className={{ base: "overflow-y-auto" }} {...props}>
      <>
        <Form
          preventSubmission={isAuthorizing}
          className="flex flex-col"
          onChange={() => setShowFormError(false)}
          onSubmit={onSubmit}
        >
          <h1 className="text-3xl font-logo mb-6">
            Воити в аккаунт {BRAND_NAME}
          </h1>
          <fieldset className="flex flex-col gap-2 mb-6">
            <EmailInput register={register} error={errors.email?.message} />
            <PasswordInput
              register={register}
              error={errors.password?.message}
            />
            <button
              type="reset"
              className="text-right text-purple text-sm font-medium"
              onClick={handleForgetPasswordClick}
            >
              Забыли пароль?
            </button>
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
          <Button
            type="submit"
            size="large"
            className="mb-6"
            disabled={isAuthorizing}
            loading={isAuthorizing}
          >
            Войти
          </Button>
          <p>
            У вас еще нет аккаунта?{" "}
            <button
              type="reset"
              className="text-purple font-medium"
              onClick={handleSignUpClick}
            >
              Пройти регистрацию.
            </button>
          </p>
          <small>Это займет 1 минуту</small>
        </Form>
      </>
    </ModalHalfImage>
  );
}
