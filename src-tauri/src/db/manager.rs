use std::{collections::HashSet, fs::{File, create_dir_all}, path::PathBuf};

use crate::{
    crypto::{CryptoManager, CryptoMngDecrypt, CryptoMngEncrypt},
    helpers::{open_file, write_file, EncryptedFErrors},
    types::{AlgorithmTypes, EncryptedFile, Record, Records, VectorRecords},
};

pub struct DBManager {
    records: Records,
    crypto_manager: CryptoManager,
    file_path: PathBuf,
    free_ids: Vec<u16>,
}

enum AssignTypes {
    Update,
    Append,
}

impl DBManager {
    pub fn new() -> DBManager {
        let records = Records {
            records: Vec::new(),
        };
        let crypto_manager = CryptoManager::new(&[0], None, Default::default()).unwrap();
        let file_path = PathBuf::new();

        DBManager {
            records,
            crypto_manager,
            file_path,
            free_ids: Vec::new(),
        }
    }

    pub fn from_file(
        &mut self,
        password: &[u8],
        path: PathBuf,
        algo_type: AlgorithmTypes,
    ) -> Result<(), String> {
        let file: EncryptedFile = match open_file(&path) {
            Err(err) => {
                if matches!(err, EncryptedFErrors::SmallFile) {
                    let crypto_manager = CryptoManager::new(password, None, algo_type)?;

                    self.records = Records {
                        records: Vec::new(),
                    };
                    self.crypto_manager = crypto_manager;
                    self.file_path = path;
                    self.free_ids = Vec::new();
                }

                return Ok(());
            }
            Ok(file) => file,
        };

        let mut manager = CryptoManager::new(password, Some(&file.tag), algo_type)?;

        let records = manager.decrypt(&file.data)?;

        let records = Records::from(records.as_ref());
        let record_ids: HashSet<u16> = records.iter().map(|x| x.id.unwrap()).collect();
        let seq: HashSet<u16> = (0..(record_ids.len() as u16) + 1).collect();

        self.records = records;
        self.crypto_manager = manager;
        self.file_path = path;
        self.free_ids = Vec::from_iter(&seq - &record_ids);

        return Ok(());
    }

    pub fn create_file(&mut self, password: &[u8], path: PathBuf, algo_type: AlgorithmTypes) {
        let parent_folder = path.parent().unwrap();
        if !parent_folder.exists(){
            create_dir_all(parent_folder).expect("Failed to create directory");
        }

        File::create(&path).expect("Unable to create file");

        let crypto_manager = CryptoManager::new(password, None, algo_type).unwrap();

        self.records = Records {
            records: Vec::new(),
        };
        self.crypto_manager = crypto_manager;
        self.file_path = path;
        self.free_ids = Vec::new();
    }

    pub fn push(&mut self, record: &Record) {
        let new_record = self.assign_id(record, AssignTypes::Append);

        self.records.push(new_record);
        self.save();
    }

    pub fn remove(&mut self, id: u16) -> Result<Record, String> {
        if let Some(i) = self.records.index(id) {
            let removed = self.records.remove(i);
            self.free_ids.push(id);
            self.save();
            return Ok(removed);
        } else {
            return Err("No such record".into());
        }
    }

    pub fn update(&mut self, id: u16, record: &Record) -> Result<Record, String> {
        if let Some(i) = self.records.index(id) {
            self.records.records[i] = self.assign_id(record, AssignTypes::Update);
            self.save();
            return Ok(self.records.records[i].clone());
        } else {
            return Err("No such record".into());
        }
    }

    pub fn records(&self) -> Records {
        return self.records.clone();
    }

    pub fn save(&mut self) {
        let encrypted = self.encrypt();
        let binding = self.crypto_manager.tag().expect("Strange Error");
        let tag = binding.as_ref();

        write_file(&self.file_path, &encrypted, tag);
    }

    fn encrypt(&mut self) -> Vec<u8> {
        let serialized = self.serialize();
        return self.crypto_manager.encrypt(&serialized);
    }

    fn assign_id(&mut self, record: &Record, as_type: AssignTypes) -> Record {
        let mut new_record = record.clone();

        let coeff: u16;

        if let Some(_) = self.free_ids.last() {
            coeff = self.free_ids.pop().unwrap();
        } else {
            coeff = self.records.len().try_into().expect("A lot of data");
        }

        new_record.id = Some(match coeff > 0 && matches!(as_type, AssignTypes::Update) {
            true => new_record.id.unwrap(),
            false => coeff,
        });

        return new_record;
    }

    pub fn serialize(&self) -> Vec<u8> {
        return serde_json::to_vec(&self.records).expect("Invalid data");
    }
}

impl Default for DBManager {
    fn default() -> Self {
        return DBManager::new();
    }
}
