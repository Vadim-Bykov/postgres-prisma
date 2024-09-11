"use client";

import { Link } from "@/app/_components/common/Link";
import { useAppSelector } from "@/store/store";
import { formatGoogleDriveImageUrl } from "@/utils/formatting";
import Image from "next/image";
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
      <div className={"flex flex-col lg:flex-row items-center gap-5"}>
        {imageSourceId && (
          <div className="rounded-xl overflow-hidden min-w-[300px] w-full lg:w-[300px]">
            <Image
              src={formatGoogleDriveImageUrl(imageSourceId)}
              priority
              width="0"
              height="0"
              sizes="100%"
              placeholder="empty"
              className="self-center w-full h-full object-cover lg:w-[300px]"
              alt="Consultation related image"
            />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="font-head text-lg">{title}</h3>
          {subTitle && <p>{subTitle}</p>}
          {summary && <p className="text-justify text-sm">{summary}</p>}
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
  const isAdmin = useAppSelector(
    (state) => state.user.userData?.role === "ADMIN"
  );

  return (
    <div className="flex flex-col gap-5 max-w-md lg:max-w-full self-center">
      {ARTICLES.map((article, index) => {
        return article.status === "EXAMPLE" && !isAdmin ? null : (
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
