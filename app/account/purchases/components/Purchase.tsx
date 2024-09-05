import { Link } from "@/app/components/atoms/common/Link";
import { ImageWithLoader } from "@/app/components/common/ImageWithLoader";
import { UserPurchase } from "@/models/purchase";
import { Coin } from "@/public/icons/Coin";
import {
  formatCurrencyAmount,
  formatDate,
  formatGoogleDriveImageUrl,
} from "@/utils/formatting";
import { useWindowDimensions } from "@/utils/useWindowDimensions";
import { PaymentStatus, PurchaseStatus } from "@prisma/client";
import Skeleton from "react-loading-skeleton";

const PAYMENT_STATUS_MAP: { [key in PaymentStatus]: string } = {
  CHECKING: "проверяется",
  CONFIRMED: "подтверждена",
};

const PURCHASE_STATUS_MAP: { [key in PurchaseStatus]: string } = {
  NOT_STARTED: "вскоре приступим",
  IN_PROGRESS: "в работе",
  DONE: "выполнен",
};

export function PurchaseCardPlaceholder() {
  const { isTablet } = useWindowDimensions();
  return (
    <div className="overflow-hidden rounded-2xl">
      <Skeleton width={576} height={isTablet ? 400 : 170} />
    </div>
  );
}

export function Purchase({
  consultation: {
    title,
    subTitle,
    price,
    currency,
    createdAt,
    imageSource,
    id: consultationId,
  },
  status,
  paymentStatus,
  paymentConfirmationAt,
  orderFulfillmentAt,
  paidByMoney,
  paidByBonus,
}: UserPurchase) {
  return (
    <div className="flex flex-col lg:flex-row gap-3 rounded-xl border overflow-hidden">
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
        <h3 className="text-lg font-semibold">{title}</h3>
        {subTitle && <p className="text-sm font-semibold">{subTitle}</p>}
        <p>{formatCurrencyAmount({ currency, price })}</p>
        <p className="text-sm">
          Оплата произведена - {/* @ts-ignore */}
          {formatDate(createdAt, { dateStyle: "long" })}
        </p>
        {!!paidByBonus && (
          <p className="text-sm">
            Оплачено бонусами - <Coin /> {paidByBonus}
          </p>
        )}
        {!!paidByMoney && (
          <p className="text-sm">
            Оплачено деньгами -{" "}
            {formatCurrencyAmount({ currency, price: paidByMoney })}
          </p>
        )}
        <p className="text-sm">
          Статус оплаты - {PAYMENT_STATUS_MAP[paymentStatus]}{" "}
          {paymentStatus === "CONFIRMED" &&
            paymentConfirmationAt &&
            formatDate(paymentConfirmationAt, { dateStyle: "long" })}
        </p>
        <p className="text-sm mb-3">
          Статус заказа - {PURCHASE_STATUS_MAP[status]}{" "}
          {status === "DONE" &&
            orderFulfillmentAt &&
            formatDate(orderFulfillmentAt, { dateStyle: "long" })}
        </p>
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

export function PurchaseList({ purchases }: { purchases: UserPurchase[] }) {
  return purchases?.map((purchase) => (
    <Purchase key={purchase.id} {...purchase} />
  ));
}
