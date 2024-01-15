import { formatCurrencyAmount } from "@/utils/formatiing";
import { Consultation } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Button from "../atoms/common/Button";
import Skeleton from "react-loading-skeleton";
import { AuthenticationButton } from "../atoms/AuthenticationButton";
import { useAppPathname, useAppRouter } from "@/utils/useAppRouter";

export function ConsultationCardPlaceholder() {
  return <Skeleton width={400} height={280} />;
}

interface Props extends Consultation {
  setMaxWidth?: (item: { id: number; width: number }) => void;
  itemWidth?: number;
  className?: string;
}

export function ConsultationCard({
  primary,
  title,
  price,
  currency,
  id,
  itemWidth,
  setMaxWidth,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useAppRouter();

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
        "max-w-md flex flex-col items-center gap-4 py-10 px-5 md:px-10 text-center",
        "border-2 border-gray-300 rounded-2xl",
        primary ? "bg-primary text-white" : "bg-white"
      )}
    >
      <h3 className="text-[clamp(16px,5vw,30px)] md:text-3xl font-semibold">
        –&nbsp;{title}&nbsp;–
      </h3>
      <p className="text-5xl font-semibold">
        {formatCurrencyAmount({ price, currency })}
      </p>
      <Link
        href={`/consultation/${id}`}
        className={clsx(
          "text-lg font-medium underline",
          primary ? "text-yellow-300" : "text-purple-800"
        )}
      >
        Узнать подробнее
      </Link>
      <AuthenticationButton
        authenticationForActionRequired
        className="w-full"
        onClick={() => router.push(`/purchase/${id}`)}
      >
        Оставить заявку
      </AuthenticationButton>
    </div>
  );
}
