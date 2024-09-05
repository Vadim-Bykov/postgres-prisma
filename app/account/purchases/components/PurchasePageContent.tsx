"use client";

import { useGetAllUserPurchasesQuery } from "@/store/features/api/subApi/purchase";
import { PurchaseCardPlaceholder } from "./Purchase";
import { range } from "lodash-es";
import dynamic from "next/dynamic";

const PurchaseList = dynamic(
  () => import("./Purchase").then((mod) => mod.PurchaseList),
  { ssr: false }
);

function Placeholder() {
  return range(3).map((index) => <PurchaseCardPlaceholder key={index} />);
}

export function PurchasePageContent() {
  const { data: purchases, isLoading } = useGetAllUserPurchasesQuery();

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      <h2 className="text-2xl font-head font-semibold ">
        Здесь вы можете просмотреть оплаченные консультации и их статус
      </h2>

      <div className="flex flex-col gap-5">
        {isLoading ? (
          <Placeholder />
        ) : purchases ? (
          <PurchaseList purchases={purchases} />
        ) : null}
      </div>
    </div>
  );
}
