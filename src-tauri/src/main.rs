#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{CustomMenuItem, Event, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, Manager};

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String,
}

fn main() {
  let quit = CustomMenuItem::new("quit".to_string(), "Quit");
  let start = CustomMenuItem::new("start".to_string(), "Start");
  let tray_menu = SystemTrayMenu::new()
    .add_item(start)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(quit);

  let mut app = tauri::Builder::default()
    .setup(|app| {
      let id = app.listen_global("frontend-onTimerStart", |event| {
        // tauri::api::dialog::message
      });
      Ok(())
    })
    .system_tray(SystemTray::new().with_menu(tray_menu))
    .on_system_tray_event(|app, event| match event {
      SystemTrayEvent::LeftClick {
        position: _,
        size: _,
        ..
      } => {
        let window = app.get_window("main").unwrap();
        window.show().unwrap();
        window.set_focus().unwrap();
        println!("system tray received a left click");
      }
      SystemTrayEvent::RightClick {
        position: _,
        size: _,
        ..
      } => {
        println!("system tray received a right click");
      }
      SystemTrayEvent::MenuItemClick { id, .. } => {
        match id.as_str() {
          "quit" => {
            std::process::exit(0);
          }
          "start" => {
            app.emit_all("backend-onTimerStart", {}).unwrap();
          }
          _ => {}
        };
      }
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");

    // app.run(|app_handle, e| match e {
    //       // Keep the event loop running even if all windows are closed
    //   // This allow us to catch system tray events when there is no window
    //   Event::ExitRequested { api, .. } => {
    //     api.prevent_exit();
    //   }
    // });
}
