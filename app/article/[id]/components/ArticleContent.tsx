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

export function ArticleContent() {
  const { id } = useParams();
  const { title, subTitle, imageSourceId, paragraphs, ps } = ARTICLES[+id - 1];

  return (
    <div className="flex flex-col gap-8 lg:pt-2">
      {imageSourceId && (
        <ImageWithLoader
          src={formatGoogleDriveImageUrl(imageSourceId)}
          priority
          width="0"
          height="0"
          sizes="100%"
          placeholder="empty"
          className="self-center w-full lg:w-fit"
          alt="Article related image"
        />
      )}
      <div className="flex flex-col items-start gap-2 px-5 lg:px-20">
        <div className="self-center text-center">
          <h3 className="font-head text-2xl font-semibold">{title}</h3>
          <p className="font-head text-lg">{subTitle}</p>
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
        "flex flex-col gap-1 lg:gap-2 rounded-3xl",
        backgroundColor && `${colorVariants[backgroundColor]} p-5`
      )}
    >
      <div>
        {paragraphTitle && (
          <p className="font-semibold italic">{paragraphTitle}</p>
        )}
        {paragraphSubTitle && <p className="italic">{paragraphSubTitle}</p>}
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
          {text && <p className="indent-3 lg:indent-0 text-justify">{text}</p>}
          {list && <ParagraphList {...list} />}
        </div>
      ) : (
        <>
          {text && <p className="indent-3 text-justify">{text}</p>}
          {list && <ParagraphList {...list} />}
        </>
      )}
    </div>
  );
}
