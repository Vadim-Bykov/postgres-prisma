import { BRAND_NAME } from "@/app/constants/brand";
import {
  REGISTRATION_BONUS,
  REGISTRATION_WITH_REFERRAL_EMAIL_BONUS,
} from "@/app/constants/constants";
import { toggleRegistrationModal } from "@/store/authentication";
import { useAppDispatch } from "@/store/store";
import { useIsLoggedIn } from "@/utils/authorization";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../atoms/common/Button";

function Content({
  openModal,
  dismissToast,
}: {
  openModal: () => void;
  dismissToast: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 text-sm lg:text-base">
      <div className="flex flex-col gap-1">
        <h2>
          Зарегистрируйся на <span className="text-xl">{BRAND_NAME}</span> и
          получи бонус до{" "}
          <span className="font-semibold">
            {REGISTRATION_BONUS + REGISTRATION_WITH_REFERRAL_EMAIL_BONUS}
          </span>{" "}
          баллов и оплачивай ими консультации.
        </h2>
        <Link
          href="/bonus-program"
          onClick={dismissToast}
          className="text-purple font-semibold"
        >
          Узнать подробнее
        </Link>
      </div>
      <Button onClick={openModal}>Зарегистрироваться</Button>
    </div>
  );
}

export const SIGN_UP_TOAST_ID = "SignUpPromptToast";

export function useSignUpPromptToast() {
  const [showToast, setShowToast] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const loggedIn = useIsLoggedIn();
  const isUserDataLoading = loggedIn === undefined;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loggedIn && !isUserDataLoading && !toastShown) {
      setShowToast(true);
    }
    if (loggedIn) {
      //  no need to show toast
      setToastShown(true);
    }
  }, [loggedIn, isUserDataLoading, toastShown]);

  const dismissToast = useCallback(() => toast.dismiss(), []);
  const openModal = useCallback(() => {
    dispatch(toggleRegistrationModal(true));
    setShowToast(false);
    setToastShown(true);
    dismissToast();
  }, [dismissToast, dispatch]);

  useEffect(() => {
    if (showToast && !toastShown && !toast.isActive(SIGN_UP_TOAST_ID)) {
      toast(<Content openModal={openModal} dismissToast={dismissToast} />, {
        autoClose: 10000,
        className: "lg:w-96",
        toastId: SIGN_UP_TOAST_ID,
      });
    }
  }, [dismissToast, openModal, showToast, toastShown]);

  return null;
}
