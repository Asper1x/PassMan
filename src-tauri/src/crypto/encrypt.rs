use ring::aead::Aad;

use super::CryptoManager;

pub trait CryptoMngEncrypt {
    fn encrypt(&mut self, data: &[u8]) -> Vec<u8>;
}

impl CryptoMngEncrypt for CryptoManager {
    fn encrypt(&mut self, data: &[u8]) -> Vec<u8> {
        let mut in_out = data.to_vec();

        let tag = self
            .sealing_key
            .seal_in_place_separate_tag(Aad::empty(), &mut in_out)
            .unwrap();

        self.tag = Some(tag);

        return in_out;
    }
}
