import {
  toggleLoginModal,
  toggleLogoutModal,
  toggleRegistrationModal,
  // toggleResetPasswordModal,
} from "@/store/authentication";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { User } from "@/models/users";
import { LoginModal } from "./LoginModal";
import { LogoutModal } from "./LogoutModal";
import { RegistrationModal } from "./RegistrationModal";

export function AuthenticationFlow() {
  const dispatch = useAppDispatch();

  const registrationModalOpen = useAppSelector(
    (state) => state.authentication.registrationModalOpen
  );
  const loginModalOpen = useAppSelector(
    (state) => state.authentication.loginModalOpen
  );
  const logoutModalOpen = useAppSelector(
    (state) => state.authentication.logoutModalOpen
  );

  const closeRegistrationModal = () => {
    dispatch(toggleRegistrationModal(false));
  };
  const closeLoginModal = () => {
    dispatch(toggleLoginModal(false));
  };

  const closeLogoutModal = () => {
    dispatch(toggleLogoutModal(false));
  };
  // const closeResetPasswordModal = () => {
  //   dispatch(toggleResetPasswordModal(false));
  // };

  const [userEmail, setUserEmail] = useState<User["email"]>("");

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
      {/* <ResetPasswordModal
        email={userEmail}
        open={resetPasswordModalOpen}
        onRequestClose={closeResetPasswordModal}
      /> */}
    </>
  );
}
