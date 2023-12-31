import { openFile } from "@/bindings/db";
import queryClient from "@/queryClient";
import { AlgorithmTypes } from "@/types/AlgorithmTypes";
import styles from "./modal.module.css";
import Button from "@/components/Button/Button";
import { Check } from "lucide-react";
import { IModalProps } from "./MainPage/MainPage";
import { useQuery } from "@tanstack/react-query";
import { BaseDirectory } from "@tauri-apps/api/path";
import { readDir } from "@tauri-apps/api/fs";

export default function LastOpenedModal({ setActive }: IModalProps) {
  const { data } = useQuery({
    queryKey: ["wallet-files"],
    queryFn: () =>
      readDir("wallets", { dir: BaseDirectory.AppData, recursive: false }),
  });

  const action = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = event.currentTarget.password.value;
    const algoType = event.currentTarget.selectedAlgorithm.value;
    const selected = event.currentTarget.wallets.value;

    openFile(password, selected, algoType).then(async () => {
      await queryClient.invalidateQueries({ queryKey: ["main-records"] });
      setActive(false);
    });
  };

  return (
    <form onSubmit={action} className={styles.container}>
      <select name="wallets">
        {data?.map((entry) => (
          <option key={entry.name}>{entry.name}</option>
        ))}
      </select>

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
