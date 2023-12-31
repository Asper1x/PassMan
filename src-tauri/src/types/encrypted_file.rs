#[derive(Debug)]
pub struct EncryptedFile {
    pub data: Vec<u8>,
    pub tag: [u8; 16],
}

impl EncryptedFile {
    pub fn new(data: Vec<u8>, tag: [u8; 16]) -> EncryptedFile {
        EncryptedFile { data, tag }
    }
}
