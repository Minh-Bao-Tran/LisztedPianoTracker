import { useEffect, useState } from "react";

import { useParams, useLocation } from "react-router";

import ExtendedPieceCard from "../../Pieces/util/ExtendedPieceCard";

import UpdateSubsessionPopUp from "../util/UpdateSubsessionPopUp";

export default function PracticeSessionPage() {
  const location = useLocation();
  const sessionId = useParams().id;

  //Fetching
  async function loadSession() {
    window.electron
      .getOneSession({
        id: sessionId as string,
      })
      .then((data) => {
        if (!data) {
          alert("No session found");
          throw new Error("No session found");
        }
        setSession(data);
      });
  }
  async function loadSubsession(subsessionId: string) {
    console.log(subsessionId);
    const subsession = await window.electron.getOneSubsession({
      id: subsessionId as string,
    });
    if (!subsession) {
      alert("No Subsession found");
      throw new Error("No Subsession found");
    }
    setCurrentSubsession(subsession);
  }
  async function loadPiece() {
    const result = await window.electron.getOnePiece({
      //@ts-ignore
      id: currentSubsession.goals[0].pieceId as string,
    });
    if (!result) {
      alert("No session found");
      throw new Error("No session found");
    }

    setPiece(result);
  }
  async function updateSubsessionTime() {
    window.electron
      .updateSubsessionTime({
        subsessionId: currentSubsession.id as string,
      })
      .then((result) => {
        if (!result) {
          alert("Cannot update subsession time");
          throw new Error("Cannot update subsession time");
        }
      });
    return true;
  }

  async function incrementTime() {
    setCurrentTime((prev) => {
      if (prev >= 59) {
        return 0;
      }
      return prev + 10;
    });
  }

  async function nextSession(data: {
    latestReflections: string;
    latestRatings: number;
    date: Date;
  }) {
    window.electron
      .nextSession({
        sessionId: sessionId as string,
        ...data,
      })
      .then((result) => {
        if (result === "Next") {
          loadSession();
          setNextPopUp(false);
        } else {
          alert("Finished");
        }
      });
  }

  //State Management
  const [session, setSession] = useState<ExtendedSessionData | undefined>(
    undefined,
  );
  const [piece, setPiece] = useState<PieceData | undefined>();
  const [currentSubsession, setCurrentSubsession] = useState<
    ExtendedSubsessionData | undefined
  >(undefined);

  const [currentTime, setCurrentTime] = useState<number>(0); //from 0 - 60s. at 60s, increment time to the database and reset

  const [nextPopUp, setNextPopUp] = useState<boolean>(false);
  //Fetching with conditions
  useEffect(() => {
    loadSession();
  }, [sessionId, location.pathname]);

  useEffect(() => {
    if (session) {
      console.log((session.currentIndex - 1) % session.subsessionIds.length);

      loadSubsession(
        session.subsessionIds[
          (session.currentIndex - 1) % session.subsessionIds.length
        ],
      );
    }
  }, [session]);

  let currentIndex = session && currentSubsession ? session.currentIndex : 0;
  useEffect(() => {
    if (currentSubsession) {
      loadPiece();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (currentSubsession) {
      const timer = setInterval(() => {
        if (!nextPopUp) {
          incrementTime();
        }
      }, 200);
      return () => {
        clearInterval(timer);
      };
    }
  }, [currentSubsession ? true : false, nextPopUp]);

  useEffect(() => {
    if (currentSubsession) {
      if (currentTime === 0) {
        updateSubsessionTime().then((result) => {
          if (result) {
            setCurrentSubsession((prev) => {
              const nextTime = [...prev.time];
              nextTime[nextTime.length - 1] += 1;
              return { ...prev, totalTime: prev.totalTime + 1, time: nextTime };
            });
          }
        });
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (currentSubsession) {
      if (
        currentSubsession.time[currentSubsession.time.length - 1] >=
        currentSubsession.maxTime / session.numberOfLoops
      ) {
        setNextPopUp(true);
      }
    }
  }, [
    currentSubsession
      ? currentSubsession.time[currentSubsession.time.length - 1]
      : 0,
  ]);
  return (
    <main>
      {nextPopUp && (
        <div
          className="popup-overlay"
          onClick={() => {
            if (
              !(
                currentSubsession.time[currentSubsession.time.length - 1] >=
                currentSubsession.maxTime / session.subsessions.length
              )
            ) {
              setNextPopUp(false);
            }
          }}
        >
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            {
              <UpdateSubsessionPopUp
                currentValues={currentSubsession}
                handleFormPredicate={(subsession) => {
                  nextSession(subsession);
                }}
              />
            }
          </div>
        </div>
      )}
      <h1>{sessionId}</h1>
      <h2>Piece</h2>
      {piece && <ExtendedPieceCard piece={piece} />}
      <h2>Goal</h2>
      {currentSubsession &&
        currentSubsession.goals.map((goal: GoalData, index: number) => {
          return (
            <div key={index} className="card-box">
              <h3>{goal.name}</h3>
              <p>{goal.ratings === 0 ? "Not Started" : goal.ratings}</p>
            </div>
          );
        })}
      <div>
        {currentSubsession && (
          <p>
            {currentSubsession.time[currentSubsession.time.length - 1]} min.{" "}
            {currentTime ?? 0} sec.
          </p>
        )}
      </div>
    </main>
  );
}
