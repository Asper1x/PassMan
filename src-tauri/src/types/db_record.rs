use std::slice::Iter;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(transparent)]
pub struct Records {
    pub records: Vec<Record>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]

pub struct Record {
    pub id: Option<u16>,
    pub service: String,
    pub password: String,
}

pub trait VectorRecords {
    fn push(&mut self, value: Record);
    fn remove(&mut self, id: usize) -> Record;
    fn len(&self) -> usize;
    fn iter(&self) -> Iter<'_, Record>;
    fn index(&self, id: u16) -> Option<usize>;
}

impl VectorRecords for Records {
    fn push(&mut self, value: Record) {
        return self.records.push(value);
    }
    fn remove(&mut self, id: usize) -> Record {
        return self.records.remove(id);
    }
    fn len(&self) -> usize {
        return self.records.len();
    }
    fn iter(&self) -> Iter<'_, Record> {
        return self.records.iter();
    }
    fn index(&self, id: u16) -> Option<usize> {
        return self
            .iter()
            .position(|x| x.id.is_some() && x.id.unwrap() == id);
    }
}
