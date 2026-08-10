import { Goal } from "../class/Goal.model.js";
import { Piece } from "../class/Piece.model.js";
import { Subsession } from "../class/Subsession.model.js";

import { db } from "../database/database.js";

export default class AnalyticsController {
  private getAllGoalCompleted(pieceId: string): Goal[] | [] {
    //Join Piece with Goal
    const pieceDejoin = db.getDb("piece").join("goalIds");

    let returnedObj: IndexedObj<Piece> | null;

    returnedObj = db.getDb("piece").findOnePrimaryKey(pieceId);
    if (!returnedObj) {
      throw new Error("No object found");
    }

    const piece = returnedObj.obj;
    return (piece.goals as Goal[]).filter((goal: Goal) => {
      if (goal.ratings === 100) {
        return true;
      }
      return false;
    });
  }

  private getAllSubsessions(pieceId: string): Subsession[] {
    //without repeats//Join Goal with Subsession
    const subsessionTable = db.getDb("subsession");
    const goalDejoin = db
      .getDb("goal")
      .reverseJoin(subsessionTable, "subsessions");

    //Join Piece with Goal
    const pieceDejoin = db.getDb("piece").join("goalIds");

    let returnedObj: IndexedObj<Piece> | null;

    returnedObj = db.getDb("piece").findOnePrimaryKey(pieceId);
    if (!returnedObj) {
      throw new Error("No object found");
    }

    const piece = returnedObj.obj;

    //@ts-ignore
    const goalLists = [...piece.goals];

    //get all subsession
    const allSubsessions: Subsession[] = [];

    //Eliminate Repeats
    for (const goal of goalLists) {
      for (const subsession of goal.subsessions) {
        if (allSubsessions.includes(subsession)) {
          //already counted
          continue;
        }
        allSubsessions.push(subsession);
      }
    }

    goalDejoin();
    // console.log(piece);
    // pieceDejoin(); //not needed. Only reverseJoin usually need

    return allSubsessions;
  }

  private calculateTotalPieceTimeAndGetAllSubsessions({
    id,
    timeFrameEndDate = new Date(Date.now()),
    timeFrameStartDate = new Date(
      timeFrameEndDate.getTime() - 7 * 24 * 60 * 60 * 1000, //Default to 1 week timeFrame
    ),
  }: {
    id: string;
    timeFrameStartDate?: Date;
    timeFrameEndDate?: Date;
  }) {
    const allSubsessions = this.getAllSubsessions(id);
    let totalTime: number = 0; //In minutes

    const newSubsessions = [...allSubsessions];

    for (let i = allSubsessions.length - 1; i >= 0; i--) {
      const { startDate, endDate, time } = allSubsessions[i];

      //-----Validation-----
      //@ts-ignore
      if (!startDate.getTime() || !endDate.getTime()) {
        //Not started yet
        console.log(1);

        newSubsessions.splice(i, 1);
        continue;
      }
      if (
        // @ts-ignore
        startDate.getTime() < timeFrameStartDate.getTime() ||
        // @ts-ignore
        endDate.getTime() > timeFrameEndDate.getTime()
      ) {
        //Out of timeframe
        newSubsessions.splice(i, 1);
        continue;
      }

      // -----Increments-----
      totalTime += time;
    }

    // console.log(newSubsessions);

    return { totalTime, allSubsessions: newSubsessions }; //in minutes
  }

  public getAnalytics(
    {
      id,
      timeFrameEndDate = new Date(Date.now()),
      timeFrameStartDate = new Date(
        timeFrameEndDate.getTime() - 7 * 24 * 60 * 60 * 1000, //Default to 1 week timeFrame
      ),
    }: { id: string; timeFrameStartDate?: Date; timeFrameEndDate?: Date },
  ) {
    const { totalTime, allSubsessions } =
      this.calculateTotalPieceTimeAndGetAllSubsessions({
        id: id,
        timeFrameEndDate: timeFrameEndDate,
        timeFrameStartDate: timeFrameStartDate,
      });

    const averageTime = totalTime / allSubsessions.length;

    //find total reflections
    let totalReflections = 0;
    for (const subsession of allSubsessions) {
      if (subsession.reflections !== "") {
        totalReflections += 1;
      }
    }

    const totalSubsessionsNumber = allSubsessions.length;
    const sortedTotalSubsessions = [...allSubsessions].sort((a, b) => {
      // @ts-ignore
      return b.startDate.getTime() - a.startDate.getTime();
    });

    //Find Streak
    const latestSubsession = sortedTotalSubsessions[0];

    let streak = 0;
    let currentDate = timeFrameEndDate;
    for (const subsession of sortedTotalSubsessions) {
      // @ts-ignore
      const removedStartDate = subsession.startDate.toDateString();
      const removedCurrentDate = currentDate.toDateString();
      if (
        new Date(removedStartDate).getTime() - new Date().getTime() >
        1000 * 60 * 60 * 24
      ) {
        //remove the hours, minute, and seconds
        break;
      }

      if (
        removedCurrentDate === removedStartDate &&
        currentDate != timeFrameEndDate
      ) {
        continue;
      }
      streak += 1;
      // @ts-ignore
      currentDate = subsession.startDate;
    }

    const allGoalCompleted = this.getAllGoalCompleted(id).length;

    return {
      totalTime,
      averageTime,
      totalReflections,
      allGoalCompleted,
      totalSubsessionsNumber,
      streak,
      latestSubsession,
    };
  }
}
