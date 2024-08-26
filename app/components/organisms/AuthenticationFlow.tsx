import {
  toggleLoginModal,
  toggleLogoutModal,
  toggleRegistrationModal,
  toggleResetPasswordModal,
} from "@/store/authentication";
import { useAppDispatch, useAppSelector } from "@/store/store";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RegistrationModal = dynamic(
  () => import("./RegistrationModal").then((mod) => mod.RegistrationModal),
  { ssr: false }
);
const LoginModal = dynamic(
  () => import("./LoginModal").then((mod) => mod.LoginModal),
  { ssr: false }
);
const LogoutModal = dynamic(
  () => import("./LogoutModal").then((mod) => mod.LogoutModal),
  { ssr: false }
);
const ResetPasswordModal = dynamic(
  () =>
    import("./ResetPassword/ResetPasswordModal").then(
      (mod) => mod.ResetPasswordModal
    ),
  { ssr: false }
);

export function AuthenticationFlow() {
  const dispatch = useAppDispatch();
  const [authenticationFlowActive, setAuthenticationFlowActive] =
    useState(false);

  const registrationModalOpen = useAppSelector(
    (state) => state.authentication.registrationModalOpen
  );
  const loginModalOpen = useAppSelector(
    (state) => state.authentication.loginModalOpen
  );
  const logoutModalOpen = useAppSelector(
    (state) => state.authentication.logoutModalOpen
  );
  const resetPasswordModalOpen = useAppSelector(
    (state) => state.authentication.resetPasswordModalOpen
  );
  const activateFlow =
    registrationModalOpen ||
    loginModalOpen ||
    logoutModalOpen ||
    resetPasswordModalOpen;

  useEffect(() => {
    if (activateFlow) {
      setAuthenticationFlowActive(true);
    }
  }, [activateFlow]);

  if (!authenticationFlowActive) {
    return null;
  }

  const closeRegistrationModal = () => {
    dispatch(toggleRegistrationModal(false));
  };
  const closeLoginModal = () => {
    dispatch(toggleLoginModal(false));
  };

  const closeLogoutModal = () => {
    dispatch(toggleLogoutModal(false));
  };
  const closeResetPasswordModal = () => {
    dispatch(toggleResetPasswordModal(false));
  };

  return (
    <>
      <LoginModal
        open={loginModalOpen}
        onSuccess={closeLoginModal}
        onRequestClose={closeLoginModal}
      />
      <LogoutModal
        open={logoutModalOpen}
        onSuccess={closeLogoutModal}
        onRequestClose={closeLogoutModal}
      />
      <RegistrationModal
        open={registrationModalOpen}
        onSuccess={closeRegistrationModal}
        onRequestClose={closeRegistrationModal}
      />
      <ResetPasswordModal
        email=""
        open={resetPasswordModalOpen}
        onRequestClose={closeResetPasswordModal}
      />
    </>
  );
}
