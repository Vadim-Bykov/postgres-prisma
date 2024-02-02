import {
  Input,
  Props as InputProps,
} from "@/app/components/atoms/common/Input";
import messages from "@/app/constants/messages.json";
import { NAME_REGEX } from "@/app/constants/validation";
import { UseFormRegister } from "react-hook-form";

interface Props extends Omit<InputProps, "type" | "label"> {
  variant: "firstName" | "lastName";
  // TODO: figure out proper type
  register: UseFormRegister<any>;
}

export function NameInput({ variant, register, ...props }: Props) {
  const firstName = variant === "firstName";

  return (
    <Input
      label={`${firstName ? "First" : "Last"} name`}
      type="text"
      autoComplete={`${firstName ? "given" : "family"}-name`}
      {...props}
      {...register(variant, {
        required: messages.validation.required,
      })}
    />
  );
}
