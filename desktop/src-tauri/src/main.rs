#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use reqwest::blocking::get;


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_url])
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