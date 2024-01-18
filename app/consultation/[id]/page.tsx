"use client";

import {
  ConsultationCard,
  ConsultationCardPlaceholder,
} from "@/app/components/Home/ConsultationCard";
import { PageLayout } from "@/app/components/templates/PageLayout";
import { useGetConsultationQuery } from "@/store/features/api/subApi/consultationApi";
import { formatCurrencyAmount } from "@/utils/formatiing";
import { ConsultationDetails } from "./components/ConsultationDetails";

export const dynamic = "force-dynamic";

export default function Consultation({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data } = useGetConsultationQuery({ id });

  return (
    <PageLayout>
      {data ? (
        <ConsultationDetails {...data} />
      ) : (
        <ConsultationCardPlaceholder />
      )}
    </PageLayout>
  );
}
