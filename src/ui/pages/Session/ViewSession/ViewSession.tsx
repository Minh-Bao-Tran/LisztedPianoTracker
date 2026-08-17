import { useEffect, useState } from "react";
import {
  useParams,
  NavLink,
  useOutletContext,
  useNavigate,
} from "react-router";

import type { Column } from "../../../shared/Table/MainTable";

import Table from "../../../shared/Table/MainTable";
import Ratings from "../../../shared/Ratings";

import type { PopupData } from "../../../Layout";

import DeleteIcon from "../../../assets/icon/Delete_Icon.svg";

import styles from "./ViewSession.module.css";
import CompletionBar from "../../../shared/CompletionBar";

export default function ViewSessionPage() {
  const navigate = useNavigate();
  const sessionId = useParams().id;

  const { setPopup } = useOutletContext<{
    setPopup: (value: React.SetStateAction<PopupData | undefined>) => void;
  }>();

  //Fetching Function
  async function loadSession() {
    window.electron
      .getOneSession({
        id: sessionId as string,
      })
      .then((data) => {
        console.log(data);
        if (!data) {
          alert("No session found");
          throw new Error("No session found");
        }
        setSession(data);
      });
  }

  async function loadSubsession(subsessionId: string) {
    const result = await window.electron.getOneSubsession({
      id: subsessionId as string,
    });
    if (!result) {
      alert("No session found");
      throw new Error("No session found");
    }

    return result;
  }

  async function startSession() {
    window.electron
      .startSession({
        id: sessionId as string,
      })
      .then((result) => {
        if (result) {
          navigate(`/session/${sessionId}/practice`);
        }
      });
  }

  async function deleteSession() {
    const confirm = window.confirm(
      "Deleting Session? All data associated with this session will be lost forever.",
    );
    if (!confirm) return;

    window.electron
      .deleteSession({
        id: sessionId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("Session Delete failed");
          throw new Error("Session Delete failed");
        }
        navigate("/sessions");
      });
  }

  async function openSubsessionPopUp(subsessionId: string) {
    const subsessionData = await loadSubsession(subsessionId);
    if (!subsessionData) {
      return alert("Can not fetch subsession");
    }
    setPopup({
      type: "viewSubsession",
      currentValues: subsessionData,
      closeForm: () => {
        setPopup(undefined);
      },
    });
  }
  // }
  //---State Management---
  const [session, setSession] = useState<ExtendedSessionData | undefined>(
    undefined,
  );

  let currentSubsession: SubsessionData;
  if (session) {
    if (session.status === "InProgress" || session.status === "Active") {
      currentSubsession =
        session.subsessions[
          (session.currentIndex - 1) % session.subsessionIds.length
        ];
    } else {
      currentSubsession = undefined;
    }
  }

  //Fetch the session
  useEffect(() => {
    console.log(sessionId);
    loadSession();
  }, [sessionId]);

  const subsessionColumns: Column<ExtendedSubsessionData>[] = [
    {
      header: "Title",
      render: (subsession) => <p>{subsession.title}</p>,
    },
    {
      header: "Date",
      render: (subsession) => (
        <p>
          {subsession.date
            ? subsession.date.toLocaleDateString("en-AU", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "N/A"}
        </p>
      ),
    },
    {
      header: "Duration",
      render: (subsession) => <p>{`${subsession.totalTime} min.`}</p>,
    },
    {
      header: "Rating",
      render: (subsession) => <Ratings ratings={subsession.ratings} />,
    },
  ];

  let subsessions = [];
  if (session) {
    subsessions = session.subsessions.map((subsession) => {
      return {
        ...subsession,
        //@ts-ignore
        onClick: () => {
          openSubsessionPopUp(subsession.id);
        },
      };
    });
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topButtonDiv}>
          <NavLink to="/sessions" className="small">
            &lt; Back
          </NavLink>
          <img
            src={DeleteIcon}
            alt=""
            className={styles.deleteBtn}
            onClick={deleteSession}
          />
        </div>
        <div className={`card-box ${styles.sessionCard}`}>
          <div className={styles.sessionTitle}>
            <div>
              <h2>{session && session.title}</h2>
              <em
                className={`class-tag ${session && (session.status === "Completed" ? "alt1" : session.status === "Planned" ? "alt2" : null)}`}
              >
                {session && session.status}
              </em>
            </div>
            <h3>{session && session.structure}</h3>
          </div>

          <div className={styles.additionalInfo}>
            <div>
              <h3>
                {session && session.date
                  ? session.date.toLocaleString("en-AU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })
                  : "N/A"}
              </h3>
              <small>Last Practiced</small>
            </div>

            {session && session.status !== "Completed" && (
              <button type="button" className="btn-blue" onClick={startSession}>
                Practice
              </button>
            )}
          </div>
        </div>
        <hr />
      </header>

      <main className={styles.main}>
        {currentSubsession && (
          <>
            <section
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <h3>Progress</h3>
              <CompletionBar
                value={session.currentIndex}
                maxValue={session.numberOfLoops * session.subsessionIds.length}
                width="100%"
              />
              <p>
                Subsession {session.currentIndex}/
                {session.numberOfLoops * session.subsessionIds.length}
              </p>
            </section>
            <section>
              <h3>Current Subsession</h3>
              <div
                className="card-box"
                onClick={() => {
                  openSubsessionPopUp(currentSubsession.id);
                }}
              >
                <p>{currentSubsession.title}</p>
                <p>
                  Time:{" "}
                  {currentSubsession.time[currentSubsession.time.length - 1]}/
                  {currentSubsession.maxTime / session.numberOfLoops} min.
                </p>
              </div>
            </section>
          </>
        )}

        <section>
          <h3>All Subsessions</h3>
          {session && <Table data={subsessions} columns={subsessionColumns} />}
        </section>
        <section>
          <h3>Notes</h3>
          <div className="card-box">
            <p>{session && session.notes}</p>
          </div>
        </section>
      </main>
    </>
  );
}
