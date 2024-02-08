import { ConsultationList } from "../components/Home/ConsultationList";
import { PageLayout } from "../components/templates/PageLayout";

export const dynamic = "force-dynamic";

export default function Consultation() {
  return (
    <PageLayout className="px-5 lg:px-20 py-10">
      <h2 className="text-3xl font-semibold">Консультации</h2>
      <ConsultationList />
    </PageLayout>
  );
}
