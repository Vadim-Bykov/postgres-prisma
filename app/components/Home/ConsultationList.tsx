"use client";

import { useState } from "react";
import { ConsultationCard } from "./ConsultationCard";

type ConsultationStatus = "ACTIVE" | "DEPRECATED";
type Currency = "₽" | "$";

export interface Consultation {
  id: number;
  title: string;
  price: number;
  currency: Currency;
  perks: string[];
  status: ConsultationStatus;
  primary?: boolean;
}

const consults: Consultation[] = [
  {
    id: 1,
    title: "Профориентация",
    price: 8700,
    currency: "₽",
    perks: [
      "Профессия, дело, которое вам будет приносить удовольствие",
      "Как вам добиться социального роста",
      "Где и как добиться карьеры",
    ],
    status: "ACTIVE",
    primary: true,
  },
  {
    id: 2,
    title: "Самоанализ",
    price: 5000,
    currency: "₽",
    perks: [
      "Ваши сильные и слабые стороны личности, как их использовать",
      "Узнаете свои скрытые таланты",
      "Как вам надо планировать свою жизнь",
    ],
    status: "ACTIVE",
  },
  {
    id: 3,
    title: "Деньги и финансы",
    price: 4500,
    currency: "₽",
    perks: [
      "Ваши виды и способы заработка ",
      "В какой сфере вам нужно зарабатывать",
      "Какие методы использовать для привлечения дохода",
    ],
    status: "ACTIVE",
  },
];

export function ConsultationList() {
  const [itemWidth, setItemWidth] = useState<{ id: number; width: number }[]>(
    []
  );

  const setMaxWidth = (item: { id: number; width: number }) => {
    setItemWidth((prev) => {
      if (prev.find(({ id }) => id === item.id)) {
        return prev;
      }

      return [...prev, item];
    });
  };

  const maxWidth =
    itemWidth.length === consults.length
      ? itemWidth.map(({ width }) => width).sort((prev, next) => next - prev)[0]
      : undefined;

  return (
    <div className="flex justify-evenly flex-wrap gap-4">
      {consults.map((consultation) => (
        <ConsultationCard
          key={consultation.id}
          {...consultation}
          setMaxWidth={setMaxWidth}
          itemWidth={maxWidth}
        />
      ))}
    </div>
  );
}
