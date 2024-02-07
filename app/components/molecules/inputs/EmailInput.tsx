import {
  Input,
  Props as InputProps,
} from "@/app/components/atoms/common/Input";
import messages from "@/app/constants/messages.json";
import { EMAIL_REGEX } from "@/app/constants/validation";
import { UseFormRegister } from "react-hook-form";

interface Props extends Omit<InputProps, "label"> {
  // TODO: figure out proper type
  register: UseFormRegister<any>;
}

export function EmailInput({ register, ...props }: Props) {
  return (
    <Input
      type="email"
      label="Электронная почта"
      // placeholder="example@domain.com"
      {...props}
      {...register("email", {
        required: messages.validation.required,
        pattern: {
          value: EMAIL_REGEX,
          message: messages.validation.email,
        },
      })}
    />
  );
}
