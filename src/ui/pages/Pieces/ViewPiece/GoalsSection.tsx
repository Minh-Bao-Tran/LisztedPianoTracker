import { useOutletContext } from "react-router";

import type { PopupData } from "../../../Layout";

export default function GoalsSection() {
  const { goals, setPopup, handleAddGoal, handleUpdateGoal, handleDeleteGoal } =
    useOutletContext<{
      goals: GoalData[];
      setPopup: (value: React.SetStateAction<PopupData | undefined>) => void;
      handleAddGoal: (newGoal: Omit<GoalData, "id">) => void;
      handleUpdateGoal: (goalId: string, newGoal: Omit<GoalData, "id">) => void;
      handleDeleteGoal: (goalId: string) => void;
    }>();

  function openAddNewGoal() {
    setPopup({
      type: "addGoal",
      currentValues: {},
      closeForm: () => {
        setPopup(undefined);
      },
      handleFormPredicate: (newGoal: Omit<GoalData, "id">) => {
        handleAddGoal(newGoal);
      },
    });
  }

  function openUpdateResource({
    currentValues,
    goalId,
  }: {
    currentValues: Omit<GoalData, "id">;
    goalId: string;
  }) {
    setPopup({
      type: "editGoal",
      currentValues: currentValues,
      closeForm: () => {
        setPopup(undefined);
      },
      handleFormPredicate: (newGoal: Omit<GoalData, "id">) => {
        handleUpdateGoal(goalId, newGoal);
      },
      handleDeletePredicate: () => {
        // console.log("deleting");
        handleDeleteGoal(goalId);
      },
    });
  }

  let allGoals: GoalData[] = [];
  if (goals) {
    console.log(goals);
    allGoals = goals;
  }

  const plannedGoalList = allGoals.filter((goal) => goal.status === "Planned");
  const activeGoalList = allGoals.filter((goal) => goal.status === "Active");
  const completedGoalList = allGoals.filter(
    (goal) => goal.status === "Completed",
  );

  const plannedGoalElements = plannedGoalList.map((goal, index) => {
    return (
      <div
        key={index}
        className="card-box"
        onClick={() => {
          openUpdateResource({ currentValues: { ...goal }, goalId: goal.id });
        }}
      >
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
        <button onClick={openAddNewGoal} className="btn-blue">
          +Add New Goal
        </button>
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
