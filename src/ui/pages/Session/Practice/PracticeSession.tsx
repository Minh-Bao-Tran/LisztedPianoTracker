import { useEffect, useState } from "react";

import { useParams } from "react-router";

export default function PracticeSessionPage() {
  const sessionId = useParams().id;
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
  const [session, setSession] = useState<ExtendedSessionData | undefined>(
    undefined,
  );
  useEffect(() => {
    console.log(sessionId);
    loadSession();
  }, [sessionId]);

  console.log(session);
  return <h1>{sessionId}</h1>;
}
