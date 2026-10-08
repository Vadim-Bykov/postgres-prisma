"use client";

import { useGetAllConsultationsQuery } from "@/store/features/api/subApi/consultationApi";
import { range } from "lodash-es";
import {
  ConsultationCard,
  ConsultationCardPlaceholder,
} from "./ConsultationCard";

function Placeholder() {
  return range(6).map((index) => <ConsultationCardPlaceholder key={index} />);
}

export function ConsultationList() {
  const { data: consults, isLoading } = useGetAllConsultationsQuery();

  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] xl:grid-cols-3 justify-items-center">
      {isLoading ? (
        <Placeholder />
      ) : (
        consults?.map((consultation) => (
          <ConsultationCard key={consultation.id} {...consultation} />
        ))
      )}
    </div>
  );
}
