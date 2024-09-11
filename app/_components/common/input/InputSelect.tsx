import clsx from "clsx";
import { camelCase } from "lodash-es";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  InputHTMLAttributes,
  OptionHTMLAttributes,
  forwardRef,
  useRef,
} from "react";
import { ErrorMessage } from "../../ErrorMessage";
import { InputLabel } from "./InputLabel";

// TODO: refactor

export interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options: OptionHTMLAttributes<HTMLOptionElement>[];
  containerClassName?: HTMLAttributes<HTMLDivElement>["className"];
  inputClassName?: HTMLAttributes<HTMLSelectElement>["className"];
  labelClassName?: HTMLAttributes<HTMLLabelElement>["className"];
  error?: string;
  label: string;
  renderRight?: React.FC;
  renderLeft?: React.FC;
}

export const InputSelect = forwardRef<HTMLSelectElement, Props>(function Input(
  {
    containerClassName,
    inputClassName,
    labelClassName,
    error,
    label,
    renderRight,
    renderLeft,
    options,
    ...props
  },
  ref
) {
  const id = camelCase(`${label} input`);

  const storedErrorRef = useRef("");
  storedErrorRef.current = error || storedErrorRef.current;

  return (
    <div className={containerClassName}>
      <div className="flex relative peer">
        {renderLeft?.({})}
        <select
          ref={ref}
          className={clsx(
            "peer",
            "w-full pt-5 pb-3 px-4 appearance-none",
            "border border-solid rounded-xl",
            "transition-colors duration-300 ease-in-out",
            !error && "border-[#D8D6DC] focus:border-purple",
            error && "border-pink"
          )}
          {...props}
        >
          {options.map(({ value, label, ...rest }) => (
            <option key={value as string | number} value={value} {...rest}>
              {label}
            </option>
          ))}
        </select>

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
      <ErrorMessage visible={!!error} className="ml-2">
        {storedErrorRef.current}
      </ErrorMessage>
    </div>
  );
});
