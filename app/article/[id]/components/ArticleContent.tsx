"use client";

import { ImageWithLoader } from "@/app/components/common/ImageWithLoader";
import { formatGoogleDriveImageUrl } from "@/utils/formatting";
import clsx from "clsx";
import { useParams } from "next/navigation";
import {
  ARTICLES,
  ArticleParagraph,
  colorVariants,
} from "../../constants/articles";
import { ParagraphList } from "./ParagraphList";
import { SendEmailButton } from "@/app/components/common/SendEmailButton";
import { useAppRouter } from "@/utils/useAppRouter";

export function ArticleContent() {
  const { id } = useParams();
  const { back } = useAppRouter();
  const article = ARTICLES.find((item) => item.id === +id);

  if (!article) {
    back();
    return;
  }

  const { title, subTitle, imageSourceId, paragraphs, ps } = article;

  return (
    <div className="lg:max-w-5xl self-center flex flex-col gap-8 lg:pt-2 lg:px-5">
      {imageSourceId && (
        <ImageWithLoader
          src={formatGoogleDriveImageUrl(imageSourceId)}
          priority
          width="0"
          height="0"
          sizes="100%"
          placeholder="empty"
          className="self-center w-full max-h-[70vh] object-contain"
          alt="Article related image"
        />
      )}
      <div className="flex flex-col items-start gap-2 px-5 lg:px-0 lg:text-lg">
        <div className="self-center text-center">
          <h3 className="font-head text-2xl font-semibold">{title}</h3>
          <p className="font-head text-lg lg:text-xl">{subTitle}</p>
        </div>

        <div className="flex flex-col gap-4 lg:gap-5">
          {paragraphs.map((paragraph, index) => (
            <ArticleParagraphComponent
              key={`${paragraph.text}-${index}`}
              {...paragraph}
            />
          ))}
        </div>

        {ps && (
          <p className="mt-3">
            <span className="font-semibold">PS:</span> {ps}
          </p>
        )}
        <SendEmailButton target="newArticle" />
      </div>
    </div>
  );
}

function ArticleParagraphComponent({
  text,
  paragraphTitle,
  paragraphSubTitle,
  imageSourceId: paragraphImageSourceId,
  backgroundColor,
  list,
}: ArticleParagraph) {
  return (
    <div
      className={clsx(
        "flex flex-col gap-1 lg:gap-2 rounded-xl lg:rounded-2xl",
        backgroundColor &&
          `${colorVariants[backgroundColor]} px-4 pt-2 pb-4 lg:px-5 lg:pt-3 lg:pb-5`
      )}
    >
      <div>
        {paragraphTitle && (
          <p className="text-lg lg:text-xl font-semibold italic">
            {paragraphTitle}
          </p>
        )}
        {paragraphSubTitle && (
          <p className="font-semibold italic">{paragraphSubTitle}</p>
        )}
      </div>

      {paragraphImageSourceId ? (
        <div className="flex flex-col lg:flex-row gap-3">
          <ImageWithLoader
            src={formatGoogleDriveImageUrl(paragraphImageSourceId)}
            priority
            width="0"
            height="0"
            sizes="100%"
            placeholder="empty"
            className="self-center w-full lg:w-1/3"
            alt="Article related image"
          />
          {text && <p className="text-justify">{text}</p>}
          {list && <ParagraphList {...list} />}
        </div>
      ) : (
        <>
          {text && <p className="text-justify">{text}</p>}
          {list && <ParagraphList {...list} />}
        </>
      )}
    </div>
  );
}
