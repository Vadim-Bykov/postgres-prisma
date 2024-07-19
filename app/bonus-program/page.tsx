"use client";

import { Coin } from "@/public/icons/Coin";
import Button from "../components/atoms/common/Button";
import { BRAND_NAME } from "../constants/brand";
import {
  PERCENTAGE_FROM_FRIEND_PURCHASE,
  REGISTRATION_BONUS,
  REGISTRATION_WITH_REFERRAL_EMAIL_BONUS,
} from "../constants/constants";
import { PageLayout } from "../components/templates/PageLayout";
import { useIsLoggedIn } from "@/utils/authorization";
import { AuthenticationButton } from "../components/atoms/AuthenticationButton";
import CopyToClipboard from "react-copy-to-clipboard";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { IconButton } from "../components/atoms/common/IconButton";
import { toggleRegistrationModal } from "@/store/authentication";

export const dynamic = "force-dynamic";

export default function BonusProgram() {
  const loggedIn = useIsLoggedIn();
  const userEmail = useAppSelector((state) => state.user.userData?.email ?? "");
  const dispatch = useAppDispatch();

  return (
    <PageLayout className="px-5 lg:px-20 py-10">
      <div className="flex flex-col items-start gap-6">
        <h2 className="text-3xl font-semibold mb-5">
          Как работает бонусная программа
        </h2>

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
            <Coin size={24} /> 1 балл = 1 RUB
          </p>
        </div>
        <p>
          Приглашай друзей и расширяй свою сеть контактов. Ты получаешь{" "}
          {PERCENTAGE_FROM_FRIEND_PURCHASE}% стоимости от каждой покупки,
          которую сделал ваш друг. Проценты начисляются на твой счет в виде
          бонусных баллов <Coin />, которыми ты можешь оплачивать консультации.
        </p>
        <div>
          <p>
            Чтобы пригласить друга, просто поделись с ним своим адресом
            электронной почты, с которым зарегистрируешься.
          </p>
        </div>
        {loggedIn && userEmail ? (
          <CopyToClipboard text={userEmail}>
            <div className="flex gap-2 cursor-pointer">
              <span>{userEmail}</span>
              <IconButton
                iconProps={{ name: "file-copy-line.svg", color: "purple" }}
              />
            </div>
          </CopyToClipboard>
        ) : loggedIn === undefined ? null : (
          <Button
            onClick={() => {
              dispatch(toggleRegistrationModal(true));
            }}
          >
            Регистрируйся и получай бонусы
          </Button>
        )}
      </div>
    </PageLayout>
  );
}
