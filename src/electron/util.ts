//Backend

import { ipcMain, ipcRenderer, WebContents } from "electron";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

// `ipcMainHandle` maps a typed EventMapping key to a handler so IPC requests
// and responses are type-checked at compile time while remaining runtime-safe.
// `keyof` restricts calls to known event names in `EventMapping`.
export function ipcMainHandle<Key extends keyof EventMapping>(
  key: Key,
  handler: (req: EventMapping[Key]["req"]) => EventMapping[Key]["res"], // value returned is the res
) {
  ipcMain.handle(key, (_, req: EventMapping[Key]["req"]) => {
    return handler(req);
  });
}

export function ipcWebContentsSend<Key extends keyof EventMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventMapping[Key]["res"],
) { 
  webContents.send(key, payload);
}
