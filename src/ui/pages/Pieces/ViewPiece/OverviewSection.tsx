// Purpose: displays main metadata overview for a piece (title, composer, notes).
import { useOutletContext } from "react-router";


import AnalyticsCard from "../util/Card/AnalyticsCard";
import styles from "./OverviewSection.module.css";
import GoalCard from "../util/Card/GoalCard";

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
      ? props.analytics.latestSubsession.date?.toLocaleString("en-AU", {
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
      data={`${(isNaN(averagePracticeTime) ? 0 : averagePracticeTime).toFixed(0)} Min.`}
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
    <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
      <ul className={styles.analyticsList}> {analyticsCards}</ul>

      <section className={styles.practiceAnalytics}>
        <div className={styles.goalSummary}>
          <div className="card-box">
            <small>Latest Goal</small>
            <GoalCard
              index={0}
              goal={
                { name: currentGoal, ratings: currentGoalRatings } as GoalData
              }
              onClick={undefined}
            />
          </div>
        </div>
        <div className="card-box">
          <small>Latest Subsession Reflection</small>
          <h1>{latestReflection}</h1>
          <p>{latestDate}</p>
        </div>
      </section>

      <div className={styles.notesSection}>
        <div className="card-box">
          <h3>Notes</h3>
          <p>{notes}</p>
        </div>
      </div>
    </div>
  );
}
