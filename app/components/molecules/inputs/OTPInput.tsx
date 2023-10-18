import { Input } from "@/app/components/atoms/common/Input";
import messages from "@/app/constants/messages.json";
import clsx from "clsx";
import { useRef } from "react";
import { Control, Controller } from "react-hook-form";
import LibraryInput from "react-otp-input";

const CODE_LENGTH = 6;

interface Props {
  // TODO: figure out proper type
  control: Control<any, any>;
  containerClassName?: string;
}

export function OTPInput({ control, containerClassName }: Props) {
  const storedErrorRef = useRef("");

  return (
    <Controller
      name="code"
      // Needed to avoid changing an uncontrolled input to be controlled
      defaultValue=""
      control={control}
      rules={{
        required: messages.validation.required,
        minLength: {
          message: messages.validation.required,
          value: CODE_LENGTH,
        },
      }}
      render={({
        field: { name, onBlur, onChange, ref, value },
        fieldState: { error },
      }) => {
        storedErrorRef.current = error?.message || storedErrorRef.current;

        return (
          <div className={containerClassName}>
            <LibraryInput
              value={value}
              onChange={onChange}
              numInputs={CODE_LENGTH}
              containerStyle={clsx("flex gap-1")}
              inputStyle={clsx(
                "w-[51px] h-[54px]",
                "border border-solid rounded-xl",
                "text-center text-2xl",
                "transition-colors duration-300 ease-in-out",
                "focus:bg-purple/10",
                !error && "border-[#D8D6DC] focus:border-purple",
                error && "border-pink"
              )}
              renderInput={({ style, ...props }) => <Input {...props} />}
            />
            <p
              className={clsx(
                "overflow-hidden mt-1 text-pink",
                "transition-max-height duration-500 ease-in-out",
                !error && "max-h-0",
                error && "max-h-28"
              )}
            >
              {storedErrorRef.current}
            </p>
          </div>
        );
      }}
    />
  );
}
