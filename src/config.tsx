import { IconNames } from "./components/Icon/Icon";
import AddWalletModal from "./entities/AddWalletModal";
import NewWalletModal from "./entities/NewWalletModal";

type IModalEntity = {
  label: string;
  name: string;
  icon: IconNames;
  element: JSX.Element;
};

export const NavEntities: IModalEntity[] = [
  {
    label: "Add wallet",
    name: "",
    icon: "FolderOpen",
    //@ts-ignore
    element: <AddWalletModal />,
  },
  {
    label: "New wallet",
    name: "/new",
    icon: "FilePlus2",
    //@ts-ignore
    element: <NewWalletModal />,
  },
];
