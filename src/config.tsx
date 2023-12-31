import dynamicIconImports from "lucide-react/dynamicIconImports";
import AddWalletModal from "./entities/AddWalletModal";
import NewWalletModal from "./entities/NewWalletModal";

type IModalEntity = {
  label: string;
  name: string;
  icon: keyof typeof dynamicIconImports;
  element: JSX.Element;
};

export const NavEntities: IModalEntity[] = [
  {
    label: "Add wallet",
    name: "",
    icon: "folder-open",
    //@ts-ignore
    element: <AddWalletModal />,
  },
  {
    label: "New wallet",
    name: "/new",
    icon: "file-plus-2",
    //@ts-ignore
    element: <NewWalletModal />,
  },
];
