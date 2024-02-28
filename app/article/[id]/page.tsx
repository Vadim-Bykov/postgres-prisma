import { PageLayout } from "@/app/components/templates/PageLayout";
import { ARTICLES } from "../constants/articles";

export const dynamic = "force-dynamic";

export default function ArticlePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { title, subTitle, imageSourceId } = ARTICLES[+id - 1];
  return (
    <PageLayout>
      <div>
        Статья {id}
        <p>{title}</p>
        <p>{subTitle}</p>
      </div>
    </PageLayout>
  );
}
