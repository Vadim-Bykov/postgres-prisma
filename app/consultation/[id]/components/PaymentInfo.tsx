"use client";

import Button from "@/app/_components/common/Button/Button";
import { Link } from "@/app/_components/common/Link";
import messages from "@/app/constants/messages.json";
import { useBankingDataQuery } from "@/store/features/api/subApi/banking";
import { useGetUserPurchaseQuery } from "@/store/features/api/subApi/purchase";
import { useIsLoggedIn } from "@/utils/authorization";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useState } from "react";

const PaymentCheckRequest = dynamic(
  () => import("./PaymentCheckRequest").then((mod) => mod.PaymentCheckRequest),
  { ssr: false }
);
const BankingList = dynamic(
  () => import("./BankingList").then((mod) => mod.BankingList),
  { ssr: false }
);

export function PaymentInfo() {
  const [showBanking, setShowBanking] = useState(false);
  const [locationError, setLocationError] = useState("");
  const loggedIn = useIsLoggedIn();
  // const userData = useAppSelector((state) => state.user.userData);
  // TODO: uncomment if we want BY users to be restricted
  // const currentUserLocationCountry = useAppSelector(
  //   (state) => state.user.currentLocation?.country
  // );
  // const userLocationCountry = userData?.location?.country;

  // const isAdmin = userData?.role === "ADMIN";

  const { id: consultationId } = useParams<{ id: string }>();
  const {
    data: userPurchase,
    isLoading: isUserPurchaseChecking,
    isSuccess: isPurchaseChecked,
  } = useGetUserPurchaseQuery({ consultationId }, { skip: !loggedIn });

  const {
    data: banking,
    isLoading: isBankingDataLoading,
    isError: isBankingError,
    error,
  } = useBankingDataQuery(undefined, {
    skip: !showBanking,
  });

  const getBankingData = () => {
    // TODO: uncomment if we want BY users to be restricted
    // if (
    //   (userLocationCountry === "BY" || currentUserLocationCountry === "BY") &&
    //   !isAdmin
    // ) {
    //   setLocationError(messages.location);
    //   return;
    // } else {
    setShowBanking(true);
    // }
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

      {!!userPurchase?.paymentStatus && (
        <Link
          className="text-purple font-semibold flex items-center"
          href={"/account/purchases"}
        >
          Перейти в личный кабинет
        </Link>
      )}
      {((loggedIn === false && !banking) ||
        (isPurchaseChecked && !userPurchase && !banking)) && (
        <Button
          onClick={getBankingData}
          disabled={isBankingDataLoading || isUserPurchaseChecking || !!banking}
          loading={isBankingDataLoading}
        >
          Получить данные для оплаты
        </Button>
      )}

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

      {banking && (
        <>
          <BankingList banking={banking} />
          <PaymentCheckRequest banking={banking} />
        </>
      )}
    </>
  );
}
