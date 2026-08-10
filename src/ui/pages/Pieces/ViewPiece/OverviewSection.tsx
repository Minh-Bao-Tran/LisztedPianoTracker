import { useOutletContext } from "react-router";

export default function OverviewSection() {
  let totalPracticeTime = 0;
  let currentGoal = "";
  let currentGoalRatings = 0;
  let totalSubsessionsNumber = 0;
  let latestReflection = "N/A";
  let latestDate = "N/A";
  let notes = "";

  const props: { piece: ExtendedPieceData; analytics: AnalyticsData } =
    useOutletContext<{
      piece: ExtendedPieceData;
      analytics: AnalyticsData;
    }>();

  if (props.piece && props.analytics) {
    totalPracticeTime = props.analytics.totalTime;
    currentGoal = props.piece.lastPracticeGoalName ?? "N/A";
    currentGoalRatings = props.piece.lastGoalProgress ?? 0;
    notes = props.piece.notes ?? "";
    totalSubsessionsNumber = props.analytics.totalSubsessionsNumber;
    latestDate = props.analytics.latestSubsession
      ? props.analytics.latestSubsession.endDate?.toLocaleString("en-AU", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "N/A";

    latestReflection = props.analytics.latestSubsession
      ? props.analytics.latestSubsession.reflections
      : "";
  }
  return (
    <>
      <div className="goal-summary">
        <div className="card-box">
          <small>Total Practice Time</small>
          <h1>{totalPracticeTime} minutes</h1>
        </div>
        <div className="card-box">
          <small>Current Goal</small>
          <h1>{currentGoal}</h1>
          <p>Progress: {currentGoalRatings}</p>
        </div>
        <div className="card-box">
          <small>Total Subsessions</small>
          <h1>{totalSubsessionsNumber} Subsessions</h1>
        </div>
      </div>
      <div>
        <div className="card-box">
          <h3>Reflections: </h3>
          <p>{latestReflection}</p>
          <p>{latestDate}</p>
        </div>
        <div className="card-box">
          <h3>Notes</h3>
          <p>{notes}</p>
        </div>
      </div>
    </>
  );
}
