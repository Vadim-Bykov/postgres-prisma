import Button from "@/app/_components/common/Button/Button";
import { formatCurrencyAmount } from "@/utils/formatting";
import { useAppRouter } from "@/utils/useAppRouter";
import { Consultation } from "@prisma/client";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";

export function ConsultationCardPlaceholder() {
  return (
    <div className="overflow-hidden rounded-2xl">
      <Skeleton width={400} height={240} />
    </div>
  );
}

interface Props extends Consultation {
  setMaxWidth?: (item: { id: number; width: number }) => void;
  itemWidth?: number;
  className?: string;
}

export function ConsultationCard({
  primary,
  title,
  subTitle,
  price,
  currency,
  id,
  itemWidth,
  setMaxWidth,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { push, isTransitioning, prefetch } = useAppRouter();

  useEffect(() => {
    if (ref && ref.current?.clientWidth) {
      // 5 - border-2 + 1px extra
      setMaxWidth?.({ id, width: ref.current.clientWidth + 6 });
    }
  }, [id, ref, setMaxWidth]);

  return (
    <div
      ref={ref}
      style={{ width: itemWidth }}
      className={clsx(
        "max-w-md flex flex-col justify-between items-center gap-6 py-10 px-5 lg:px-10 text-center",
        "border-2 border-gray-300 rounded-2xl",
        primary ? "bg-primary text-white" : "bg-white"
      )}
    >
      <h3 className="font-head text-[clamp(16px,5vw,30px)] lg:text-3xl font-semibold">
        {title}
      </h3>
      {subTitle && <p>{subTitle}</p>}
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
  );
}
