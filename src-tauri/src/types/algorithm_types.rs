use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum AlgorithmTypes {
    Aes128GCM,
    Aes256GCM,
    ChaCha20Poly1305,
}

impl Default for AlgorithmTypes {
    fn default() -> Self {
        AlgorithmTypes::Aes256GCM
    }
}
