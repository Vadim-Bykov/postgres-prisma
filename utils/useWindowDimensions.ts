"use client";

import { debounce } from "lodash-es";
import { useEffect, useState } from "react";

export function useWindowDimensions(delay = 700) {
  const [width, setWidth] = useState(global?.window?.innerWidth);
  const [height, setHeight] = useState(global?.window?.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window?.innerWidth);
      setHeight(window?.innerHeight);
    };
    const debouncedHandleResize = debounce(handleResize, delay);
    window.addEventListener("resize", debouncedHandleResize);
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [delay]);

  return { width, height, isMobile: width < 768 };
}
