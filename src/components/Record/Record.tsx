import { Record } from "@/types/DataBase";
import styles from "./Record.module.css";
import Icon from "../Icon/Icon";
import { useRef, useState } from "react";
import { removeRecord, updateRecord } from "@/bindings/db";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

const defaultValue = "********";

export default function RecordComponent({ record }: { record: Record }) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [iconName, setIconName] = useState<"Eye" | "PencilLine">("Eye");

  const nameEdit = (event: React.FormEvent<HTMLSpanElement>) => {
    const newName = event.currentTarget.textContent;
    if (newName && newName.length >= 1)
      updateRecord(record.id, { ...record, service: newName });
  };

  const passwordEdit = () => {
    if (!inputRef.current) {
      return;
    }

    setIconName("PencilLine");
  };

  const deleteRecord = () => {
    removeRecord(record.id);
  };

  const seePassword = () => {
    if (!inputRef.current) {
      return;
    }
    if (iconName == "PencilLine") {
      updateRecord(record.id, { ...record, password: inputRef.current.value });
      queryClient.invalidateQueries({ queryKey: ["main-records"] });
    }
    setIconName("Eye");
    if (inputRef.current.type == "text") {
      inputRef.current.type = "password";
      inputRef.current.value = defaultValue;
      inputRef.current.readOnly = true;
    } else {
      inputRef.current.value = record.password;
      inputRef.current.type = "text";
      inputRef.current.readOnly = false;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.data}>
        <span
          className={styles.service_name}
          onInput={nameEdit}
          contentEditable
          suppressContentEditableWarning
        >
          {record.service}
        </span>
        <input
          className={styles.password}
          type="password"
          defaultValue={defaultValue}
          ref={inputRef}
          onChange={passwordEdit}
          onBlur={() => {
            if (!inputRef.current) {
              return;
            }
            setIconName("Eye");
            inputRef.current.type = "password";
            inputRef.current.value = defaultValue;
          }}
          readOnly
        />
      </div>
      <div className={styles.buttons}>
        <Icon
          name={iconName}
          onMouseDown={seePassword}
          className={styles.bigger}
        />
        <Trash2
          name="trash-2"
          onMouseDown={deleteRecord}
          size={18}
          className={styles.smaller}
        />
      </div>
    </div>
  );
}
