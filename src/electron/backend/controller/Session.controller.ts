//Control both Session and Subsession
import { Session } from "../class/Session.model.js";
import { Subsession } from "../class/Subsession.model.js";
import { Piece } from "../class/Piece.model.js";

import { db } from "../database/database.js";

export default class SessionController {
  constructor() {}

  //-----Session-----
  public getAllSession(
    _: any | null,
    {
      timeFrameStartDate = new Date(0),
      timeFrameEndDate = new Date(),
    }: { timeFrameStartDate?: Date; timeFrameEndDate?: Date },
  ): Session[] {
    db.getDb("session").join("subsessionIds");

    let allSessions: Session[];
    try {
      allSessions = db
        .getDb("session")
        .findMany({})
        .map((indexObj) => indexObj.obj);
    } catch (err) {
      throw err;
    }
    allSessions = allSessions.filter((obj) => {
      //Loop through all subsession
      // @ts-ignore
      for (const { startDate, endDate } of obj.subsessions) {
        //-----Validation-----
        if (!startDate || !endDate) {
          console.log(1);
          return false;
        }
        if (!startDate.getTime() || !endDate.getTime()) {
          console.log(2);
          return false;
        }
        if (
          startDate.getTime() < timeFrameStartDate.getTime() ||
          endDate.getTime() > timeFrameEndDate.getTime()
        ) {
          return false;
        }

        return true;
      }
    });
    return allSessions;
  }

  public getOneSession(_: any, id: string): IndexedObj<Session> | null {
    try {
      return db.getDb("session").findOnePrimaryKey(id);
    } catch (err) {
      throw err;
    }
  }

  public getAllPieceSessions(pieceId: string): SessionData[] {
    //Not the most efficient way but it works for small data
    const sessionTable = db.getDb("session");
    const subsessionTable = db.getDb("subsession");

    const subsessionDejoin = subsessionTable.reverseJoin(
      sessionTable,
      "sessions",
    );

    const goalDejoin = db
      .getDb("goal")
      .reverseJoin(subsessionTable, "subsessions");

    //Join Piece with Goal

    const pieceDejoin = db.getDb("piece").join("goalIds");

    let piece: Piece;
    try {
      //Join Piece with Goal
      db.getDb("piece").join("goalIds");
      //Get Piece
      const returnedPieceObj: IndexedObj<Piece> | null = db
        .getDb("piece")
        .findOnePrimaryKey(pieceId);

      if (!returnedPieceObj) {
        throw new Error("No object Found");
      }

      piece = returnedPieceObj.obj;
    } catch (err) {
      pieceDejoin();
      subsessionDejoin();
      goalDejoin();
      throw err;
    }
    const goalLists = [...(piece.goals ?? [])];

    //get all subsession
    const allSessions: Session[] = [];

    //Eliminate Repeats
    for (const goal of goalLists) {
      for (const subsession of goal.subsessions ?? []) {
        for (const session of subsession.sessions ?? [])
          if (!allSessions.includes(session)) {
            //already counted
            allSessions.push(session);
          }
      }
    }

    pieceDejoin();
    subsessionDejoin();
    goalDejoin();

    return allSessions;
  }

  public addNewSession(
    _: any,
    {
      session,
      subsessions,
    }: { session: Omit<Session, "id">; subsessions: Omit<Subsession, "id">[] },
  ) {
    return;
  }

  public practiceOldSession(_: any, sessionId: string) {
    //Create a new session with identical fields, also clone subsessions
    let indexedPastSession: IndexedObj<Session>;
    try {
      // @ts-ignore
      indexedPastSession = db.getDb("session").findOnePrimaryKey(sessionId);
    } catch (err) {
      throw err;
    }

    if (!indexedPastSession) {
      throw new Error("No Session Found");
    }
    const pastSession = indexedPastSession.obj;

    //create new subsessions
    const idList = [];
    // @ts-ignore
    for (const subsession of pastSession.subsessions) {
      try {
        const newSubsession = {
          ...subsession,
          id: null,
          time: 0,
          startDate: new Date(new Date().toDateString()),
          endDate: null,
        };
        const newId = db.getDb("subsession").insertOne(newSubsession);
        idList.push(newId);
      } catch (err) {
        throw err;
      }
    }

    const newSession: Session = { ...pastSession, subsessionIds: idList };
    // @ts-ignore
    delete newSession.id;

    const newSessionId = db.getDb("session").insertOne(newSession);

    return newSessionId;
  }

  public updateSession() {}

  public deleteSession() {}

  //------Subsession------

  public updateSubsessionTime(
    _: any,
    {
      subsessionId,
      incrementTime = 1,
    }: { subsessionId: string; incrementTime?: number },
  ) {
    try {
      db.getDb("subsession").updateOne(
        { id: subsessionId },
        {
          // @ts-ignore
          time: (db
            .getDb("subsession")
            .findOnePrimaryKey(subsessionId).obj.time += incrementTime),
        },
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
    return true;
  }

  public getAllPieceSubsession(pieceId: string): Subsession[] {
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
    pieceDejoin(); //not needed. Only reverseJoin usually need

    return allSubsessions;
  }
}
