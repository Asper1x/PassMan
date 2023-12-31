use crate::types::Records;

pub trait Serialize {
    fn serialize(&self) -> String;
}

impl Serialize for Records {
    fn serialize(&self) -> String {
        return serde_json::to_string(self).expect("Invalid data");
    }
}

impl From<&[u8]> for Records {
    fn from(value: &[u8]) -> Self {
        return serde_json::from_slice(value).expect("Invalid data");
    }
}
