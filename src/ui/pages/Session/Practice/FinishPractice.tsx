import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";

import { useNavigate, useParams } from "react-router";

import Table from "../../../shared/MainTable";
import Ratings from "../../../shared/Ratings";

import type { Column } from "../../../shared/MainTable";

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
    <>
      <header>
        <h1>Finish Practice</h1>
      </header>
      <main>
        {session && <Table data={subsessions} columns={subsessionColumns} />}

        <h3>Reflections</h3>
        <div>
          {subsessions &&
            subsessions.map((subsession) => {
              return (
                subsession.reflections && <h1>{subsession.reflections}</h1>
              );
            })}
        </div>
        {session && (
          <form onSubmit={finishSession}>
            <div>
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
    </>
  );
}
