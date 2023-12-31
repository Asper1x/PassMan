import { cloneElement, useState } from "react";
import { getRecords } from "@/bindings/db";
import { useQuery } from "@tanstack/react-query";
import RecordComponent from "@/components/Record/Record";
import styles from "./MainPage.module.css";
import ModalWindow from "@/components/ModalWindow/ModalWindow";
import Button from "@/components/Button/Button";
import Navbar from "@/components/NavBar/NavBar";
import CreateRecord from "@/components/CreateRecord/CreateRecord";
import LastOpenedModal from "../LastOpenedModal";
import { Plus } from "lucide-react";

export interface IModalProps {
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainPage() {
  const { data } = useQuery({
    queryKey: ["main-records"],
    queryFn: getRecords,
  });

  const [active, setActive] = useState(true);
  const [element, setElement] = useState<JSX.Element>(
    <LastOpenedModal setActive={setActive} />
  );

  const onClick = (element: JSX.Element) => {
    const withDispatch = cloneElement(element, { setActive });
    setElement(withDispatch);
    setActive(true);
  };

  return (
    <>
      <Navbar onClick={onClick} />
      <div className="sizing_container">
        {data &&
          data.map((record) => (
            <RecordComponent key={record.id} record={record} />
          ))}
        <Button
          className={styles.but}
          //@ts-ignore
          onClick={() => onClick(<CreateRecord />)}
        >
          <Plus />
        </Button>

        <ModalWindow active={active} setActive={setActive}>
          {element}
        </ModalWindow>
      </div>
    </>
  );
}

export default MainPage;
