import {
  Input,
  Props as InputProps,
} from "@/app/components/atoms/common/Input";
import messages from "@/app/constants/messages.json";
import { leaveOnlyNumbers } from "@/utils/formatting";
// import InputMask from "@mona-health/react-input-mask";
import UsaFlagImage from "@public/images/flag-us.png";
import Image from "next/image";
import { Control, Controller } from "react-hook-form";

interface Props extends Omit<InputProps, "label"> {
  // TODO: figure out proper type
  control: Control<any, any>;
}

export function PhoneInput({ control }: Props) {
  return (
    <Controller
      name="phoneNumber"
      // Needed to avoid changing an uncontrolled input to be controlled
      defaultValue=""
      control={control}
      rules={{
        required: messages.validation.required,
        validate: (v) =>
          leaveOnlyNumbers(v).length !== 10
            ? messages.validation.phoneNumber
            : true,
      }}
      render={({ field, fieldState: { error } }) => (
        // <InputMask mask="(999)-999-9999" {...field}>
        <Input
          type="tel"
          autoComplete="tel-national"
          label="Phone number"
          placeholder="(000)-000-0000"
          error={error?.message}
          inputClassName="pl-20"
          labelClassName="ml-16"
          renderLeft={() => (
            <div className="absolute left-0 flex items-center h-full px-3 border-r border-r-[#D8D6DC]">
              <Image
                src={UsaFlagImage}
                alt="USA flag in a circle"
                className="h-5 w-5 mr-2"
              />
              <p>+1</p>
            </div>
          )}
        />
        // </InputMask>
      )}
    />
  );
}
