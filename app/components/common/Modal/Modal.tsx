import ReactModal from "react-modal";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { IconButton } from "../../atoms/common/IconButton";
import { useEffect } from "react";

interface ModalClassNames extends ReactModal.Classes {
  closeIcon?: string;
}

export interface ModalProps
  extends Omit<ReactModal.Props, "isOpen" | "className"> {
  open: boolean;
  autoWidth?: boolean; // TODO remove this prop and pass styles instead
  className?: string | Partial<ModalClassNames>;
  withCloseIcon?: boolean;
  blockScrolling?: boolean;
}

export function Modal({
  open,
  className,
  autoWidth = false,
  withCloseIcon = false,
  blockScrolling = true,
  children,
  ...props
}: ModalProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && blockScrolling) {
      document.body.style.overflow = open ? "hidden" : "auto";
    }
  }, [open, blockScrolling]);

  return (
    <ReactModal
      isOpen={open}
      // TODO: share this value so it stays the same here and
      // in transition styles
      closeTimeoutMS={300}
      className={{
        base: clsx(
          styles.modalContent,
          typeof className === "object" && className.base,
          autoWidth && styles.autoWidth
        ),
        afterOpen: styles.afterOpenContent,
        beforeClose: styles.beforeCloseContent,
      }}
      overlayClassName={styles.modalOverlay}
      {...props}
    >
      <>
        {withCloseIcon && (
          <IconButton
            // FIXME:
            // @ts-ignore
            iconProps={{ name: "close.svg", size: "0.9rem" }}
            buttonProps={{
              className: clsx(
                "absolute top-5 right-5 z-10",
                "md:top-8 md:right-8",
                "transition-transform duration-300 ease-in-out",
                "hover:rotate-180",
                typeof className === "object" && className.closeIcon
              ),
              onClick: props.onRequestClose,
            }}
          />
        )}
        {children}
      </>
    </ReactModal>
  );
}
