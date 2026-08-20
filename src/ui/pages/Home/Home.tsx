import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import HomeCard from "./HomeCard";

import styles from "./Home.module.css";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  //----FETCHING FUNCTIONS----
  async function loadPieces() {
    const data = await window.electron.getAllPiece();
    setAllPieces(data);
  }
  async function loadSessions() {
    const data = await window.electron.getAllSessions({});
    setAllSessions(data);
  }
  //----POST FUNCTIONS----
  async function exitSession(activeSessionId: string) {
    window.electron.pauseSession({
      sessionId: activeSessionId as string,
    });
  }
  //----STATE MANAGEMENT----
  const [allPieces, setAllPieces] = useState<ExtendedPieceData[]>([]);
  const [allSessions, setAllSessions] = useState<ExtendedSessionData[]>([]);

  useEffect(() => {
    loadPieces();
    loadSessions();
  }, [location.pathname]);

  let latestPiece: ExtendedPieceData;
  let latestInProgressSession: ExtendedSessionData;
  let plannedSession: ExtendedSessionData;
  let thisWeekTotalTime: number = 0;
  if (allPieces.length > 0 && allSessions.length > 0) {
    //Find if any piece should be reopened if the app closed abruptly
    console.log("ere");
    const activeSession = allSessions.find(
      (session) => session.status === "Active",
    );
    console.log(activeSession);
    if (activeSession) {
      const confirm = window.confirm(
        "The app closed abruptly. Do you want to continue at the last session",
      );
      if (confirm) {
         navigate(`/session/${activeSession.id}/practice`);
      } else {
        //Change the status to inProgress as this is similar to the user exiting a session
        exitSession(activeSession.id);
      }
    }

    //Find Latest piece by looping through all pieces
    latestPiece = allPieces[0];
    for (const piece of allPieces) {
      if (piece.lastPracticeDate === "N/A" || !piece.lastPracticeDate) continue;

      if (latestPiece.lastPracticeDate === "N/A") {
        latestPiece = piece;
      }

      if (
        piece.lastPracticeDate.getTime() >
        (latestPiece.lastPracticeDate as Date).getTime()
      ) {
        latestPiece = piece;
      }
    }

    //Find latest InProgress session
    latestInProgressSession = allSessions[0];

    for (const session of allSessions) {
      if (session.status !== "InProgress") continue;
      if (!session.date) continue;

      if (!latestInProgressSession.date) {
        latestInProgressSession = session;
      }

      if (
        session.date.getTime() >
        (latestInProgressSession.date as Date).getTime()
      ) {
        latestInProgressSession = session;
      }
    }
    if (
      latestInProgressSession.status !== "InProgress" ||
      !latestInProgressSession.date
    ) {
      //No valid session found
      latestInProgressSession = undefined;
    }

    //Find oldest planned session
    plannedSession = allSessions.find((session) => {
      return session.status === "Planned";
    });

    //Find total Time for this week
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); //date minus number of milliseconds in 1 week

    const thisWeekSession = allSessions.filter((session) => {
      if (!session.date) return false;

      //Redundancy: endDate is not needed as no session could have a date beyond today. However, this might be needed if a scheduling feature is added that allows user to schedule future sessions
      if (
        startDate.getTime() <= session.date.getTime() &&
        endDate.getTime() >= session.date.getTime()
      ) {
        return true;
      }

      return false;
    });

    for (const session of thisWeekSession) {
      thisWeekTotalTime += session.totalTime;
    }
  }

  return (
    <main className={styles.main}>
      <section className={`${styles.welcomeBackSection} card-box`}>
        <h1>Welcome Back!</h1>
        <div>
          <h3>This Week Practice:</h3>
          <div className={styles.statistics}>
            <h2 className={styles.h2}>
              {allSessions && `${(thisWeekTotalTime / 60).toFixed(1)} hours`}
            </h2>
          </div>
        </div>
      </section>

      <section className={styles.pieceSection}>
        <h2 className={styles.h2}>Latest Piece</h2>
        <ol
          style={{
            display: "flex",
            gap: "20px",
            height: "11rem",
            maxHeight: "11rem",
          }}
        >
          {latestPiece && (
            <HomeCard
              mainTitle={latestPiece.name}
              subTitle={latestPiece.composer}
              info1={`Latest Goal: ${latestPiece.lastPracticeGoalName ?? null}`}
              info2={`Last Practice: ${
                latestPiece.lastPracticeDate.toLocaleString("en-AU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                }) ?? "N/A"
              }`}
              onClick={() => {
                navigate(`/piece/${latestPiece.id}/view`);
              }}
            />
          )}
          <HomeCard
            decoration={{ textDecoration: "underline" }}
            mainTitle="Start Practice"
            onClick={() => navigate("/session/create")}
          />
        </ol>
      </section>

      <section className={styles.pieceSection}>
        <h2 className={styles.h2}>Continue Practice</h2>
        <ol
          style={{
            display: "flex",
            gap: "20px",
            height: "11rem",
            maxHeight: "11rem",
          }}
        >
          {latestInProgressSession && (
            <HomeCard
              mainTitle={latestInProgressSession.title}
              subTitle={latestInProgressSession.structure}
              info1={`Last Practice: ${
                latestInProgressSession.date
                  ? latestInProgressSession.date.toLocaleString("en-AU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                  : "N/A"
              }`}
              info2={`Total time: ${latestInProgressSession.totalTime} min.`}
              onClick={() =>
                navigate(`/session/${latestInProgressSession.id}/view`)
              }
            />
          )}
          {plannedSession && (
            <HomeCard
              mainTitle={plannedSession.title}
              subTitle={plannedSession.structure}
              info2={`Max Time: ${plannedSession.numberOfLoops * plannedSession.subsessionIds.length} min.`}
              info1={"Last Practice: Planned"}
              onClick={() => navigate(`/session/${plannedSession.id}/view`)}
            />
          )}
        </ol>
      </section>
    </main>
  );
}
