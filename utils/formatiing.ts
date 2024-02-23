import ms from "ms";
import { Currency as PrismaCurrency } from "@prisma/client";
import { Currency } from "@/prisma/enumAdapter";

export function leaveOnlyNumbers(s: string) {
  return s.replace(/\D+/g, "");
}

/**
 * Accepts a number and formats it properly to display as a USD currency.
 * For example `123.00` becomes `$123.00`, accepts negative amounts.
 */
export function formatUsdAmount(
  amount: number,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(amount);
}

export function formatCurrencyAmount({
  price,
  currency,
}: {
  price: number;
  currency: PrismaCurrency;
}) {
  return `${Currency[currency]} ${price}`;
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";

  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};
export function formatGoogleDriveImageUrl(imageId: string) {
  // const imageId = url.split("/d/")[1]?.split("/view")[0];

  return `https://drive.google.com/uc?export=view&id=${imageId}`;
}
