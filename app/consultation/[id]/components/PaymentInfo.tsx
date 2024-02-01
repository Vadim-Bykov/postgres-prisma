"use client";

import { AuthenticationButton } from "@/app/components/atoms/AuthenticationButton";
import { useBankingDataQuery } from "@/store/features/api/subApi/banking";
import clsx from "clsx";
import { useState } from "react";
import { PaymentCheckRequest } from "./PaymentCheckRequest";
import { useAppSelector } from "@/store/store";
import messages from "@/app/constants/messages.json";

export function PaymentInfo({ consultationId }: { consultationId: string }) {
  const [showBanking, setShowBanking] = useState(false);
  const [locationError, setLocationError] = useState("");
  const userData = useAppSelector((state) => state.user.userData);

  const userLocationCountry = userData?.location?.country;
  const isAdmin = userData?.role === "ADMIN";

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
      <AuthenticationButton
        authenticationForActionRequired
        onClick={getBankingData}
        disabled={isBankingDataLoading}
        loading={isBankingDataLoading}
      >
        Получить данные для оплаты
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

      {banking?.map(({ bankName, number, ownerName, id, currency }) => (
        <div key={id}>
          <p>{bankName}</p>
          <p>{number}</p>
          <p>Валюта - {currency}</p>
          {ownerName && <p>{ownerName}</p>}
        </div>
      ))}

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

          <PaymentCheckRequest
            consultationId={consultationId}
            banking={banking}
          />
        </>
      )}
    </>
  );
}
