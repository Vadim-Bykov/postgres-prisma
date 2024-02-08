"use client";

import { useGetConsultationQuery } from "@/store/features/api/subApi/consultationApi";
import { formatCurrencyAmount } from "@/utils/formatiing";
import Image from "next/image";
import { PaymentInfo } from "./PaymentInfo";

export function ConsultationDetails({ id }: { id: string }) {
  const { data: consultation } = useGetConsultationQuery({ id });

  if (!consultation) {
    return null;
  }

  const { explanation, title, price, currency, perks, imageSource } =
    consultation;

  return (
    <div className="flex flex-col gap-8 relative">
      {imageSource && (
        <Image
          src={imageSource}
          priority
          width="0"
          height="0"
          sizes="100%"
          className="self-center w-fit"
          alt="Consultation related image"
        />
      )}

      <div className="flex flex-col items-start gap-5 px-10 lg:px-20">
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
