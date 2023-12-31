import clsx from "clsx";
import { type ButtonHTMLAttributes, type DetailedHTMLProps } from "react";
import styles from "./Button.module.css";

export default function Button({
  className,
  children,
  ...rest
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button {...rest} className={clsx(className, styles.but)}>
      {children}
    </button>
  );
}
