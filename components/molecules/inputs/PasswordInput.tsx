// import { IconButton } from "@/constants/atoms/common/IconButton";
import { Input, Props as InputProps } from "@/components/atoms/common/Input";
import messages from "@/constants/messages.json";
import { useState } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface Props extends InputProps {
  // TODO: figure out proper type
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions<any, string>;
}

export function PasswordInput({
  register,
  label,
  name,
  registerOptions = {},
  ...props
}: Props) {
  const [passwordHidden, setPasswordHidden] = useState(true);

  const togglePasswordVisability = () => {
    setPasswordHidden((prevState) => !prevState);
  };

  return (
    <Input
      type={passwordHidden ? "password" : "text"}
      label={label ?? "Password"}
      placeholder="******"
      // renderRight={() => (
      //   <IconButton
      //     buttonProps={{
      //       className: "absolute right-0 bottom-1/2 translate-y-1/2 p-4",
      //       onClick: togglePasswordVisability,
      //     }}
      //     iconProps={{
      //       name: passwordHidden ? "eye-open.svg" : "eye-closed.svg",
      //     }}
      //   />
      // )}
      {...props}
      {...register(name ?? "password", {
        required: messages.validation.required,
        ...registerOptions,
      })}
    />
  );
}
