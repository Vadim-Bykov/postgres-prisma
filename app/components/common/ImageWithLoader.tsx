import { useWindowDimensions } from "@/utils/useWindowDimensions";
import clsx from "clsx";
import { OnLoadingComplete } from "next/dist/shared/lib/get-img-props";
import Image, { ImageProps } from "next/image";
import React, { ReactEventHandler, useState } from "react";
import Skeleton from "react-loading-skeleton";

export function ImageWithLoader({
  onLoadingComplete,
  className,
  width,
  height,
  alt,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile } = useWindowDimensions();

  const onLoadAction: OnLoadingComplete = (e) => {
    onLoadingComplete?.(e);
    setIsLoading(false);
  };

  return (
    <>
      <Image
        onLoadingComplete={onLoadAction}
        className={className}
        width={width}
        height={height}
        {...props}
        alt={alt}
      />
      {isLoading && (
        <div className="overflow-hidden flex justify-center">
          <Skeleton width={isMobile ? "100%" : 768} className="aspect-video" />
        </div>
      )}
    </>
  );
}
