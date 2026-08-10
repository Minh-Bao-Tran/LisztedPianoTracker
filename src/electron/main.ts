import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { pollResources, getStaticData } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";
import { ipcMainHandle } from "./util.js";

import PieceController from "./backend/controller/Piece.controller.js";
import AnalyticsController from "./backend/controller/Analytics.controller.js";
import GoalController from "./backend/controller/Goal.controller.js";
import SessionController from "./backend/controller/Session.controller.js";

const pieceController = new PieceController();
const goalController = new GoalController();
const sessionController = new SessionController();
const analyticsController = new AnalyticsController();

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    width: 1440,
    height: 900,
    resizable: true,
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
  //Only run if the request for the routes is called
  //----Piece----
  ipcMainHandle("getAllPiece", () => {
    return pieceController.getAllPiece();
  });

  ipcMainHandle("getOnePiece", (req) => {
    //Req is always
    return pieceController.getOnePiece(req.id);
  });

  ipcMainHandle("addPiece", (req) => {
    return pieceController.addPiece(req);
  });

  //----Goal----
  ipcMainHandle("getAllPieceGoals", (req) => {
    return goalController.getAllPieceGoals(req.pieceId);
  });

  ipcMainHandle("getAllPieceSessions", (req) => {
    return sessionController.getAllPieceSessions(req.pieceId);
  });

  //----Analytics----
  ipcMainHandle("getAnalytics", (req) => {
    return analyticsController.getAnalytics(req);
  });

  ipcMainHandle("getStaticData", () => {
    return "hi";
  });
});
