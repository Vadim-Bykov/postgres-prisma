import clsx from "clsx";
import { PropsWithChildren } from "react";

// Avoid using `:invalid` pseudoclass since its firing on change, which results in bad UX
const getLabelClassNames = (hasPlaceholder: boolean, hasError: boolean) => {
  const classNames = {
    position: "absolute left-4",
    error: hasError && "text-pink",
    animation: "transition-all duration-300 ease-in-out",
    withPlaceholder: hasPlaceholder && [
      hasError && "text-pink",
      !hasError && "text-purple",
      "top-1.5 translate-y-0 text-[10px] opacity-100",
    ],
    withoutPlaceholder: !hasPlaceholder && [
      hasError && "text-pink",
      !hasError && "text-purple-dark",
      "top-1/2 -translate-y-1/2 opacity-50",
    ],
    focused: [
      "peer-focus:top-1.5",
      "peer-focus:translate-y-0",
      "peer-focus:text-[10px]",
      "peer-focus:opacity-100",
      !hasError && "peer-focus:text-purple",
      hasError && "peer-focus:text-pink",
    ],
    inputHasValue: [
      "peer-[:not(:placeholder-shown)]:top-1.5",
      "peer-[:not(:placeholder-shown)]:translate-y-0",
      "peer-[:not(:placeholder-shown)]:text-[10px]",
      "peer-[:not(:placeholder-shown)]:opacity-100",
      !hasError && "peer-[:not(:placeholder-shown)]:text-purple",
      hasError && "peer-[:not(:placeholder-shown)]:text-pink",
    ],
  };

  return Object.values(classNames);
};

type Props = PropsWithChildren<{
  inputState: {
    id: string;
    hasPlaceholder: boolean;
    hasError: boolean;
  };
  className?: string;
}>;

export function InputLabel({ inputState, className, children }: Props) {
  return (
    <label
      htmlFor={inputState.id}
      className={clsx(
        getLabelClassNames(inputState.hasPlaceholder, inputState.hasError),
        className
      )}
    >
      {children}
    </label>
  );
}
