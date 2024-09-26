import { Input, Props as InputProps } from "./Input";
import messages from "@/app/constants/messages.json";
import { EMAIL_REGEX } from "@/app/constants/validation";
import { UseFormRegister } from "react-hook-form";

interface Props extends InputProps {
  // TODO: figure out proper type
  register: UseFormRegister<any>;
}

export function EmailInput({ register, name = "email", ...props }: Props) {
  return (
    <Input
      type="email"
      autoComplete="email"
      label="Электронная почта"
      // placeholder="example@domain.com"
      {...props}
      {...register(name, {
        required: messages.validation.required,
        pattern: {
          value: EMAIL_REGEX,
          message: messages.validation.email,
        },
      })}
    />
  );
}
