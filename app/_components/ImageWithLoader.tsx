"use client";

import { useWindowDimensions } from "@/utils/useWindowDimensions";
import { OnLoad } from "next/dist/shared/lib/get-img-props";
import Image, { ImageProps } from "next/image";
import { SyntheticEvent, useState } from "react";
import Skeleton from "react-loading-skeleton";

interface Props extends ImageProps {
  fallbackSource?: string;
}

export function ImageWithLoader({
  onLoad,
  onError,
  src,
  fallbackSource = require("@/public/images/product/earth.jpeg"),
  className,
  width,
  height,
  alt,
  ...props
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIserror] = useState(false);
  const { isMobile, width: windowWidth } = useWindowDimensions();

  const onLoadAction: OnLoad = (e) => {
    onLoad?.(e);
    setIsLoading(false);
  };

  const onErrorAction = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    onError?.(e);
    setIserror(true);
  };

  return (
    <>
      <Image
        src={isError ? fallbackSource : src}
        onError={onErrorAction}
        onLoad={onLoadAction}
        className={className}
        width={width}
        height={height}
        {...props}
        alt={alt}
      />
      {isLoading && (
        <div className="overflow-hidden flex justify-center">
          <Skeleton
            width={isMobile ? windowWidth : 768}
            className="aspect-video"
          />
        </div>
      )}
    </>
  );
}
