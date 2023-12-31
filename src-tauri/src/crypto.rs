use std::num::NonZeroU32;

use ring::{
    aead::{
        Algorithm, BoundKey, Nonce, NonceSequence, OpeningKey, SealingKey, Tag, UnboundKey,
        AES_128_GCM, AES_256_GCM, CHACHA20_POLY1305, NONCE_LEN,
    },
    error::Unspecified,
    pbkdf2::{self, PBKDF2_HMAC_SHA256},
};

pub use decrypt::CryptoMngDecrypt;
pub use encrypt::CryptoMngEncrypt;

use crate::types::AlgorithmTypes;

mod decrypt;
mod encrypt;

#[derive(Clone, Copy)]
pub struct CounterNonceSequence(u32);

impl NonceSequence for CounterNonceSequence {
    fn advance(&mut self) -> Result<Nonce, Unspecified> {
        let mut nonce_bytes = vec![0; NONCE_LEN];
        let bytes = self.0.to_be_bytes();
        nonce_bytes[8..].copy_from_slice(&bytes);

        self.0 = 1;
        Nonce::try_assume_unique_for_key(&nonce_bytes)
    }
}

pub struct CryptoManager {
    pub sealing_key: SealingKey<CounterNonceSequence>,
    pub opening_key: OpeningKey<CounterNonceSequence>,
    tag: Option<Tag>,
}

impl CryptoManager {
    pub fn new(
        password: &[u8],
        tag: Option<&[u8]>,
        algo_type: AlgorithmTypes,
    ) -> Result<CryptoManager, String> {
        let algo = match algo_type {
            AlgorithmTypes::Aes128GCM => &AES_128_GCM,
            AlgorithmTypes::Aes256GCM => &AES_256_GCM,
            AlgorithmTypes::ChaCha20Poly1305 => &CHACHA20_POLY1305,
        };

        let key_bytes = Self::generate_key(password, algo);

        let nonce_sequence = CounterNonceSequence(1);

        let unbound_key = UnboundKey::new(algo, &key_bytes);

        if let Err(_) = unbound_key {
            return Err("Invalid password or algorithm".into());
        }

        let sealing_key = SealingKey::new(
            UnboundKey::new(algo, &key_bytes).expect("Bad password"),
            nonce_sequence,
        );
        let opening_key = OpeningKey::new(
            UnboundKey::new(algo, &key_bytes).expect("Bad password"),
            nonce_sequence,
        );

        Ok(CryptoManager {
            sealing_key,
            opening_key,
            tag: match tag {
                Some(tag) => Some(Tag::try_from(tag).unwrap()),
                None => None,
            },
        })
    }

    pub fn tag(&self) -> Option<Tag> {
        return self.tag;
    }

    fn generate_key(password: &[u8], algo: &Algorithm) -> Vec<u8> {
        let mut to_store = vec![Default::default(); algo.key_len()];
        pbkdf2::derive(
            PBKDF2_HMAC_SHA256,
            NonZeroU32::new(100_000).unwrap(),
            &[0],
            &password,
            &mut to_store,
        );
        return to_store;
    }
}
