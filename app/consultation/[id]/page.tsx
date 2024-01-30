import { PageLayout } from "@/app/components/templates/PageLayout";
import { ConsultationDetails } from "./components/ConsultationDetails";

export const dynamic = "force-dynamic";

export default function Consultation({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <PageLayout>
      <ConsultationDetails id={id} />
    </PageLayout>
  );
}
