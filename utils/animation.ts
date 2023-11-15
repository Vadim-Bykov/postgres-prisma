import { RefObject, useCallback, useEffect, useRef, useState } from "react";

const DURATION = 200;

export const useAnimateDetails = (
  details: RefObject<HTMLDetailsElement>,
  summary: RefObject<HTMLElement>,
  content: RefObject<HTMLDivElement>
) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const animation = useRef<Animation | null>(null);

  const onAnimationFinish = useCallback(
    (open: boolean) => {
      const detailsEl = details.current;

      if (!detailsEl) {
        return;
      }

      detailsEl.open = open;
      animation.current = null;
      setIsClosing(false);
      setIsExpanding(false);
      detailsEl.style.height = "";
      detailsEl.style.overflow = "";
    },
    [details]
  );

  const shrink = useCallback(() => {
    if (!details.current || !summary.current) {
      return;
    }

    setIsClosing(true);

    const startHeight = `${details.current.offsetHeight}px`;
    const endHeight = `${summary.current.offsetHeight}px`;

    if (animation.current) {
      animation.current.cancel();
    }

    animation.current = details.current.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: DURATION,
        easing: "ease-out",
      }
    );

    animation.current.onfinish = () => onAnimationFinish(false);
    animation.current.oncancel = () => setIsClosing(false);
  }, [details, onAnimationFinish, summary]);

  const expand = useCallback(() => {
    if (!details.current || !summary.current || !content.current) {
      return;
    }

    setIsExpanding(true);

    const startHeight = `${details.current.offsetHeight}px`;
    const endHeight = `${
      summary.current.offsetHeight + content.current.offsetHeight
    }px`;

    if (animation.current) {
      animation.current.cancel();
    }

    animation.current = details.current.animate(
      {
        height: [startHeight, endHeight],
      },
      {
        duration: DURATION,
        easing: "ease-out",
      }
    );
    animation.current.onfinish = () => onAnimationFinish(true);
    animation.current.oncancel = () => setIsExpanding(false);
  }, [content, details, onAnimationFinish, summary]);

  const open = useCallback(() => {
    const detailsEl = details.current;

    if (!detailsEl) {
      return;
    }

    detailsEl.style.height = `${detailsEl.offsetHeight}px`;
    detailsEl.open = true;
    window.requestAnimationFrame(() => expand());
  }, [details, expand]);

  useEffect(() => {
    const detailsEl = details.current;
    const summaryEl = summary.current;

    const onSummaryClick = (e: MouseEvent) => {
      if (!detailsEl || !summaryEl) {
        return;
      }
      e.preventDefault();

      detailsEl.style.overflow = "hidden";
      if (isClosing || !detailsEl.open) {
        open();
      } else if (isExpanding || detailsEl.open) {
        shrink();
      }
    };

    summaryEl?.addEventListener("click", onSummaryClick);

    return () => summaryEl?.removeEventListener("click", onSummaryClick);
  }, [
    content,
    details,
    isClosing,
    isExpanding,
    summary,
    animation,
    onAnimationFinish,
    shrink,
    expand,
    open,
  ]);
};
