import Button, {
  Props as ButtonProps,
} from "@/app/components/atoms/common/Button";
import { toggleLoginModal } from "@/store/authentication";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { MouseEventHandler } from "react";

interface Props extends ButtonProps {
  authenticationForActionRequired?: boolean;
}

export function AuthenticationButton({
  children = "Log in / Sign up",
  authenticationForActionRequired,
  onClick,
  ...props
}: Props) {
  const dispatch = useAppDispatch();
  const { isAuthorized } = useAppSelector((state) => state.user);

  const handleLoginSignupClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isAuthorized) {
      onClick?.(e);
    } else if (!authenticationForActionRequired) {
      onClick?.(e);
      dispatch(toggleLoginModal(true));
    } else if (authenticationForActionRequired && !isAuthorized) {
      dispatch(toggleLoginModal(true));
    }
  };

  return (
    <Button {...props} onClick={handleLoginSignupClick}>
      {children}
    </Button>
  );
}
