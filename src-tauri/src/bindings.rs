use crate::{
    types::{AlgorithmTypes, Record, Records},
    Database,
};
use tauri::State;

#[tauri::command]
pub fn get_records(db: State<'_, Database>) -> Records {
    db.0.lock().unwrap().records()
}

#[tauri::command]
pub fn update_record(id: u16, record: Record, db: State<'_, Database>) -> Result<Record, String> {
    db.0.lock().unwrap().update(id, &record)
}

#[tauri::command]
pub fn save_file(db: State<'_, Database>) {
    db.0.lock().unwrap().save()
}

#[tauri::command]
pub fn create_file(
    password: Vec<u8>,
    path: String,
    algo_type: AlgorithmTypes,
    db: State<'_, Database>,
) {
    db.0.lock()
        .unwrap()
        .create_file(password.as_ref(), path.into(), algo_type)
}

#[tauri::command]
pub fn open_file(
    password: Vec<u8>,
    path: String,
    algo_type: AlgorithmTypes,
    db: State<'_, Database>,
) -> Result<(), String> {
    db.0.lock()
        .unwrap()
        .from_file(password.as_ref(), path.into(), algo_type)
}

#[tauri::command]
pub fn add_record(db: State<'_, Database>, record: Record) {
    db.0.lock().unwrap().push(&record)
}

#[tauri::command]
pub fn remove_record(db: State<'_, Database>, id: u16) -> Result<Record, String> {
    db.0.lock().unwrap().remove(id)
}
