"use client";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { AuthenticationButton } from "@/app/components/atoms/AuthenticationButton";
import { useBankingDataQuery } from "@/store/features/api/subApi/banking";
import clsx from "clsx";
import { useState } from "react";
import { PaymentCheckRequest } from "./PaymentCheckRequest";
import { useAppSelector } from "@/store/store";
import messages from "@/app/constants/messages.json";
import { useGetUserPurchaseQuery } from "@/store/features/api/subApi/purchase";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Banking } from "@prisma/client";
import { IconButton } from "@/app/components/atoms/common/IconButton";

const PAYMENT_SYSTEM_LOGO: { [key in Banking["paymentSystem"]]: string } = {
  MASTERCARD: require("@/public/icons/payment/mastercard.svg"),
  VISA: require("@/public/icons/payment/visa.svg"),
  MIR: require("@/public/icons/payment/mir.png"),
};

export function PaymentInfo() {
  const [showBanking, setShowBanking] = useState(false);
  const [locationError, setLocationError] = useState("");
  const userData = useAppSelector((state) => state.user.userData);

  const userLocationCountry = userData?.location?.country;
  const isAdmin = userData?.role === "ADMIN";

  const { id: consultationId } = useParams();
  const { data: userPurchase, isLoading: isUserPurchaseChecking } =
    useGetUserPurchaseQuery(
      { consultationId: consultationId as string },
      { skip: !userData }
    );

  const {
    data: banking,
    isLoading: isBankingDataLoading,
    isError: isBankingError,
    error,
  } = useBankingDataQuery(undefined, {
    skip: !showBanking,
  });

  const getBankingData = () => {
    if (userLocationCountry === "BY" && !isAdmin) {
      setLocationError(messages.location);
      return;
    } else {
      setShowBanking(true);
    }
  };
  return (
    <>
      <span
        className={clsx(
          "overflow-hidden text-green-600",
          "transition-max-height duration-500 ease-in-out",
          userPurchase?.paymentStatus && !showBanking ? "max-h-28" : "max-h-0"
        )}
      >
        {/* @ts-ignore */}
        {messages.payments[userPurchase?.paymentStatus || "CHECKING"]}
      </span>

      <AuthenticationButton
        authenticationForActionRequired
        onClick={getBankingData}
        disabled={isBankingDataLoading || isUserPurchaseChecking || !!banking}
        loading={isBankingDataLoading}
      >
        {userPurchase?.paymentStatus
          ? "Хочу исправить ошибку в данных об оплате"
          : "Получить данные для оплаты"}
      </AuthenticationButton>

      <span
        className={clsx(
          "overflow-hidden text-pink",
          "transition-max-height duration-500 ease-in-out",
          isBankingError || locationError ? "max-h-28" : "max-h-0"
        )}
      >
        {/* @ts-ignore */}
        {error?.data?.message || locationError}
      </span>

      {banking?.map(
        ({ bankName, number, ownerName, id, currency, paymentSystem }) => (
          <div key={id}>
            <div className="flex items-center gap-3">
              <p>{bankName} </p>
              <Image
                alt="Payment system logo"
                className="w-8 h-auto"
                src={PAYMENT_SYSTEM_LOGO[paymentSystem]}
              />
            </div>

            <CopyToClipboard text={number.split(" ").join("")}>
              <div className="flex gap-3">
                <p>{number}</p>
                <IconButton
                  iconProps={{ name: "file-copy-line.svg", color: "purple" }}
                />
              </div>
            </CopyToClipboard>

            <p>Валюта - {currency}</p>

            {ownerName && <p>{ownerName}</p>}
          </div>
        )
      )}

      {banking && (
        <>
          <div className="text-xs">
            <p>
              После оплаты, пожалуйста нажмите кнопку &quot;Проверить
              оплату&quot;.
            </p>
            <p>
              Вы также можете мне прислать копию чека об оплате в мессенджерах
              или на эл.почту.
            </p>
          </div>

          <PaymentCheckRequest banking={banking} />
        </>
      )}
    </>
  );
}
