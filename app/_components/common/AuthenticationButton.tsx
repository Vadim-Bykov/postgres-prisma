import Button, {
  Props as ButtonProps,
} from "@/app/_components/common/Button/Button";
import { toggleLoginModal } from "@/store/authentication";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useIsLoggedIn } from "@/utils/authorization";
import { MouseEventHandler } from "react";

interface Props extends ButtonProps {
  authenticationForActionRequired?: boolean;
}

export function AuthenticationButton({
  children = "Войти",
  authenticationForActionRequired,
  onClick,
  disabled,
  ...props
}: Props) {
  const dispatch = useAppDispatch();
  const loggedIn = useIsLoggedIn();

  const handleLoginSignupClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (loggedIn) {
      onClick?.(e);
    } else if (!authenticationForActionRequired) {
      onClick?.(e);
      dispatch(toggleLoginModal(true));
    } else if (authenticationForActionRequired && !loggedIn) {
      dispatch(toggleLoginModal(true));
    }
  };

  return (
    <Button
      disabled={disabled || loggedIn === undefined}
      {...props}
      onClick={handleLoginSignupClick}
    >
      {children}
    </Button>
  );
}
