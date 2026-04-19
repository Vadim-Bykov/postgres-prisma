import { Currency as PrismaCurrency } from "@prisma/client";

export const Currency = {
  [PrismaCurrency.RUB]: "₽",
  [PrismaCurrency.USD]: "$",
  [PrismaCurrency.BYN]: "Br",
  [PrismaCurrency.EUR]: "€",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];
