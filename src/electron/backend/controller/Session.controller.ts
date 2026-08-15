//Control both Session and Subsession
import { Session } from "../class/Session.model.js";
import { Subsession } from "../class/Subsession.model.js";
import { Piece } from "../class/Piece.model.js";
import { Goal } from "../class/Goal.model.js";

import { db } from "../database/database.js";
import { session } from "electron";

export default class SessionController {
  constructor() {}

  //-----Session-----
  public getAllSessions({
    timeFrameStartDate = new Date(0),
    timeFrameEndDate = new Date(),
  }: {
    timeFrameStartDate?: Date;
    timeFrameEndDate?: Date;
  }): ExtendedSessionData[] {
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

    allSessions = allSessions
      .filter((obj) => {
        //Loop through all subsession

        for (const { date } of obj.subsessions ?? []) {
          //-----Validation-----
          // if (!date) {
          //   console.log(1);
          //   return false;
          // }
          // if (!date.getTime()) {
          //   console.log(2);
          //   return false;
          // }
          if (
            date &&
            (date.getTime() < timeFrameStartDate.getTime() ||
              date.getTime() > timeFrameEndDate.getTime())
          ) {
            return false;
          }

          return true;
        }

        return false;
      })
      .map((obj) => {
        if (!obj.subsessions || !obj.subsessions.length) {
          return { ...obj };
        }

        let latestDate = obj.subsessions[0].date;
        let totalTimeAllSubsessions = 0;

        for (const { date, totalTime } of obj.subsessions) {
          if (latestDate.getTime() < date.getTime()) {
            latestDate = date;
          }
          totalTimeAllSubsessions += totalTime ?? 0;
        }

        return { ...obj, date: latestDate, totalTime: totalTimeAllSubsessions };
      });

    return allSessions;
  }

  public getOneSession(id: string): ExtendedSessionData {
    db.getDb("session").join("subsessionIds");

    let session: IndexedObj<Session> | null;

    try {
      session = db.getDb("session").findOnePrimaryKey(id);
    } catch (err) {
      throw err;
    }
    if (!session) {
      console.log("here");
      throw new Error("No Session found");
    }

    if (!session.obj.subsessions || !session.obj.subsessions.length) {
      return { ...session.obj };
    }

    let latestDate = session.obj.subsessions[0].date;
    for (const { date } of session.obj.subsessions ?? []) {
      if (latestDate.getTime() < date.getTime()) {
        latestDate = date;
      }
    }

    return { ...session.obj, date: latestDate };
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

  public addNewSession(sessionData: CreateSessionData) {
    let returnedSubsessionIds: string[] = [];

    for (const subsession of sessionData.subsessions) {
      const newSubsession: Omit<Subsession, "id"> = {
        ...subsession,
        maxTime: sessionData.numberOfLoops * subsession.timePerLoop,
        ratings: 0,
        time: [0],
        date: new Date(),
      };
      const id = db.getDb("subsession").insertOne(newSubsession);
      returnedSubsessionIds.push(id);
    }

    console.log(returnedSubsessionIds);

    //@ts-ignore
    let sessionId = db.getDb("session").insertOne({
      ...sessionData,
      status: "Planned",
      currentIndex: 1,
      subsessionIds: returnedSubsessionIds,
    });

    return sessionId;
  }

  public practiceOldSession(sessionId: string) {
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
          time: [1],
          date: new Date(new Date().toDateString()), //Deleting hours, minutes data
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

  public startSession(sessionId: string): true {
    try {
      db.getDb("session").updateOne({ id: sessionId }, { status: "Active" });
    } catch (err) {
      throw err;
    }
    return true;
  }

  public nextSession({
    sessionId,
    latestReflections,
    latestRatings,
    date = new Date(),
  }: {
    sessionId: string;
    latestReflections: string;
    latestRatings: number;
    date: Date;
  }): "Finished" | "Next" {
    db.getDb("session").join("subsessionIds");

    let fetchedSession: IndexedObj<Session> | null;
    try {
      fetchedSession = db.getDb("session").findOnePrimaryKey(sessionId);
    } catch (err) {
      throw err;
    }
    if (!fetchedSession) {
      throw new Error("No Session found");
    }

    const session = fetchedSession.obj;
    const currentSubsessionId =
      session.subsessionIds[
        (session.currentIndex - 1) % session.subsessionIds.length
      ];

    //Update subsession that has just finished
    db.getDb("subsession").updateOne(
      {
        id: currentSubsessionId,
      },
      { ratings: latestRatings, reflections: latestReflections, date: date },
    );
    const lastSubsession = db
      .getDb("subsession")
      .findOnePrimaryKey(currentSubsessionId);
    console.log(lastSubsession);
    db.getDb("goal").updateOne(
      { id: (lastSubsession?.obj.goalIds ?? [])[0] },
      { ratings: latestRatings },
    );

    // create Time for the next subsession;
    const nextIndex = session.currentIndex + 1;

    if (nextIndex > session.numberOfLoops * session.subsessionIds.length) {
      db.getDb("session").updateOne(
        { id: session.id },
        { status: "Completed" },
      );
      return "Finished";
    }

    try {
      if (session.currentIndex >= session.subsessionIds.length) {
        db.getDb("subsession").updateArrayMany("time", 0, "Push", {
          id: session.subsessionIds[
            session.currentIndex % session.subsessionIds.length
          ],
        });
      }
    } catch (err) {
      throw err;
    }

    try {
      db.getDb("session").updateOne(
        { id: session.id },
        { currentIndex: nextIndex },
      );
    } catch (err) {
      throw err;
    }
    return "Next";
  }

  public pauseSession({
    sessionId,
  }: {
    sessionId: string;
    notes?: string;
  }): true {
    try {
      db.getDb("session").updateOne(
        { id: sessionId },
        { status: "InProgress" },
      );
    } catch (err) {
      throw err;
    }
    return true;
  }

  public endSession({
    sessionId,
    notes = "",
  }: {
    sessionId: string;
    notes?: string;
  }): true {
    try {
      db.getDb("session").updateOne(
        { id: sessionId },
        { status: "Completed", notes: notes },
      );
    } catch (err) {
      throw err;
    }
    return true;
  }

  public updateSession() {}

  public deleteSession() {}

  //------Subsession------

  public getOneSubsession(id: string): ExtendedSubsessionData {
    db.getDb("subsession").join("goalIds");

    let subsession: IndexedObj<Subsession> | null;
    try {
      subsession = db.getDb("subsession").findOnePrimaryKey(id);
    } catch (err) {
      throw err;
    }
    if (!subsession) {
      throw new Error("No Session found");
    }

    if (!subsession.obj.goals || !subsession.obj.goals.length) {
      return { ...subsession.obj, goals: undefined };
    }

    let goal = subsession.obj.goals[0];

    const goalPiece = db
      .getDb("piece")
      .findManyPredicate((obj, index, returnArrayNumber) => {
        if (obj.goalIds && obj.goalIds.includes(goal.id)) {
          returnArrayNumber.push(index);
          return true;
        }
        return false;
      });

    if (!goalPiece.length) {
      throw new Error("Goal exists without piece");
    }

    const goalPieceId = goalPiece[0].id;

    return { ...subsession.obj, goals: [{ ...goal, pieceId: goalPieceId }] };
  }

  public updateSubsessionTime({
    subsessionId,
    incrementTime = 1,
  }: {
    subsessionId: string;
    incrementTime?: number;
  }) {
    try {
      const subsession = db.getDb("subsession").findOnePrimaryKey(subsessionId);
      if (!subsession) {
        throw new Error("Object Not Found");
      }

      const currentTime = subsession.obj.time;
      currentTime[currentTime.length - 1] += incrementTime;
      db.getDb("subsession").updateOne(
        { id: subsessionId },
        {
          // @ts-ignore
          time: currentTime,
        },
      );
    } catch (err) {
      console.log(err);
      throw err;
    }
    return true;
  }

  public getAllPieceSubsessions(pieceId: string): ExtendedSubsessionData[] {
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

    let returnedObj: IndexedObj<Piece> | null;

    returnedObj = db.getDb("piece").findOnePrimaryKey(pieceId);
    if (!returnedObj) {
      goalDejoin();
      pieceDejoin();
      subsessionDejoin();
      throw new Error("No object found");
    }

    const piece = returnedObj.obj;

    const goalLists: Goal[] = [...(piece.goals ?? [])];

    //get all subsession
    const allSubsessions: Subsession[] = [];

    //Eliminate Repeats
    for (const goal of goalLists) {
      for (const subsession of goal.subsessions ?? []) {
        if (allSubsessions.includes(subsession)) {
          //already counted
          continue;
        }
        allSubsessions.push(subsession);
        if (subsession.sessions && subsession.sessions.length) {
          subsession.sessionId = subsession.sessions[0].id; //add to ID
        }
      }
    }

    goalDejoin();
    pieceDejoin();
    subsessionDejoin();

    return allSubsessions;
  }
}
