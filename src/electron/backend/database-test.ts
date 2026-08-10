// import { Database } from "./database/database.js";

// import PieceController from "./controller/Piece.controller.js";
// import GoalController from "./controller/Goal.controller.js";
// import ResourceController from "./controller/Resource.controller.js";
// import TermController from "./controller/Term.controller.js";
// import SessionController from "./controller/Session.controller.js";
// import AnalyticsController from "./controller/Analytics.controller.js";

// const db = new Database();
// // console.log(db.getDb("piece").foreignKeys);

// //All joins available
// db.getDb("piece").join("resourceIds");
// db.getDb("piece").join("goalIds");
// db.getDb("piece").join("termIds");

// db.getDb("subsession").join("goalIds");

// db.getDb("session").join("subsessionIds");

// const subsessionTable = db.getDb("subsession");

// // console.log(db.getDb("subsession").values);

// // db.getDb("goal").reverseJoin(subsessionTable, "subsessions");

// //------

// // const pieceController = new PieceController();

// // let resultingTime;

// // try {
// //   resultingTime = pieceController.calculateTotalPieceTimeAndGetAllSubsessions("", "P0002");
// // } catch (err) {
// //   throw err;
// // }

// // console.log(resultingTime);
// const pieceController = new PieceController();

// // console.log(
// //   pieceController.calculateTotalPieceTimeAndGetAllSubsessions("", {
// //     id: "P0002",
// //     timeFrameEndDate: new Date("2026-07-29"),
// //   }),
// // );

// const goalController = new GoalController();

// // goalController.addGoal("", {
// //   pieceId: "P0001",
// //   goal: {
// //     name: "Improve Bar 180 - 185",
// //     status: "Active",
// //     goalType: "Dynamic",
// //     notes: "None",
// //     ratings: 23,
// //   },
// // });

// // console.log(goalController.deleteGoal("", "G0004"));

// const resourceController = new ResourceController();
// // resourceController.updateResource(
// //   "",
// //   { id: "R0003" },
// //   { resourceLink: "https://youtube.com" },
// // );

// // resourceController.deleteResource("", "R0001")

// const termController = new TermController();

// // console.log(termController.addTerm("", {pieceId: null, term:{
// //     term: "Forte",
// //     type: "Dynamic",
// //     definition: "Loud",
// //     notes: "Careful and don't confuse with Fortissimo"
// // }}))

// // termController.removeExistingTermFromPiece("",{pieceId: "P0001", termId: "M0004"})

// // console.log(db.getDb("piece").findOnePrimaryKey("P0001"))

// const sessionController = new SessionController();

// // console.log(sessionController.getOneSession("", "S0001").obj.subsessions);
// console.log(sessionController.updateSubsessionTime("", {subsessionId: "B0005", incrementTime: 1}))
// // console.log(1 / 0);

// const analyticsController = new AnalyticsController();

// // console.log(
// //   analyticsController.getAnalytics("", {
// //     id: "P0001",
// //     timeFrameStartDate: new Date(null),
// //   }),
// // );

