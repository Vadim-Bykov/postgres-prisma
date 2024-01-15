import { ConsultationList } from "../components/Home/ConsultationList";
import { PageLayout } from "../components/templates/PageLayout";

export const dynamic = "force-dynamic";

export default function Consultation() {
  return (
    <PageLayout>
      <h2 className="text-3xl font-semibold mb-5">Консультации</h2>
      <ConsultationList />
    </PageLayout>
  );
}
