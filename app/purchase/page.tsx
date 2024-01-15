import { ConsultationList } from "../components/Home/ConsultationList";
import { PageLayout } from "../components/templates/PageLayout";

export const dynamic = "force-dynamic";

export default function Purchase() {
  return (
    <PageLayout>
      <h2 className="text-3xl font-semibold mb-5">
        Покупка полного пакета со скидкой
      </h2>
      <ConsultationList />
    </PageLayout>
  );
}
