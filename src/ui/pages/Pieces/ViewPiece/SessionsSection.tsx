import { useOutletContext } from "react-router";
export default function SessionsSection() {
  const props: { sessions: SessionData[] } = useOutletContext<{
    sessions: SessionData[];
  }>();

  let sessions: SessionData[] = [];
  if (props.sessions) {
    console.log(props.sessions);
    sessions = props.sessions;
  }

  const sessionElements = sessions.map((session, index) => {
    return <li key={index}></li>;
  });
}
