import Button from "@/app/_components/common/Button/Button";
import { Form } from "@/app/_components/common/Form";
import { EmailInput } from "@/app/_components/common/input/EmailInput";
import { User } from "@/models/users";
import { useResetPasswordMutation } from "@/store/features/api/subApi/resetPasswordApi";
import { AnimatedProps, animated } from "@react-spring/web";
import clsx from "clsx";
import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AnimatedForm = animated(Form);

type FormValues = {
  email: User["email"];
};

interface Props extends AnimatedProps<{ style: CSSProperties }> {
  open: boolean;
  email?: string;
  onRequestResetLink: () => void;
}

export function ResetPasswordForm({
  email,
  open,
  onRequestResetLink,
  style,
}: Props) {
  const [processingRequest, setProcessingRequest] = useState(false);

  const [resetPassword, { isError, error }] = useResetPasswordMutation<{
    isError: boolean;
    error?: { data: { message: string; success: boolean } };
  }>();

  const defaultValues = useMemo(() => ({ email }), [email]);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    const trimmedEmail = email.trim();

    try {
      setProcessingRequest(true);
      await resetPassword({ email: trimmedEmail }).unwrap();
      onRequestResetLink();
    } finally {
      setProcessingRequest(false);
    }
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [defaultValues, open, reset]);

  return (
    <AnimatedForm
      preventSubmission={processingRequest}
      className="flex flex-col gap-6 w-full"
      onSubmit={onSubmit}
      style={style}
    >
      <div>
        <h1 className="font-head text-3xl font-semibold mb-2">Сброс пароля</h1>
        <p>
          Введите свой адрес электронной почты и мы отправим вам ссылку для
          сброса пароля.
        </p>
      </div>

      <EmailInput register={register} error={errors.email?.message} autoFocus />
      <span
        className={clsx(
          "overflow-hidden text-pink",
          "transition-max-height duration-500 ease-in-out",
          isError ? "max-h-28" : "max-h-0"
        )}
      >
        {error?.data?.message}
      </span>
      <Button
        type="submit"
        size="large"
        disabled={processingRequest}
        loading={processingRequest}
      >
        Отправить
      </Button>
    </AnimatedForm>
  );
}
