import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Icon, { Props as IconProps } from "./Icon/Icon";

type Props = {
  iconProps: IconProps;
  buttonProps?: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
};

export function IconButton({ iconProps, buttonProps = {} }: Props) {
  return (
    <button type="button" {...buttonProps}>
      <Icon {...iconProps} />
    </button>
  );
}
