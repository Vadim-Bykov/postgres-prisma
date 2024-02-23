"use client";

import { useGetConsultationQuery } from "@/store/features/api/subApi/consultationApi";
import {
  formatCurrencyAmount,
  formatGoogleDriveImageUrl,
} from "@/utils/formatiing";
import { PaymentInfo } from "./PaymentInfo";
import { ImageWithLoader } from "@/app/components/common/ImageWithLoader";
import Skeleton from "react-loading-skeleton";
import { useWindowDimensions } from "@/utils/useWindowDimensions";
import { Paragraph } from "@/app/components/common/Paragraph";

export function ConsultationPlaceholder() {
  const { isMobile, width } = useWindowDimensions();
  return (
    <div className="flex flex-col gap-8 items-center">
      <Skeleton width={isMobile ? width : 768} className="aspect-video" />
      <Skeleton width={width - 60} height={32} />
      <Skeleton width={width - 60} height={200} />
      <div>
        <Skeleton width={width - 60} height={18} />
        <Skeleton width={width - 60} height={18} />
        <Skeleton width={width - 60} height={18} />
      </div>
    </div>
  );
}

export function ConsultationDetails({ id }: { id: string }) {
  const { data: consultation } = useGetConsultationQuery({ id });

  if (!consultation) {
    return <ConsultationPlaceholder />;
  }

  const {
    title,
    subTitle,
    description,
    price,
    currency,
    perks,
    imageSource,
    perksTitle,
  } = consultation;

  return (
    <div className="flex flex-col gap-8 lg:pt-2 relative">
      <ImageWithLoader
        src={formatGoogleDriveImageUrl(imageSource)}
        priority
        width="0"
        height="0"
        sizes="100%"
        placeholder="empty"
        className="self-center w-full lg:w-fit"
        alt="Consultation related image"
      />

      <div className="flex flex-col items-start gap-5 px-5 lg:px-20">
        <h2 className="font-head text-3xl font-semibold">{title}</h2>
        {subTitle && <p className="text-lg font-semibold">{subTitle}</p>}

        <div className="flex flex-col gap-2">
          {description.map((paragraph) => {
            return <Paragraph key={paragraph}>{paragraph}</Paragraph>;
          })}
        </div>
        <p>
          Стоимость консультации {formatCurrencyAmount({ price, currency })}.
        </p>
        <ul>
          {perksTitle && <p>{perksTitle}</p>}
          {perks.length > 0 &&
            perks.map((perk) => <li key={perk}>• {perk}</li>)}
        </ul>

        <PaymentInfo />
      </div>
    </div>
  );
}
