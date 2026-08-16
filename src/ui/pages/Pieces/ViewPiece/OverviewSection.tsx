import { useOutletContext } from "react-router";

import AnalyticsCard from "../util/Card/AnalyticsCard";

import styles from "./OverviewSection.module.css"

export default function OverviewSection() {
  let totalPracticeTime = 0;
  let totalSubsessionsNumber = 0;
  let averagePracticeTime = 0;
  let allGoalsCompleted = 0;
  let totalReflections = 0;
  let streak = 0;

  let currentGoal = "";
  let currentGoalRatings = 0;
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
    totalSubsessionsNumber = props.analytics.totalSubsessionsNumber;
    averagePracticeTime = props.analytics.averageTime;
    allGoalsCompleted = props.analytics.allGoalsCompleted;
    totalReflections = props.analytics.totalReflections;
    streak = props.analytics.streak;

    latestDate = props.analytics.latestSubsession
      ? props.analytics.latestSubsession.endDate?.toLocaleString("en-AU", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        })
      : "N/A";
    currentGoal = props.piece.lastPracticeGoalName ?? "N/A";
    currentGoalRatings = props.piece.lastGoalProgress ?? 0;
    notes = props.piece.notes ?? "";
    latestReflection = props.analytics.latestSubsession
      ? props.analytics.latestSubsession.reflections
      : "";
  }

  const analyticsCards = [
    <AnalyticsCard
      data={`${totalPracticeTime.toFixed(0)} Min.`}
      label="Total Practice Time"
    />,
    <AnalyticsCard
      data={`${averagePracticeTime.toFixed(0)} Min.`}
      label="Avg. Practice Time"
    />,
    <AnalyticsCard
      data={allGoalsCompleted.toString()}
      label="Goals Completed"
    />,
    <AnalyticsCard
      data={totalSubsessionsNumber.toString()}
      label="Subsessions Completed"
    />,
    <AnalyticsCard data={totalReflections.toString()} label="Reflections" />,
    <AnalyticsCard data={streak.toString()} label="Days" />,
  ];
  return (
    <>
      <ul className={styles.analyticsList}> {analyticsCards}</ul>

      <div className="goal-summary">
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
