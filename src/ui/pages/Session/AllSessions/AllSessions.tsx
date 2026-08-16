import { useState, useEffect } from "react";

import { NavLink, useLocation, useNavigate } from "react-router";

import type { Column } from "../../../shared/Table/MainTable";

import Table from "../../../shared/Table/MainTable";

import styles from "./AllSession.module.css";

export default function AllSessionsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [allSessions, setAllSessions] = useState<ExtendedSessionData[]>([]);

  //Load all pieces
  useEffect(() => {
    async function loadSessions() {
      const data = await window.electron.getAllSessions({});
      setAllSessions(data);
    }
    loadSessions();
  }, [location.pathname]);

  const sessionColumns: Column<ExtendedSessionData>[] = [
    {
      header: "Title",
      render: (session) => <p>{session.title}</p>,
    },
    {
      header: "Date",
      render: (session) => (
        <p>
          {session.date.toLocaleDateString("en-AU", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </p>
      ),
    },
    {
      header: "Status",
      render: (session) => <p>{session.status}</p>,
    },
    {
      header: "Duration",
      render: (subsession) => <p>{`${subsession.totalTime} min.`}</p>,
    },
  ];

  return (
    <>
      <header className={styles.header}>
        <div>
          <h2>All Sessions</h2>
          <NavLink to="/session/create" className="btn-blue">
            +Create New Session
          </NavLink>
        </div>
        <ul>
          <li>
            <label htmlFor="search" className="h3">
              Search
            </label>
            <input type="text" name="search" className="input-deco" />
          </li>
          <li>
            <label htmlFor="sort" className="h3">
              Sort
            </label>
            <input type="text" name="sort" className="input-deco" />
          </li>
          <li>
            <label htmlFor="TimeFrame" className="h3">
              Timeframe
            </label>
            <input type="text" name="TimeFrame" className="input-deco" />
          </li>
        </ul>
        <hr />
      </header>
      <main>
        <section style={{ paddingTop: "2rem" }}>
          {allSessions && (
            <Table
              data={allSessions.map((session) => {
                return { ...session, onClick: ()=> navigate(`/session/${session.id}/view`) };
              })}
              columns={sessionColumns}
            />
          )}
        </section>
      </main>
    </>
  );
}
