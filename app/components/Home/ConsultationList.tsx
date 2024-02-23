"use client";

import { useGetAllConsultationsQuery } from "@/store/features/api/subApi/consultationApi";
import { range } from "lodash-es";
import { useState } from "react";
import {
  ConsultationCard,
  ConsultationCardPlaceholder,
} from "./ConsultationCard";

function Placeholder() {
  return range(6).map((index) => <ConsultationCardPlaceholder key={index} />);
}

export function ConsultationList() {
  const [itemWidth, setItemWidth] = useState<{ id: number; width: number }[]>(
    []
  );

  const { data: consults, isLoading } = useGetAllConsultationsQuery();

  const setMaxWidth = (item: { id: number; width: number }) => {
    setItemWidth((prev) => {
      if (prev.find(({ id }) => id === item.id)) {
        return prev;
      }

      return [...prev, item];
    });
  };

  const maxWidth =
    itemWidth.length === consults?.length
      ? itemWidth.map(({ width }) => width).sort((prev, next) => next - prev)[0]
      : undefined;

  return (
    <div className="flex justify-evenly flex-wrap gap-4">
      {isLoading ? (
        <Placeholder />
      ) : (
        consults?.map((consultation) => (
          <ConsultationCard
            key={consultation.id}
            {...consultation}
            setMaxWidth={setMaxWidth}
            itemWidth={maxWidth}
          />
        ))
      )}
    </div>
  );
}
