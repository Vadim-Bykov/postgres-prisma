import { AnimatedProps, animated } from "@react-spring/web";
import { CSSProperties } from "react";
import Button from "../../atoms/common/Button";
import { ModalProps } from "../../common/Modal/Modal";

interface Props extends AnimatedProps<{ style: CSSProperties }> {
  onButtonClick: ModalProps["onRequestClose"];
}

export function ResetPasswordSent({ onButtonClick, style }: Props) {
  return (
    <animated.div
      style={style}
      className="flex flex-col basis-full gap-6 w-ful"
    >
      <div>
        <h1 className="text-3xl font-semibold mb-2">Check your email!</h1>
        <p>We have sent you a link to reset your password.</p>
      </div>

      <Button size="large" onClick={onButtonClick}>
        Okay!
      </Button>
    </animated.div>
  );
}
