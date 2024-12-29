"use client";

import { useGetAllUserPurchasesQuery } from "@/store/features/api/subApi/purchase";
import { PurchaseCardPlaceholder } from "./Purchase";
import { range } from "lodash-es";
import dynamic from "next/dynamic";
import { Link } from "@/app/_components/common/Link";

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
        ) : purchases?.length ? (
          <PurchaseList purchases={purchases} />
        ) : (
          <div>
            <h2 className="font-head text-lg">
              Вы еще не заказали не одной консультации.
            </h2>
            <Link href="/consultation" className="text-purple font-semibold">
              Давайте подберем вам консультацию!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
