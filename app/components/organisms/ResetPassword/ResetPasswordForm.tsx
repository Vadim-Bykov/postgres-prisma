import { AnimatedProps, animated } from "@react-spring/web";
import {
  CSSProperties,
  ElementRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { Form } from "../../common/Form";
import { User } from "@/models/users";
import { EmailInput } from "../../molecules/inputs/EmailInput";
import Button from "../../atoms/common/Button";

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

  // const [checkEmailStatus] = useCheckEmailStatusMutation();

  const defaultValues = useMemo(() => ({ email }), [email]);

  // const [sendRecoveryEmail] = useSendRecoveryEmailMutation();

  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const onSubmit = handleSubmit(async ({ email }) => {
    const trimmedEmail = email.trim();

    try {
      setProcessingRequest(true);

      // const emailStatusData = await checkEmailStatus({
      //   email: trimmedEmail,
      // }).unwrap();

      // if (emailStatusData.emailStatus === "NEVER_USED") {
      //   setError("email", {
      //     type: "custom",
      //     message: messages.registration.emailNeverUsed,
      //   });
      // } else if (emailStatusData.emailStatus === "BLACKLISTED") {
      //   setError("email", {
      //     type: "custom",
      //     message: messages.registration.emailBlacklisted,
      //   });
      // } else {
      //   await sendRecoveryEmail({ email: trimmedEmail }).unwrap();
      onRequestResetLink();
      // }
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
        <h1 className="text-3xl font-semibold mb-2">Reset password</h1>
        <p>
          Enter your email address and we&#39;ll send you a password reset link.
        </p>
      </div>

      <EmailInput register={register} error={errors.email?.message} autoFocus />

      <Button
        type="submit"
        size="large"
        disabled={processingRequest}
        loading={processingRequest}
      >
        Continue
      </Button>
    </AnimatedForm>
  );
}
