import clsx from "clsx";
import { camelCase } from "lodash-es";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  InputHTMLAttributes,
  forwardRef,
  useRef,
} from "react";
import { ErrorMessage } from "./ErrorMessage";
import { InputLabel } from "./InputLabel";

export interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  containerClassName?: HTMLAttributes<HTMLDivElement>["className"];
  inputClassName?: HTMLAttributes<HTMLInputElement>["className"];
  labelClassName?: HTMLAttributes<HTMLLabelElement>["className"];
  error?: string;
  label?: string;
  renderRight?: React.FC;
  renderLeft?: React.FC;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    containerClassName,
    inputClassName,
    labelClassName,
    error,
    label,
    renderRight,
    renderLeft,
    ...props
  },
  ref
) {
  const id =
    props.id ||
    (label || props.name
      ? camelCase(`${label || props.name} input`)
      : undefined);

  const storedErrorRef = useRef("");
  storedErrorRef.current = error || storedErrorRef.current;

  return (
    <div className={containerClassName}>
      <div className="flex relative peer">
        {renderLeft?.({})}
        <input
          ref={ref}
          id={id}
          className={clsx(
            "peer",
            "w-full pt-5 pb-3 px-4",
            "border border-solid rounded-xl",
            "transition-colors duration-300 ease-in-out",
            "focus:outline-none focus:ring-1",
            !error && "border-[#D8D6DC] focus:ring-purple",
            error && "border-pink focus:ring-pink",
            inputClassName
          )}
          {...props}
          // Use empty space as a placeholder so we can detect
          // with CSS if input has a value or not
          // https://stackoverflow.com/a/35302732
          placeholder={props.placeholder || " "}
        />
        {label && (
          <InputLabel
            inputState={{
              id: id!,
              hasPlaceholder: !!props.placeholder,
              hasError: !!error,
            }}
            className={labelClassName}
          >
            {label}
          </InputLabel>
        )}
        {renderRight?.({})}
      </div>
      <ErrorMessage visible={!!error}>{storedErrorRef.current}</ErrorMessage>
    </div>
  );
});
