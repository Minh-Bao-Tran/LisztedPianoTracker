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
  addGoal: (req) => electron.ipcRenderer.invoke("addGoal", req),
  updateGoal: (req) => electron.ipcRenderer.invoke("updateGoal", req),
  deleteGoal: (req) => electron.ipcRenderer.invoke("deleteGoal", req),

  //----Resource Routes----
  getAllPieceResources: (req) =>
    electron.ipcRenderer.invoke("getAllPieceResources", req),
  addResource: (req) => electron.ipcRenderer.invoke("addResource", req),
  updateResource: (req) => electron.ipcRenderer.invoke("updateResource", req),
  deleteResource: (req) => electron.ipcRenderer.invoke("deleteResource", req),

  //----Session Routes----
  getAllSessions: (req) => electron.ipcRenderer.invoke("getAllSessions", req),
  getAllPieceSessions: (req) =>
    electron.ipcRenderer.invoke("getAllPieceSessions", req),
  getAllPieceSubsessions: (req) =>
    electron.ipcRenderer.invoke("getAllPieceSubsessions", req),
  getOneSession: (req) => electron.ipcRenderer.invoke("getOneSession", req),
  getOneSubsession: (req) =>
    electron.ipcRenderer.invoke("getOneSubsession", req),
  addNewSession: (req) => electron.ipcRenderer.invoke("addNewSession", req),

  updateSubsessionTime: (req) =>
    electron.ipcRenderer.invoke("updateSubsessionTime", req),
  nextSession: (req) =>
    electron.ipcRenderer.invoke("nextSession", req),

  //----Term Routes----
  getAllPieceTerms: (req) =>
    electron.ipcRenderer.invoke("getAllPieceTerms", req),
  //----Analytics Routes----
  getAnalytics: (req) => electron.ipcRenderer.invoke("getAnalytics", req),
} satisfies Window["electron"]);
