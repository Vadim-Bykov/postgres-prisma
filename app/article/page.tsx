import { PageLayout } from "../components/templates/PageLayout";
import { ArticleList } from "./components/ArticleList";

export const dynamic = "force-dynamic";

export default function ArticleListPage() {
  return (
    <PageLayout className="px-5 lg:px-20 py-10">
      <h2 className="font-head text-3xl font-semibold">Статьи</h2>
      <ArticleList />
    </PageLayout>
  );
}
