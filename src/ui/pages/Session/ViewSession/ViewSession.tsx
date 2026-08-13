import { useEffect, useState } from "react";
import { useParams, NavLink, Outlet, useOutletContext } from "react-router";

import type { PopupData } from "../../../Layout";

import EditIcon from "../../../assets/icon/Edit_icon.svg";
import SubNav from "../../../shared/SubNav";

import styles from "./ViewSession.module.css";

export default function ViewSessionPage() {
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
        // console.log(data);
        if (!data) {
          alert("No session found");
          throw new Error("No session found");
        }
        setSession(data);
      });
  }
  //---State Management---
  const [reloadCount, setReloadCount] = useState<number>(0);

  const [session, setSession] = useState<ExtendedSessionData | undefined>(
    undefined,
  );

  //Fetch the session
  useEffect(() => {
    console.log(sessionId);
    loadSession();
  }, [sessionId, reloadCount]);

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
        {/* <SubNav
          subNavData={[
            { url: `/session/${sessionId}/view`, title: "Overview", end: true },
            { url: `/session/${sessionId}/view/goals`, title: "Goals" },
            {
              url: `/session/${sessionId}/view/sessions`,
              title: "Practiced Sessions",
            },
            { url: `/session/${sessionId}/view/resources`, title: "Resources" },
            { url: `/session/${sessionId}/view/terms`, title: "Music Terms" },
            { url: `/session/${sessionId}/view/analytics`, title: "Analytics" },
          ]}
        /> */}
        <hr />
      </header>

      <main className={styles.main}>
        <section></section>
      </main>
    </>
  );

  return (
    <>
      <h1>{sessionId}</h1>
      <input type="date" name="" id="" />
    </>
  );
}
