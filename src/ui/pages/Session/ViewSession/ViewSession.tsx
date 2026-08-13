import { useEffect, useState } from "react";
import {
  useParams,
  NavLink,
  Outlet,
  useOutletContext,
  useNavigate,
} from "react-router";

import type { Column } from "../../../shared/MainTable";

import Table from "../../../shared/MainTable";
import Ratings from "../../../shared/Ratings";

import type { PopupData } from "../../../Layout";

import EditIcon from "../../../assets/icon/Edit_icon.svg";
import SubNav from "../../../shared/SubNav";

import styles from "./ViewSession.module.css";

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

  async function openSubsessionPopUp(subsessionId: string) {
    const subsessionData = await loadSubsession(subsessionId);
    console.log(subsessionData);
  }
  // }
  //---State Management---
  const [reloadCount, setReloadCount] = useState<number>(0);

  const [session, setSession] = useState<ExtendedSessionData | undefined>(
    undefined,
  );

  let currentSubsession: SubsessionData;
  if (session) {
    if (
      session.currentIndex <
      session.numberOfLoops * session.subsessions.length
    ) {
      currentSubsession =
        session.subsessions[(session.currentIndex % session.numberOfLoops) - 1];
    } else {
      currentSubsession = undefined;
    }
  }

  //Fetch the session
  useEffect(() => {
    console.log(sessionId);
    loadSession();
  }, [sessionId, reloadCount]);

  const subsessionColumns: Column<ExtendedSubsessionData>[] = [
    {
      header: "Title",
      render: (subsession) => <p>{subsession.title}</p>,
    },
    {
      header: "Date",
      render: (subsession) => (
        <p>
          {subsession.date.toLocaleDateString("en-AU", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </p>
      ),
    },
    {
      header: "Duration",
      render: (subsession) => <p>{`${subsession.time} min.`}</p>,
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
          <NavLink
            to={`/session/${sessionId}/edit`}
            className="h3"
            style={{ display: "flex", alignItems: "bottom", gap: "10px" }}
          >
            <img src={EditIcon} alt="" />
            Edit
          </NavLink>
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

            <NavLink to="/sessions" className="btn-blue">
              Practice
            </NavLink>
          </div>
        </div>
        <hr />
      </header>

      <main className={styles.main}>
        <section>
          <h3>Current Subsession</h3>
          {currentSubsession && (
            <div
              className="card-box"
              onClick={() => {
                openSubsessionPopUp(currentSubsession.id);
              }}
            >
              <p>{currentSubsession.title}</p>
              <p>
                Time: {currentSubsession.time}/{currentSubsession.maxTime} min.
              </p>
            </div>
          )}
        </section>
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
