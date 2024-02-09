import { useWindowDimensions } from "@/utils/useWindowDimensions";
import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import React, { ReactEventHandler, useState } from "react";
import Skeleton from "react-loading-skeleton";

export function ImageWithLoader({
  onLoad,
  onLoadStart,
  className,
  width,
  height,
  alt,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile } = useWindowDimensions();

  const onLoadStartAction: ReactEventHandler<HTMLImageElement> = (e) => {
    onLoadStart?.(e);
    setIsLoading(true);
  };

  const onLoadAction: ReactEventHandler<HTMLImageElement> = (e) => {
    onLoad?.(e);
    setIsLoading(false);
  };

  return (
    <>
      <Image
        onLoad={onLoadAction}
        onLoadStart={onLoadStartAction}
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
