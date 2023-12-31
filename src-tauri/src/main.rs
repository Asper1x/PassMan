// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::sync::{Arc, Mutex};

use bindings::{
    add_record, create_file, get_records, open_file, remove_record, save_file, update_record,
};
use db::DBManager;

mod bindings;
mod crypto;
mod db;
mod helpers;
mod types;

#[derive(Default)]
struct Database(Arc<Mutex<DBManager>>);

fn main() {
    tauri::Builder::default()
        .manage(Database(Default::default()))
        .invoke_handler(tauri::generate_handler![
            get_records,
            update_record,
            save_file,
            create_file,
            open_file,
            add_record,
            remove_record
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
