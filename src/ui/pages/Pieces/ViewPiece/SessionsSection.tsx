import { useOutletContext } from "react-router";
export default function SessionsSection() {
  const props: { subsessions: ExtendedSubsessionData[] } = useOutletContext<{
    subsessions: ExtendedSubsessionData[];
  }>();

  let subsessions: ExtendedSubsessionData[] = [];
  if (props.subsessions) {
    console.log(props.subsessions);
    subsessions = props.subsessions;
  }

  const subsessionElements = subsessions.map((subsession, index) => {
    return (
      <li key={index} className="card-box">
        <p>{subsession.title}</p>
        <p>{subsession.reflections ?? "N/A"}</p>
        <p>{subsession.time} minutes</p>
        <p>{subsession.ratings}%</p>
        {/* Transform this into a star rating later */}
      </li>
    );
  });

  return <>{subsessions && subsessionElements}</>;
}
