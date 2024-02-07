import { useTransition } from "@react-spring/web";
import clsx from "clsx";
import { useState } from "react";
import { ResetPasswordSent } from "./ResetPasswordSent";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { Modal, ModalProps } from "../../common/Modal/Modal";
import { User } from "@/models/users";

interface Props extends ModalProps {
  email?: User["email"];
}

const ANIMATION_DURATION = 300;

export function ResetPasswordModal({
  open,
  email,
  onAfterClose,
  onRequestClose,
  ...props
}: Props) {
  const [resetLinkRequested, setResetLinkRequested] = useState(false);

  const transitions = useTransition(resetLinkRequested, {
    from: {
      opacity: 0.5,
      transform: "translate3d(100%,0,0)",
      minHeight: resetLinkRequested ? 272 : 170,
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0)",
      minHeight: resetLinkRequested ? 170 : 272,
    },
    exitBeforeEnter: true,
    config: { duration: ANIMATION_DURATION },
  });

  const onRequestResetLink = () => {
    setResetLinkRequested(true);
  };
  const onModalClosed = () => {
    onAfterClose?.();
    setResetLinkRequested(false);
  };

  return (
    <Modal
      className={{
        base: clsx(
          "p-10 lg:p-20 sm:w-[390px]",
          "w-[70%] box-content overflow-hidden"
        ),
      }}
      open={open}
      withCloseIcon
      onAfterClose={onModalClosed}
      onRequestClose={onRequestClose}
      {...props}
    >
      {transitions((style) => {
        return resetLinkRequested ? (
          <ResetPasswordSent onButtonClick={onRequestClose} style={style} />
        ) : (
          <ResetPasswordForm
            open={open}
            email={email}
            onRequestResetLink={onRequestResetLink}
            style={style}
          />
        );
      })}
    </Modal>
  );
}
