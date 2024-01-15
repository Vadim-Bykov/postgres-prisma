import { PageLayout } from "@/app/components/templates/PageLayout";

export const dynamic = "force-dynamic";

export default function Consultation({ params }: { params: { id: string } }) {
  return (
    <PageLayout>
      <h2 className="text-3xl font-semibold mb-5">
        Consultation id: {params?.id}
      </h2>
    </PageLayout>
  );
}
