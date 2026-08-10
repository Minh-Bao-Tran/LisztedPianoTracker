import { Piece, Status } from "../class/Piece.model.js";

import { db } from "../database/database.js";

export default class PieceController {
  constructor() {}

  public getAllPiece(): ExtendedPieceData[] {
    const subsessionTable = db.getDb("subsession");
    const goalDejoin = db
      .getDb("goal")
      .reverseJoin(subsessionTable, "subsessions");

    //Join Piece with Goal
    const pieceDejoin = db.getDb("piece").join("goalIds");
    const result = db
      .getDb("piece")
      .findMany({})
      .map((indexedObj) => indexedObj.obj)
      .map((piece) => {
        const latestGoal = piece.findLastPractice();
        let extendedData;
        if (!latestGoal) {
          //Default data:
          extendedData = {
            lastPracticeDate: "N/A",
            lastPracticeGoalName: "N/A",
          };
        } else {
          extendedData = {
            lastPracticeDate: latestGoal.lastPractice,
            lastPracticeGoalName: latestGoal.name,
          };
        }
        return { ...piece, ...extendedData };
      });

    pieceDejoin();
    goalDejoin();

    return result;
  }

  public getOnePiece(id: string): ExtendedPieceData | null {
    const subsessionTable = db.getDb("subsession");
    const goalDejoin = db
      .getDb("goal")
      .reverseJoin(subsessionTable, "subsessions");
    const pieceDejoin = db.getDb("piece").join("goalIds");

    let piece;
    try {
      piece = db.getDb("piece").findOnePrimaryKey(id);
    } catch (err) {
      goalDejoin();
      pieceDejoin();
      throw err;
    }
    if (piece !== null) {
      const latestGoal = piece.obj.findLastPractice();

      let extendedData;
      if (!latestGoal) {
        //Default data:
        extendedData = {
          lastPracticeDate: "N/A",
          lastPracticeGoalName: "N/A",
          lastGoalProgress: 0,
        };
      } else {
        extendedData = {
          lastPracticeDate: latestGoal.lastPractice,
          lastPracticeGoalName: latestGoal.name,
          lastGoalProgress: latestGoal.ratings
        };
      }

      goalDejoin();
      pieceDejoin();

      return { ...piece.obj, ...extendedData };
    }

    goalDejoin();
    pieceDejoin();
    return null;
  }

  public addPiece(piece: Omit<PieceData, "id">): ValidationResult {
    let newPieceId: string;
    try {
      newPieceId = db.getDb("piece").insertOne(piece as Piece);
    } catch (err) {
      throw err;
    }
    return { valid: true, value: newPieceId };
  }

  public updatePiece(
    _: any,
    {
      updateCriteria,
      updatingFields,
    }: {
      updateCriteria: Partial<Pick<Piece, keyof Piece>>;
      updatingFields: Partial<Piece>;
    },
  ) {
    let result: Piece;
    try {
      result = db.getDb("piece").updateOne(updateCriteria, updatingFields);
    } catch (err) {
      console.log(err);
      throw err;
    }
    return true;
  }

  public updateStatus(
    _: any,
    {
      updateCriteria, //usually id
      updatedStatus,
    }: {
      updateCriteria: Partial<Pick<Piece, keyof Piece>>;
      updatedStatus: Status;
    },
  ) {
    let result: Piece;
    try {
      result = db
        .getDb("piece")
        .updateOne(updateCriteria, { status: updatedStatus });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  public deletePiece(
    _: any,
    criteria: Partial<Pick<Piece, keyof Piece>>,
  ): boolean {
    try {
      db.getDb("piece").deleteOne(criteria, []);
    } catch (err) {
      throw err;
    }
    return true;
  }
}
