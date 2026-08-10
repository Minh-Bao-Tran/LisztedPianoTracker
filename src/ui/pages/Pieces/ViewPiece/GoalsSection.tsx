import { useOutletContext } from "react-router";
export default function GoalsSection() {
  const props: { goals: GoalData[] } = useOutletContext<{
    goals: GoalData[];
  }>();

  let goals: GoalData[] = [];
  if (props.goals) {
    console.log(props.goals);
    goals = props.goals;
  }

  const plannedGoalList = goals.filter((goal) => goal.status === "Planned");
  const activeGoalList = goals.filter((goal) => goal.status === "Active");
  const completedGoalList = goals.filter((goal) => goal.status === "Completed");

  const plannedGoalElements = plannedGoalList.map((goal, index) => {
    return (
      <div key={index} className="card-box">
        <h3>{goal.name}</h3>
        <p>{goal.ratings === 0 ? "Not Started" : goal.ratings}</p>
      </div>
    );
  });
  const activeGoalElements = activeGoalList.map((goal, index) => {
    return (
      <div key={index} className="card-box">
        <h3>{goal.name}</h3>
        <p>{goal.ratings === 0 ? "Not Started" : goal.ratings}</p>
      </div>
    );
  });
  const completedGoalElements = completedGoalList.map((goal, index) => {
    return (
      <div key={index} className="card-box">
        <h3>{goal.name}</h3>
        <p>{goal.ratings === 0 ? "Not Started" : goal.ratings}</p>
      </div>
    );
  });
  return (
    <>
      <section>
        <h3>Current Goals</h3>
        {activeGoalElements.length && activeGoalElements}
      </section>
      <section>
        <h3>Completed Goals</h3>
        {completedGoalElements.length && completedGoalElements}
      </section>
      <section>
        <h3>Planned Goals</h3>
        {plannedGoalElements.length && plannedGoalElements}
      </section>
    </>
  );
}
