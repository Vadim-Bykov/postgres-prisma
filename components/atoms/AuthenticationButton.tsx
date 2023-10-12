import Button, { Props as ButtonProps } from "@/components/atoms/common/Button";
import { useAppDispatch } from "@/store/store";
// import { toggleEmailVerificationModal } from "@/components/services/authentication";
import { MouseEventHandler } from "react";

export function AuthenticationButton({
  children = "Log in / Sign up",
  onClick,
  ...props
}: ButtonProps) {
  const dispatch = useAppDispatch();

  const handleLoginSignupClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e);
    // dispatch(toggleEmailVerificationModal(true));
  };

  return (
    <Button {...props} onClick={handleLoginSignupClick}>
      {children}
    </Button>
  );
}
