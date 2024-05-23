import { BRAND_NAME } from "@/app/constants/brand";
import { REGISTRATION_BONUS } from "@/app/constants/constants";
import React, { useEffect, useState } from "react";
import { Toast } from "./Toast";
import Button from "../../atoms/common/Button";
import { useAppDispatch } from "@/store/store";
import { toggleRegistrationModal } from "@/store/authentication";
import { useIsLoggedIn } from "@/utils/authorization";

function Content({ openModal }: { openModal: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="">
        Зарегистрируйся на <span className="text-xl">{BRAND_NAME}</span> и
        получи бонус {REGISTRATION_BONUS} баллов
      </h2>
      <Button onClick={openModal}>Зарегистрироваться</Button>
    </div>
  );
}

export function SignUpPromptToast() {
  const [showToast, setShowToast] = useState(false);
  const loggedIn = useIsLoggedIn();
  const isUserDataLoading = loggedIn === undefined;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loggedIn && !isUserDataLoading) {
      setShowToast(true);
    }
  }, [loggedIn, isUserDataLoading]);

  const openModal = () => {
    dispatch(toggleRegistrationModal(true));
    setShowToast(false);
  };

  return (
    <Toast
      show={showToast}
      ToastContent={() => <Content openModal={openModal} />}
    />
  );
}
