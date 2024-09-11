import { PageLayout } from "@/app/_components/templates/PageLayout";
import { ArticleContent } from "./components/ArticleContent";

export const dynamic = "force-dynamic";

export default function ArticlePage() {
  return (
    <PageLayout>
      <ArticleContent />
    </PageLayout>
  );
}
