import { Dispatch, ReactNode, SetStateAction } from "react";
import styles from "./ModalWindow.module.css";

export default function ModalWindow({
  active,
  setActive,
  children,
}: {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) {
  return (
    <>
      <div
        className={active ? styles.popUpActive : styles.popUp}
        onClick={() => {
          setActive(false);
        }}
      >
        <div
          className={active ? styles.popUpMenuActive : styles.popUpMenu}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
}
