import { openFile } from "@/bindings/db";
import queryClient from "@/queryClient";
import { AlgorithmTypes } from "@/types/AlgorithmTypes";
import { open } from "@tauri-apps/api/dialog";
import styles from "./modal.module.css";
import Button from "@/components/Button/Button";
import { Check } from "lucide-react";
import { useState } from "react";
import { IModalProps } from "./MainPage/MainPage";

export default function AddWalletModal({ setActive }: IModalProps) {
  const [selected, setSelected] = useState("");

  const action = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = event.currentTarget.password.value;
    const algoType = event.currentTarget.selectedAlgorithm.value;

    openFile(password, selected, algoType).then(async () => {
      await queryClient.invalidateQueries({ queryKey: ["main-records"] });
      setActive(false);
    });
  };

  const onOpen = () => {
    open({ multiple: false }).then((value) => {
      if (value && !Array.isArray(value)) {
        setSelected(value);
      }
    });
  };

  return (
    <form onSubmit={action} className={styles.container}>
      <div className={styles.open_container}>
        <Button onClick={onOpen}>Open</Button>
        <span>{selected.split("/").at(-1)}</span>
      </div>

      <input
        name="password"
        className={styles.password}
        placeholder="********"
        type="password"
        minLength={5}
        required
      />

      <select name="selectedAlgorithm">
        {Object.values(AlgorithmTypes)
          .filter((val) => typeof val != "number")
          .map((type) => (
            <option key={type}>{type}</option>
          ))}
      </select>

      <Button type="submit">
        <Check />
      </Button>
    </form>
  );
}
