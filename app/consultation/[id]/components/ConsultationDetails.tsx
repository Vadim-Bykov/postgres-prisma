"use client";

import { useGetConsultationQuery } from "@/store/features/api/subApi/consultationApi";
import {
  formatCurrencyAmount,
  formatGoogleDriveImageUrl,
} from "@/utils/formatting";
import { PaymentInfo } from "./PaymentInfo";
import { ImageWithLoader } from "@/app/components/common/ImageWithLoader";
import Skeleton from "react-loading-skeleton";
import { useWindowDimensions } from "@/utils/useWindowDimensions";
import { Paragraph } from "@/app/components/common/Paragraph";
import { SendEmailButton } from "@/app/components/common/SendEmailButton";

const MAX_WIDTH = 1024;

export function ConsultationPlaceholder() {
  const { isMobile, width: windowWidth } = useWindowDimensions();
  const width = isMobile ? windowWidth : MAX_WIDTH;
  const padding = isMobile ? 20 : 0;

  return (
    <div className="flex flex-col gap-8 items-center">
      <Skeleton width={width} className="aspect-video" />
      <Skeleton width={width - padding} height={32} />
      <Skeleton width={width - padding} height={200} />
      <div>
        <Skeleton width={width - padding} height={18} />
        <Skeleton width={width - padding} height={18} />
        <Skeleton width={width - padding} height={18} />
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
    <div className="lg:max-w-5xl self-center flex flex-col gap-8 lg:pt-2 lg:px-5 relative">
      <ImageWithLoader
        src={formatGoogleDriveImageUrl(imageSource)}
        priority
        width="0"
        height="0"
        sizes="100%"
        placeholder="empty"
        className="self-center w-full max-h-[70vh] object-contain"
        alt="Consultation related image"
      />

      <div className="flex flex-col items-start gap-5 px-5 lg:px-0 lg:text-lg">
        <h2 className="font-head text-3xl font-semibold">{title}</h2>
        {subTitle && (
          <p className="text-lg lg:text-xl font-semibold">{subTitle}</p>
        )}

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

        <SendEmailButton target="newConsultation" />
      </div>
    </div>
  );
}
