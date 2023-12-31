use ring::aead::Aad;

use super::CryptoManager;

#[derive(Debug)]
pub enum DecryptionErrors {
    TagIsEmpty,
    InvalidPasswordOrCorruptedFile,
}

pub trait CryptoMngDecrypt {
    fn decrypt(&mut self, data: &[u8]) -> Result<Vec<u8>, DecryptionErrors>;
}

impl From<DecryptionErrors> for String {
    fn from(value: DecryptionErrors) -> Self {
        match value {
            DecryptionErrors::TagIsEmpty => "Tag is empty".into(),
            DecryptionErrors::InvalidPasswordOrCorruptedFile => {
                "Invalid password, algorithm or corrupted file".into()
            }
        }
    }
}

impl CryptoMngDecrypt for CryptoManager {
    fn decrypt(&mut self, data: &[u8]) -> Result<Vec<u8>, DecryptionErrors> {
        if let Some(tag) = self.tag {
            let mut cypher_text_with_tag = [data, tag.as_ref()].concat();
            let decrypted_data = self
                .opening_key
                .open_in_place(Aad::empty(), &mut cypher_text_with_tag);

            return match decrypted_data {
                Ok(data) => Ok(data.to_vec()),
                Err(_) => Err(DecryptionErrors::InvalidPasswordOrCorruptedFile),
            };
        } else {
            return Err(DecryptionErrors::TagIsEmpty);
        }
    }
}
