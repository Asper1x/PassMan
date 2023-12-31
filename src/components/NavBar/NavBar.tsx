import { useState } from "react";
import Icon from "../Icon/Icon";
import styles from "./NavBar.module.css";
import clsx from "clsx";
import { NavEntities } from "@/config";
import { Menu } from "lucide-react";

export default function Navbar({
  onClick,
}: {
  onClick: (element: JSX.Element) => void;
}) {
  const [isClosed, setClosed] = useState(true);

  return (
    <nav className={clsx("sizing_container", styles.nav_bar)}>
      <Menu
        onClick={() => setClosed((prevous) => !prevous)}
        className={clsx(styles.collapse, !isClosed && styles.spinning)}
      />
      <div
        className={clsx(styles.pages_menu, !isClosed && styles.pages_menu_anim)}
      >
        <hr />

        {NavEntities.map((page) => (
          <span
            key={page.name}
            className={styles.collapse}
            title={page.label}
            onClick={() => onClick(page.element)}
          >
            <Icon name={page.icon} />
          </span>
        ))}
      </div>
    </nav>
  );
}
