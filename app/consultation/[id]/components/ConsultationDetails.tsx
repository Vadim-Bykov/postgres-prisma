import { formatCurrencyAmount } from "@/utils/formatiing";
import { Consultation } from "@prisma/client";
import React from "react";

export function ConsultationDetails({
  title,
  explanation,
  price,
  currency,
  perks,
}: Consultation) {
  return (
    <div>
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
