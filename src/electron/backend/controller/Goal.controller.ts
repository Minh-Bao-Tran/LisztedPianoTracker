import { Goal } from "../class/Goal.model.js";
import { Piece } from "../class/Piece.model.js";

import { db } from "../database/database.js";

export default class GoalController {
  public getGoalById(_: any, goalId: string): IndexedObj<Goal> | null {
    try {
      return db.getDb("goal").findOnePrimaryKey(goalId);
    } catch (err) {
      throw err;
    }
  }

  public getAllPieceGoals(pieceId: string): Goal[] {
    let piece: Piece;
    try {
      //Join Piece with Goal
      db.getDb("piece").join("goalIds");
      //Get Piece
      // @ts-ignore
      const returnedPieceObj: IndexedObj<Piece> = db
        .getDb("piece")
        .findOnePrimaryKey(pieceId);

      if (!returnedPieceObj) {
        throw new Error("No object Found");
      }

      piece = returnedPieceObj.obj;
    } catch (err) {
      throw err;
    }
    // @ts-ignore
    return piece.goals;
  }

  public addGoal(
    //Add
    { pieceId, goal }: { pieceId: string; goal: Omit<GoalData, "id"> },
  ): string {
    //Get Piece
    const returnedPieceObj: IndexedObj<Piece> | null = db
      .getDb("piece")
      .findOnePrimaryKey(pieceId);

    if (!returnedPieceObj) {
      throw new Error("No object Found");
    }

    //create new goal obj
    let newGoalId: string;
    try {
      newGoalId = db.getDb("goal").insertOne(goal);
    } catch (err) {
      throw err;
    }

    try {
      db.getDb("piece").updateArrayMany("goalIds", newGoalId, "Push", {
        id: returnedPieceObj.obj.id,
      });
    } catch (err) {
      throw err;
    }

    return newGoalId;
  }

  public updateGoal({
    updateCriteria,
    updatingFields,
  }: {
    updateCriteria: Partial<Pick<Goal, keyof Goal>>;
    updatingFields: Partial<Goal>;
  }): true {
    try {
      db.getDb("goal").updateOne(updateCriteria, updatingFields);
    } catch (err) {
      throw err;
    }
    return true;
  }

  public deleteGoal(goalId: string): true {
    try {
      const subsessionTable = db.getDb("subsession");
      const pieceTable = db.getDb("piece");

      db.getDb("goal").deleteOne({ id: goalId }, [pieceTable, subsessionTable]);
    } catch (err) {
      throw err;
    }
    return true;
  }
}
