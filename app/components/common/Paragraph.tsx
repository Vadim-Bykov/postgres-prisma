import clsx from "clsx";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

export function Paragraph({
  children,
  className,
  lineHeight,
  indentRequired,
}: PropsWithChildren<{
  className?: string;
  lineHeight?: number;
  indentRequired?: boolean;
}>) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [isMoreThenTwoLines, setIsMoreThenTwoLines] = useState(false);

  useEffect(() => {
    const paragraphHeight = ref.current?.clientHeight || 24;

    if (paragraphHeight > (lineHeight || 24)) {
      setIsMoreThenTwoLines(true);
    }
  }, [lineHeight]);

  return (
    <p
      ref={ref}
      className={clsx(
        "text-justify",
        isMoreThenTwoLines || (indentRequired && "indent-4 lg:indent-6"),
        className
      )}
    >
      {children}
    </p>
  );
}
