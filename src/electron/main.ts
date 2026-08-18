import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { pollResources, getStaticData } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";
import { ipcMainHandle } from "./util.js";

import PieceController from "./backend/controller/Piece.controller.js";
import GoalController from "./backend/controller/Goal.controller.js";
import ResourceController from "./backend/controller/Resource.controller.js";
import SessionController from "./backend/controller/Session.controller.js";
import AnalyticsController from "./backend/controller/Analytics.controller.js";
import TermController from "./backend/controller/Term.controller.js";

const pieceController = new PieceController();
const goalController = new GoalController();
const resourceController = new ResourceController();
const sessionController = new SessionController();
const termController = new TermController();
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
  ipcMainHandle("getStaticData", () => {
    return "hi";
  });
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
  ipcMainHandle("updatePiece", (req) => {
    return pieceController.updatePiece(req);
  });
  ipcMainHandle("deletePiece", (req) => {
    return pieceController.deletePiece(req.id);
  });

  //----Goal----
  ipcMainHandle("getAllPieceGoals", (req) => {
    return goalController.getAllPieceGoals(req.pieceId);
  });
  ipcMainHandle("addGoal", (req) => {
    return goalController.addGoal(req);
  });
  ipcMainHandle("updateGoal", (req) => {
    return goalController.updateGoal(req);
  });
  ipcMainHandle("deleteGoal", (req) => {
    return goalController.deleteGoal(req.id);
  });

  //----Resource----
  ipcMainHandle("getAllPieceResources", (req) => {
    return resourceController.getAllPieceResources(req.pieceId);
  });
  ipcMainHandle("addResource", (req) => {
    return resourceController.addResource(req);
  });
  ipcMainHandle("updateResource", (req) => {
    return resourceController.updateResource(req);
  });
  ipcMainHandle("deleteResource", (req) => {
    return resourceController.deleteResource(req.id);
  });

  //----Session----
  ipcMainHandle("getAllSessions", (req) => {
    return sessionController.getAllSessions(req);
  });
  ipcMainHandle("getAllPieceSessions", (req) => {
    return sessionController.getAllPieceSessions(req.pieceId);
  });
  ipcMainHandle("getAllPieceSubsessions", (req) => {
    return sessionController.getAllPieceSubsessions(req.pieceId);
  });
  ipcMainHandle("getOneSession", (req) => {
    return sessionController.getOneSession(req.id);
  });
  ipcMainHandle("getOneSubsession", (req) => {
    return sessionController.getOneSubsession(req.id);
  });
  ipcMainHandle("addNewSession", (req) => {
    return sessionController.addNewSession(req.sessionData);
  });
  ipcMainHandle("deleteSession", (req) => {
    return sessionController.deleteSession(req.id);
  });

  ipcMainHandle("updateSubsessionTime", (req) => {
    return sessionController.updateSubsessionTime(req);
  });
  ipcMainHandle("startSession", (req) => {
    return sessionController.startSession(req.id);
  });
  ipcMainHandle("nextSession", (req) => {
    return sessionController.nextSession(req);
  });
  ipcMainHandle("pauseSession", (req) => {
    return sessionController.pauseSession(req);
  });
  ipcMainHandle("finishSession", (req) => {
    return sessionController.finishSession(req);
  });

  //----Term----
  ipcMainHandle("getAllTerms", () => {
    try {
      return termController.getAllTerms();
    } catch (error) {
      throw error;
    }
  });
  ipcMainHandle("getAllPieceTerms", (req) => {
    return termController.getAllPieceTerms(req.pieceId);
  });
  ipcMainHandle("linkTermToPiece", (req) => {
    return termController.linkTermToPiece(req);
  });

  //----Analytics----
  ipcMainHandle("getAnalytics", (req) => {
    return analyticsController.getAnalytics(req);
  });
});
