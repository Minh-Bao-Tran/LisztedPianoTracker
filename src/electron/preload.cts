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

  //----Piece Routes----
  getAllPiece: () => electron.ipcRenderer.invoke("getAllPiece"),
  getOnePiece: (req) => electron.ipcRenderer.invoke("getOnePiece", req),
  addPiece: (req) => electron.ipcRenderer.invoke("addPiece", req),
  updatePiece: (req) => electron.ipcRenderer.invoke("updatePiece", req),
  //----Goal Routes----
  getAllPieceGoals: (req) =>
    electron.ipcRenderer.invoke("getAllPieceGoals", req),

  //----Resource Routes----
  getAllPieceResources: (req) =>
    electron.ipcRenderer.invoke("getAllPieceResources", req),
  addResource: (req) => electron.ipcRenderer.invoke("addResource", req),
  updateResource: (req) => electron.ipcRenderer.invoke("updateResource", req),
  deleteResource: (req) => electron.ipcRenderer.invoke("deleteResource", req),

  //----Session Routes----
  getAllPieceSessions: (req) =>
    electron.ipcRenderer.invoke("getAllPieceSessions", req),
  getAllPieceSubsessions: (req) =>
    electron.ipcRenderer.invoke("getAllPieceSubsessions", req),

  //----Term Routes----
  getAllPieceTerms: (req) =>
    electron.ipcRenderer.invoke("getAllPieceTerms", req),
  //----Analytics Routes----
  getAnalytics: (req) => electron.ipcRenderer.invoke("getAnalytics", req),
} satisfies Window["electron"]);
