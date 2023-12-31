import { createFile } from "@/bindings/db";
import queryClient from "@/queryClient";
import { AlgorithmTypes } from "@/types/AlgorithmTypes";
import styles from "./modal.module.css";
import Button from "@/components/Button/Button";
import { Check } from "lucide-react";
import { IModalProps } from "./MainPage/MainPage";

export default function AddWalletModal({ setActive }: IModalProps) {
  const action = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = event.currentTarget.password.value;
    const algoType = event.currentTarget.selectedAlgorithm.value;
    const name = event.currentTarget.wallet_name.value;

    createFile(password, name, algoType).then(async () => {
      await queryClient.invalidateQueries({ queryKey: ["main-records"] });
      setActive(false);
    });
  };

  return (
    <form onSubmit={action} className={styles.container}>
      <input
        name="wallet_name"
        placeholder="My wallet"
        type="text"
        minLength={5}
        required
      />

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
