#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use reqwest::blocking::get;


mod local_storage {
    use std::collections::HashMap;
    use std::sync::Mutex;

    lazy_static::lazy_static! {
        static ref STORAGE: Mutex<HashMap<String, String>> = Mutex::new(HashMap::new());
    }

    pub fn set(key: String, value: String) {
        let mut storage = STORAGE.lock().unwrap();
        storage.insert(key, value);
    }

    pub fn get(key: String) -> Option<String> {
        let storage = STORAGE.lock().unwrap();
        storage.get(&key).cloned()
    }
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_url,set_item,get_item])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}

#[tauri::command]
fn check_url(url: &str) -> bool {
  match get(url) {
      Ok(response) => {
          if response.status().is_success() {
              true
          } else {
              false
          }
      }
      Err(_) => false,
  }
}

#[tauri::command]
fn set_item(key: String, value: String) {
    local_storage::set(key, value);
}

#[tauri::command]
fn get_item(key: String) -> Option<String> {
    local_storage::get(key)
}
