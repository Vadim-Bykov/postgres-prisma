import { formatGoogleDriveImageUrl } from "@/utils/formatting";
import Image from "next/image";
import Link from "next/link";
import { ARTICLES, Article } from "../constants/articles";

interface ArticleCardProps extends Article {
  showDivider: boolean;
}

function ArticleCard({
  id,
  title,
  subTitle,
  summary,
  imageSourceId,
  showDivider,
}: ArticleCardProps) {
  return (
    <>
      <div className={"flex flex-col lg:flex-row items-center gap-5 "}>
        {imageSourceId && (
          <div className="rounded-xl overflow-hidden min-w-[300px] w-full lg:w-1/3">
            <Image
              src={formatGoogleDriveImageUrl(imageSourceId)}
              priority
              width="0"
              height="0"
              sizes="100%"
              placeholder="empty"
              className="self-center w-full h-full object-cover lg:w-fit"
              alt="Consultation related image"
            />
          </div>
        )}
        <div>
          <h3 className="font-head text-lg">{title}</h3>
          {subTitle && <p>{subTitle}</p>}
          {summary && <p className="text-justify">{summary}</p>}
          <Link className="text-purple font-semibold" href={`/article/${id}`}>
            Читать полностью
          </Link>
        </div>
      </div>
      {showDivider && <div className="border-b" />}
    </>
  );
}

export function ArticleList() {
  return (
    <div className="flex flex-col gap-5 max-w-md lg:max-w-full self-center">
      {ARTICLES.map((article, index) => {
        return (
          <ArticleCard
            key={article.id}
            {...article}
            showDivider={ARTICLES.length - 1 > index}
          />
        );
      })}
    </div>
  );
}
