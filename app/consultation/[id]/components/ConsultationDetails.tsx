"use client";

import { AuthenticationButton } from "@/app/components/atoms/AuthenticationButton";
import { useBankingDataQuery } from "@/store/features/api/subApi/banking";
import { useGetConsultationQuery } from "@/store/features/api/subApi/consultationApi";
import { formatCurrencyAmount } from "@/utils/formatiing";
import Image from "next/image";
import { useState } from "react";

const source: { [key: string]: string } = {
  1: require("@/public/images/product/prof.jpg"),
  2: require("@/public/images/product/analis.jpg"),
  3: require("@/public/images/product/finance.png"),
  4: require("@/public/images/product/earth.jpeg"),
};

export function ConsultationDetails({ id }: { id: string }) {
  const { data: consultation } = useGetConsultationQuery({ id });
  const imageSource = source[id];
  const [showBanking, setShowBanking] = useState(false);

  const { data: banking, isLoading: isBankingDataLoading } =
    useBankingDataQuery(undefined, {
      skip: !showBanking,
    });

  const getBankingData = () => {
    setShowBanking(true);
  };

  if (!consultation) {
    return null;
  }

  const { explanation, title, price, currency, perks } = consultation;

  return (
    <div className="flex flex-col gap-8">
      {imageSource && (
        <Image
          src={imageSource}
          priority
          className="w-fit self-center"
          alt="Finance image"
        />
      )}

      <div className="flex flex-col items-start gap-5 px-10 md:px-20 py-10">
        <h2 className="text-3xl font-semibold">{title}</h2>
        {explanation && <p>{explanation}</p>}
        <p>
          Стоимость консультации {formatCurrencyAmount({ price, currency })}.
        </p>
        <ul>
          {perks.map((perk) => (
            <li key={perk}>• {perk}</li>
          ))}
        </ul>
        <AuthenticationButton
          authenticationForActionRequired
          onClick={getBankingData}
          disabled={isBankingDataLoading}
          loading={isBankingDataLoading}
        >
          Получить данные для оплаты
        </AuthenticationButton>

        {banking?.map(({ bankName, number, ownerName, id, currency }) => (
          <div key={id}>
            <p>{bankName}</p>
            <p>{number}</p>
            <p>Валюта - {currency}</p>
            {ownerName && <p>{ownerName}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
