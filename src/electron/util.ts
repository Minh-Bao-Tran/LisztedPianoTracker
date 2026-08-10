//Backend

import { ipcMain, ipcRenderer, WebContents } from "electron";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

//This function makes the whole process from backend to frontend typesafe. This is because the communication by default is not type safe
//keyof limits the type to only the defined event types
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
