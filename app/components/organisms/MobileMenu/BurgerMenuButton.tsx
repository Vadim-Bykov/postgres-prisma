import clsx from "clsx";
import styles from "./styles.module.css";

export const BurgerMenuButton = ({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) => {
  const updateMenu = () => {
    onClick();
  };

  return (
    <div className={clsx("gap-3 ", styles.burgerMenu)} onClick={updateMenu}>
      <div
        className={clsx(
          "bg-red",
          styles.burgerBar,
          isOpen ? styles.clicked : styles.unclicked
        )}
      />
      <div
        className={clsx(
          "bg-red",
          styles.burgerBar,
          isOpen ? styles.clicked : styles.unclicked
        )}
      />
      <div
        className={clsx(
          "bg-red",
          styles.burgerBar,
          isOpen ? styles.clicked : styles.unclicked
        )}
      />
    </div>
  );
};
