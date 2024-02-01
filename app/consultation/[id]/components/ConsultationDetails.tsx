"use client";

import { useGetConsultationQuery } from "@/store/features/api/subApi/consultationApi";
import { formatCurrencyAmount } from "@/utils/formatiing";
import Image from "next/image";
import { PaymentInfo } from "./PaymentInfo";

const source: { [key: string]: string } = {
  1: require("@/public/images/product/prof.jpg"),
  2: require("@/public/images/product/analis.jpg"),
  3: require("@/public/images/product/finance.png"),
  4: require("@/public/images/product/earth.jpeg"),
};

export function ConsultationDetails({ id }: { id: string }) {
  const { data: consultation } = useGetConsultationQuery({ id });
  const imageSource = source[id];

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

        <PaymentInfo />
      </div>
    </div>
  );
}
