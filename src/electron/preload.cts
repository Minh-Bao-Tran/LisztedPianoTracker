//This is frontend

const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  //Makes the methods available for frontend to call
  subscribeStatistics: (callback: (statistics: any) => void) => {
    electron.ipcRenderer.on("statistics", (_: any, stats: any) => {
      callback(stats);
    });
  },
  getStaticData: () => electron.ipcRenderer.invoke("getStaticData"),
  getAllPiece: () => electron.ipcRenderer.invoke("getAllPiece"),
  getOnePiece: (req) => electron.ipcRenderer.invoke("getOnePiece", req),
  addPiece: (req) => electron.ipcRenderer.invoke("addPiece", req),
  getAnalytics: (req) => electron.ipcRenderer.invoke("getAnalytics", req),
  getAllPieceGoals: (req) =>
    electron.ipcRenderer.invoke("getAllPieceGoals", req),
  getAllPieceSessions: (req) =>
    electron.ipcRenderer.invoke("getAllPieceSessions", req),
} satisfies Window["electron"]);
