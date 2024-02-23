"use client";

import { ImageWithLoader } from "@/app/components/common/ImageWithLoader";
import { useGetAllConsultationsQuery } from "@/store/features/api/subApi/consultationApi";
import {
  useGetAllUserPurchasesQuery,
  useGetUserPurchaseQuery,
} from "@/store/features/api/subApi/purchase";
import {
  formatCurrencyAmount,
  formatDate,
  formatGoogleDriveImageUrl,
} from "@/utils/formatiing";
import Link from "next/link";
import React from "react";

export function PurchaseList() {
  const { data: purchases } = useGetAllUserPurchasesQuery();

  return (
    <div className="w-full max-w-xl flex flex-col gap-6">
      <h2 className="text-2xl font-head font-semibold ">
        Здесь вы можете просмотреть оплаченные консультации и их статус
      </h2>

      <div className="flex flex-col gap-5">
        {purchases?.map(
          ({
            consultation: {
              title,
              price,
              currency,
              createdAt,
              imageSource,
              id: consultationId,
            },
            id,
            status,
            paymentStatus,
          }) => {
            return (
              <div
                key={id}
                className="flex flex-col lg:flex-row gap-3 rounded-xl border overflow-hidden"
              >
                <div className="basis-1/3 flex">
                  <ImageWithLoader
                    src={formatGoogleDriveImageUrl(imageSource)}
                    priority
                    width="0"
                    height="0"
                    sizes="100%"
                    placeholder="empty"
                    className="self-center w-full h-full object-cover lg:w-fit"
                    alt="Consultation related image"
                  />
                </div>
                <div className="p-3 lg:self-center">
                  <h3 className="font-semibold">{title}</h3>
                  <p>{formatCurrencyAmount({ currency, price })}</p>
                  <p className="text-sm">
                    Оплата произведена - {/* @ts-ignore */}
                    {formatDate(createdAt, { dateStyle: "long" })}
                  </p>
                  <p className="text-sm">Статус оплаты - {paymentStatus}</p>
                  <p className="text-sm mb-3">Статус заказа - {status}</p>
                  <Link
                    className="text-sm font-semibold text-purple"
                    href={`/consultation/${consultationId}`}
                  >
                    Перейти на страницу с описанием консультации
                  </Link>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
