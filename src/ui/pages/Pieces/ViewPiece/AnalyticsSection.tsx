import { useOutletContext } from "react-router";

export default function AnalyticsSection() {
  let totalPracticeTime = 0;
  let averagePracticeTime = 0;
  let totalSubsessionsNumber = 0;
  let latestDate = "N/A";
  let allGoalsCompleted = 0;
  let totalReflections = 0;
  let streak = 0;

  const props: { piece: ExtendedPieceData; analytics: AnalyticsData } =
    useOutletContext<{
      piece: ExtendedPieceData;
      analytics: AnalyticsData;
    }>();

  if (props.analytics) {
    totalPracticeTime = props.analytics.totalTime;
    totalSubsessionsNumber = props.analytics.totalSubsessionsNumber;
    latestDate = props.analytics.latestSubsession
      ? props.analytics.latestSubsession.endDate?.toLocaleString("en-AU", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "N/A";
    averagePracticeTime = props.analytics.averageTime;
    allGoalsCompleted = props.analytics.allGoalsCompleted;
    totalReflections = props.analytics.totalReflections;
    streak = props.analytics.streak;
  }
  return (
    <>
      <div className="goal-summary">
        <div className="card-box">
          <small>Total Practice Time</small>
          <h1>{totalPracticeTime} minutes</h1>
        </div>
        <div className="card-box">
          <small>Average Practice Time</small>
          <h1>{averagePracticeTime} minutes</h1>
        </div>
        <div className="card-box">
          <small>Total Subsessions</small>
          <h1>{totalSubsessionsNumber} Subsessions</h1>
        </div>
        <div className="card-box">
          <small>All Goals Completed</small>
          <h1>{allGoalsCompleted} Goals</h1>
        </div>
        <div className="card-box">
          <small>Total Reflections</small>
          <h1>{totalReflections} Reflections</h1>
        </div>
        <div className="card-box">
          <small>Streak</small>
          <h1>{streak} days</h1>
        </div>
      </div>
    </>
  );
}
