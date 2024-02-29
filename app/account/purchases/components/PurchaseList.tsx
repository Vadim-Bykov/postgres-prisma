"use client";

import { useGetAllUserPurchasesQuery } from "@/store/features/api/subApi/purchase";
import { Purchase, PurchaseCardPlaceholder } from "./Purchase";
import { range } from "lodash-es";

function Placeholder() {
  return range(3).map((index) => <PurchaseCardPlaceholder key={index} />);
}

export function PurchaseList() {
  const { data: purchases, isLoading } = useGetAllUserPurchasesQuery();

  return (
    <div className="w-full max-w-xl flex flex-col gap-6">
      <h2 className="text-2xl font-head font-semibold ">
        Здесь вы можете просмотреть оплаченные консультации и их статус
      </h2>

      <div className="flex flex-col gap-5">
        {isLoading ? (
          <Placeholder />
        ) : (
          purchases?.map((purchase) => {
            return <Purchase key={purchase.id} {...purchase} />;
          })
        )}
      </div>
    </div>
  );
}
