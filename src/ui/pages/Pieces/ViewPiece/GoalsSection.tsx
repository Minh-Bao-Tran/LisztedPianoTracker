import { useOutletContext } from "react-router";

import type { PopupData } from "../../../Layout";
import type { ReactElement } from "react";

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

  const goalList = {
    planned: allGoals.filter((goal) => goal.status === "Planned"),
    active: allGoals.filter((goal) => goal.status === "Active"),
    completed: allGoals.filter((goal) => goal.status === "Completed"),
  };

  const goalElements: Record<keyof typeof goalList, ReactElement[]> = {
    active: [],
    completed: [],
    planned: [],
  };

  for (const field in goalList) {
    const currentGoalElements = goalList[field].map(
      (goal: GoalData, index: number) => {
        return (
          <div
            key={index}
            className="card-box"
            onDoubleClick={() => {
              openUpdateResource({
                currentValues: { ...goal },
                goalId: goal.id,
              });
            }}
          >
            <h3>{goal.name}</h3>
            <p>{goal.ratings === 0 ? "Not Started" : goal.ratings}</p>
          </div>
        );
      },
    );
    goalElements[field].push(currentGoalElements);
  }
  return (
    <>
      <section>
        <h3>Current Goals</h3>
        <button onClick={openAddNewGoal} className="btn-blue">
          +Add New Goal
        </button>
        {goalElements.active.length && goalElements.active}
      </section>
      <section>
        <h3>Completed Goals</h3>
        {goalElements.completed.length && goalElements.completed}
      </section>
      <section>
        <h3>Planned Goals</h3>
        {goalElements.planned.length && goalElements.planned}
      </section>
    </>
  );
}
