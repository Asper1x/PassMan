import styles from "./CreateRecord.module.css";
import Button from "../Button/Button";
import { addRecord } from "@/bindings/db";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { Check } from "lucide-react";

const useFormField = (initialValue: string = "") => {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    []
  );
  return { value, onChange };
};

export default function CreateRecord({
  setActive,
}: {
  setActive: Dispatch<SetStateAction<boolean>>;
}) {
  const serviceField = useFormField();
  const passwordField = useFormField();

  const action = (e: FormEvent) => {
    e.preventDefault();
    const record = {
      service: serviceField.value,
      password: passwordField.value,
    };

    addRecord(record);
    setActive(false);
  };

  return (
    <form onSubmit={action} className={styles.container}>
      <input
        name="service"
        className={styles.service_name}
        minLength={2}
        placeholder="Example"
        required
        {...serviceField}
      />

      <input
        className={styles.password}
        placeholder="********"
        name="password"
        type="password"
        minLength={5}
        required
        {...passwordField}
      />

      <Button type="submit">
        <Check />
      </Button>
    </form>
  );
}
