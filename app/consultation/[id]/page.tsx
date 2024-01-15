"use client";

import {
  ConsultationCard,
  ConsultationCardPlaceholder,
} from "@/app/components/Home/ConsultationCard";
import { PageLayout } from "@/app/components/templates/PageLayout";
import { useGetConsultationQuery } from "@/store/features/api/subApi/consultationApi";

export const dynamic = "force-dynamic";

export default function Consultation({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data } = useGetConsultationQuery({ id });

  return (
    <PageLayout>
      <h2 className="text-3xl font-semibold mb-5">Consultation id: {id}</h2>
      {data ? <ConsultationCard {...data} /> : <ConsultationCardPlaceholder />}
    </PageLayout>
  );
}
