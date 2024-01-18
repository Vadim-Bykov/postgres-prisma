import { formatCurrencyAmount } from "@/utils/formatiing";
import { Consultation } from "@prisma/client";
import Image from "next/image";
import React from "react";

const source: { [key: number]: string } = {
  1: require("@/public/images/product/prof.jpg"),
  2: require("@/public/images/product/analis.jpg"),
  3: require("@/public/images/product/finance.png"),
};

export function ConsultationDetails({
  title,
  explanation,
  price,
  currency,
  perks,
  id,
}: Consultation) {
  const imageSource = source[id];

  return (
    <div className="flex flex-col">
      {imageSource && (
        <Image
          src={imageSource}
          priority
          className="w-fit self-center"
          alt="Finance image"
        />
      )}
      <h2 className="text-3xl font-semibold">{title}</h2>
      <br />
      {explanation && <p>{explanation}</p>}
      <br />
      <p>Стоимость консультации {formatCurrencyAmount({ price, currency })}.</p>
      <br />
      <ul>
        {perks.map((perk) => (
          <li key={perk}>• {perk}</li>
        ))}
      </ul>
    </div>
  );
}
