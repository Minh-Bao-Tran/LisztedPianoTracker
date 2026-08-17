import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";

import { useNavigate, useParams } from "react-router";

import Table from "../../../shared/Table/MainTable";
import Ratings from "../../../shared/Ratings";

import type { Column } from "../../../shared/Table/MainTable";

import styles from "./FinishPractice.module.css";

export default function FinishPracticePage() {
  const sessionId = useParams().id;
  const navigate = useNavigate();

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

  async function finishSession(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const finishingSession = {
      sessionId,
      notes: formData.get("notes") as string,
    };
    window.electron.finishSession(finishingSession).then((result) => {
      if (!result) {
        alert("An Error has Occured while saving Session!");
        throw new Error("An Error has Occured while saving Session!");
      }
      navigate(`/session/${sessionId}/view`);
    });
  }

  const [session, setSession] = useState<ExtendedSessionData | undefined>(
    undefined,
  );

  useEffect(() => {
    console.log(sessionId);
    loadSession();
  }, [sessionId]);

  let subsessions = [];
  if (session) {
    subsessions = session.subsessions.map((subsession) => {
      return {
        ...subsession,
        //@ts-ignore
        onClick: () => {},
      };
    });
  }
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
      render: (subsession) => <p>{`${subsession.totalTime} min.`}</p>,
    },
    {
      header: "Rating",
      render: (subsession) => <Ratings ratings={subsession.ratings} />,
    },
  ];
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1>Finish Practice</h1>
      </header>
      <main className={styles.main}>
        {session && <Table data={subsessions} columns={subsessionColumns} />}

        <div>
          <h3>Reflections</h3>
          {subsessions.length > 0 ? (
            subsessions.map((subsession) => {
              return (
                subsession.reflections && (
                  <div className="card-box">
                    <h1>{subsession.reflections}</h1>
                    <small>{subsession.title}</small>
                  </div>
                )
              );
            })
          ) : (
            <p>No Reflections</p>
          )}
        </div>
        {session && (
          <form onSubmit={finishSession} className={styles.form}>
            <div className={styles.formField}>
              <label htmlFor="notes" className="p">
                notes
              </label>
              <textarea
                name="notes"
                id="notes"
                className="input-deco"
                defaultValue={session.notes}
              ></textarea>
            </div>
            <button type="submit" className="btn-blue">
              Save
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
