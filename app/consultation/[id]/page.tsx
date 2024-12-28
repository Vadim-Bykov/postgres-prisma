import { PageLayout } from "@/app/_components/templates/PageLayout";
import { ConsultationDetails } from "./components/ConsultationDetails";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function Consultation(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;

  return (
    <PageLayout>
      <ConsultationDetails id={id} />
    </PageLayout>
  );
}
