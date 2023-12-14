import Button, {
  Props as ButtonProps,
} from "@/app/components/atoms/common/Button";
import { toggleLoginModal } from "@/store/authentication";
import { useAppDispatch } from "@/store/store";
import { MouseEventHandler } from "react";

export function AuthenticationButton({
  children = "Log in / Sign up",
  onClick,
  ...props
}: ButtonProps) {
  const dispatch = useAppDispatch();

  const handleLoginSignupClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    onClick?.(e);
    dispatch(toggleLoginModal(true));
  };

  return (
    <Button {...props} onClick={handleLoginSignupClick}>
      {children}
    </Button>
  );
}
