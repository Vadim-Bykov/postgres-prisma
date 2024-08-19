import { BRAND_NAME } from "@/app/constants/brand";
import {
  PERCENTAGE_FROM_FRIEND_PURCHASE,
  REGISTRATION_BONUS,
  REGISTRATION_WITH_REFERRAL_EMAIL_BONUS,
} from "@/app/constants/constants";
import { Coin } from "@/public/icons/Coin";
import { toggleRegistrationModal } from "@/store/authentication";
import { useAppDispatch } from "@/store/store";
import { useIsLoggedIn } from "@/utils/authorization";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../atoms/common/Button";

function Content({ openModal }: { openModal: () => void }) {
  return (
    <div className="flex flex-col gap-6 text-sm lg:text-base">
      <div className="flex flex-col gap-1">
        <h2>
          Зарегистрируйся на <span className="text-xl">{BRAND_NAME}</span> и
          получи бонус{" "}
          <span className="font-semibold">{REGISTRATION_BONUS}</span> баллов и
          оплачивай ими консультации.
        </h2>
        <p>
          Если тебя пригласил друг и тебя есть его адрес электронной почты,
          укажи его при регистрации и получай дополнительный бонус{" "}
          <span className="font-semibold">
            {REGISTRATION_WITH_REFERRAL_EMAIL_BONUS}
          </span>{" "}
          баллов.
        </p>
        <p>
          Итого:{" "}
          <span className="font-semibold">
            {REGISTRATION_BONUS + REGISTRATION_WITH_REFERRAL_EMAIL_BONUS}
          </span>{" "}
          баллов.
        </p>
        <p className="flex items-center gap-1">
          <Coin /> 1 балл = 1 RUB
        </p>
      </div>
      <p>
        Приглашай друзей и расширяй свою сеть контактов. Ты получаешь{" "}
        {PERCENTAGE_FROM_FRIEND_PURCHASE}% стоимости от каждой покупки, которую
        сделал ваш друг. Проценты начисляются на твой счет в виде бонусных
        баллов <Coin />, которыми ты можешь оплачивать консультации.
      </p>
      <div>
        <p>
          Чтобы пригласить друга, просто поделись с ним своим адресом
          электронной почты, с которым зарегистрируешься.
        </p>
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

  const openModal = useCallback(() => {
    dispatch(toggleRegistrationModal(true));
    setShowToast(false);
  }, [dispatch]);

  useEffect(() => {
    if (showToast && !toastShown && !toast.isActive(SIGN_UP_TOAST_ID)) {
      toast(<Content openModal={openModal} />, {
        autoClose: 10000,
        className: "lg:w-96",
        toastId: SIGN_UP_TOAST_ID,
      });
    }
  }, [openModal, showToast, toastShown]);

  return null;
}
