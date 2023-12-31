use std::{
    fs::{self, File},
    io::Write,
    path::PathBuf,
};

use crate::types::EncryptedFile;

#[derive(Debug)]
pub enum EncryptedFErrors {
    NoSuchFile,
    SmallFile,
    UnknownErr,
}

pub fn open_file(path: &PathBuf) -> Result<EncryptedFile, EncryptedFErrors> {
    let mut data = match fs::read(path) {
        Ok(ve) => ve,
        Err(_) => return Err(EncryptedFErrors::NoSuchFile),
    };

    if data.len() <= 16 {
        return Err(EncryptedFErrors::SmallFile);
    }

    let tag: Vec<u8> = Vec::from(&data[data.len() - 16..]);
    data.truncate(data.len() - 16);
    let bb: Vec<u8> = tag.iter().take(16).map(|x| *x).collect();

    return match bb.try_into() {
        Ok(tag) => Ok(EncryptedFile::new(data, tag)),
        Err(_) => Err(EncryptedFErrors::UnknownErr),
    };
}

pub fn write_file(path: &PathBuf, data: &Vec<u8>, tag: &[u8]) {
    let mut file = File::options()
        .write(true)
        .truncate(true)
        .create(true)
        .open(path)
        .expect("No such file");

    file.write(&data).expect("Cannot write to file");
    file.write(&tag).expect("Cannot write to file");
}
