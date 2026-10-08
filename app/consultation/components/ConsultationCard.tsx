"use client";

import Button from "@/app/_components/common/Button/Button";
import { HoloCard } from "@/app/_components/common/HoloCard/HoloCard";
import { cn } from "@/utils/css";
import { formatCurrencyAmount } from "@/utils/formatting";
import { useAppRouter } from "@/utils/useAppRouter";
import { Consultation } from "@prisma/client";
import Skeleton from "react-loading-skeleton";

export function ConsultationCardPlaceholder() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl">
      <Skeleton height={240} />
    </div>
  );
}

interface Props extends Consultation {
  className?: string;
}

export function ConsultationCard({
  primary,
  title,
  price,
  currency,
  id,
  className,
}: Props) {
  const { push, isTransitioning, prefetch } = useAppRouter();

  return (
    <HoloCard
      wrapperClassName={cn("w-full max-w-md", className)}
      className={cn(
        "h-full rounded-2xl border",
        primary
          ? "bg-primary text-white border-purple-dark"
          : "bg-white border-gray"
      )}
    >
      <div className="flex h-full flex-col items-center justify-between gap-6 px-5 py-10 text-center lg:px-10">
        <h3 className="font-head text-[clamp(16px,5vw,30px)] lg:text-3xl font-semibold">
          {title}
        </h3>
        <p className="text-5xl font-semibold">
          {formatCurrencyAmount({ price, currency })}
        </p>

        <Button
          onMouseEnter={() => prefetch(`/consultation/${id}`)}
          className="w-full"
          loading={isTransitioning}
          onClick={() => push(`/consultation/${id}`)}
        >
          Узнать подробнее
        </Button>
      </div>
    </HoloCard>
  );
}
