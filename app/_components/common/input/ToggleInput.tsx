import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes } from "react";
import { UseFormRegister } from "react-hook-form";

interface Props
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "type" | "className"
  > {
  label?: string;
  labelClassName?: HTMLAttributes<HTMLLabelElement>["className"];
  // TODO: figure out proper type
  register?: UseFormRegister<any>;
}

export function ToggleInput({
  label,
  name,
  register,
  labelClassName,
  ...props
}: Props) {
  return (
    <label className="relative flex items-center justify-between cursor-pointer">
      {label && (
        <span className={clsx("font-semibold", labelClassName)}>{label}</span>
      )}
      <input
        type="checkbox"
        className="sr-only peer"
        {...props}
        {...(register?.(name || "toggle") ?? {})}
      />
      <div
        className={clsx(
          ["relative", "w-10", "h-6", "rounded-full", "bg-gray"],
          [
            "peer-checked:bg-purple",
            "peer-checked:after:translate-x-full",
            "peer-checked:after:border-white",
            "peer-focus:ring-purple",
            "peer-focus:ring-1",
            "peer-hover:ring-purple",
            "peer-hover:ring-1",
          ],
          ["transition-all", "duration-300", "ease-in-out"],
          [
            "after:absolute",
            "after:top-1",
            "after:left-1",
            "after:w-4",
            "after:h-4",
            "after:bg-white",
            "after:rounded-full",
          ],
          ["after:transition-all", "after:duration-300", "after:ease-in-out"]
        )}
      />
    </label>
  );
}
