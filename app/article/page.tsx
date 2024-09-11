import { PageLayout } from "../_components/templates/PageLayout";
import { ArticleList } from "./components/ArticleList";

export const dynamic = "force-dynamic";

export default function ArticleListPage() {
  return (
    <PageLayout className="px-5 lg:px-20 py-10">
      <h2 className="font-head text-3xl font-semibold -mb-3 lg:-mb-10">
        Статьи
      </h2>
      <ArticleList />
    </PageLayout>
  );
}
