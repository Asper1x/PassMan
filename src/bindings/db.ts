import { Record, Records } from "@/types/DataBase";
import { fs, invoke } from "@tauri-apps/api";
import { appDataDir, join } from "@tauri-apps/api/path";
import { readDir, BaseDirectory } from "@tauri-apps/api/fs";
import queryClient from "@/queryClient";
import { AlgorithmTypes } from "@/types/AlgorithmTypes";

function algoTypeSerialize(algoType: AlgorithmTypes) {
  return typeof algoType == "string" ? algoType : AlgorithmTypes[algoType];
}

export function getRecords(): Promise<Records> {
  return invoke("get_records");
}

export function updateRecord(id: number, record: Record) {
  return invoke("update_record", { id, record });
}

export function saveFile() {
  return invoke("save_file");
}

export function addRecord(record: Omit<Record, "id">) {
  return invoke("add_record", { record }).then(() => {
    queryClient.invalidateQueries({ queryKey: ["main-records"] });
  });
}

export function removeRecord(id: number) {
  return invoke("remove_record", { id }).then(() => {
    queryClient.invalidateQueries({ queryKey: ["main-records"] });
  });
}

export async function browseFiles(path: string) {
  let files = await readDir(path, { dir: BaseDirectory.AppData });
  return files;
}

export async function createFile(
  password: string,
  name: string,
  algoType: AlgorithmTypes
) {
  let appDir = await appDataDir();
  let encoded = new TextEncoder().encode(password);
  return await invoke("create_file", {
    password: Array.from(encoded),
    path: await join(appDir, "wallets", name),
    algoType: algoTypeSerialize(algoType),
  });
}

export async function openFile(
  password: string,
  name: string,
  algoType: AlgorithmTypes
) {
  let appDir = await appDataDir();
  let encoded = new TextEncoder().encode(password);
  let fullPath: boolean;
  try {
    fullPath = await fs.exists(name);
  } catch (e) {
    fullPath = false;
  }

  return await invoke("open_file", {
    password: Array.from(encoded),
    path: fullPath ? name : await join(appDir, "wallets", name),
    algoType: algoTypeSerialize(algoType),
  });
}
