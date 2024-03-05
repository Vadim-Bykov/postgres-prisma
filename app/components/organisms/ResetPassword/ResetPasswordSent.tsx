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
        <h1 className="font-head text-3xl font-semibold mb-2">
          Проверьте почту!
        </h1>
        <p>Мы послали вам ссылку чтобы сбросить пароль.</p>
      </div>

      <Button size="large" onClick={onButtonClick}>
        Понял
      </Button>
    </animated.div>
  );
}
