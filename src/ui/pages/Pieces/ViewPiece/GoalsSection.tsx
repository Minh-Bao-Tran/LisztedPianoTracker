// Purpose: list and manage goals associated with a piece.
import type { ReactElement } from "react";
import { useOutletContext } from "react-router";

import type { PopupData } from "../../../Layout";
import GoalCard from "../util/Card/GoalCard";

import styles from "./GoalsSection.module.css";

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

  function openUpdateGoal({
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
          <>
            <GoalCard
              index={index}
              goal={goal}
              onClick={() => {
                openUpdateGoal({
                  currentValues: { ...goal },
                  goalId: goal.id,
                });
              }}
            />
            <hr />
          </>
        );
      },
    );
    goalElements[field].push(...currentGoalElements);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <section className={styles.goalSection}>
        <div className={styles.buttonDiv}>
          <h3>Current Goals</h3>
          <button onClick={openAddNewGoal} className="btn-blue">
            +Add New Goal
          </button>
        </div>

        <ul>
          {goalElements.active.length > 0 ? goalElements.active : <p>N/A</p>}
        </ul>
      </section>
      <section className={styles.goalSection}>
        <h3>Completed Goals</h3>
        <ul>
          {goalElements.completed.length > 0 ? (
            goalElements.completed
          ) : (
            <p>N/A</p>
          )}
        </ul>
      </section>
      <section className={styles.goalSection}>
        <h3>Planned Goals</h3>
        <ul>
          {goalElements.planned.length > 0 ? goalElements.planned : <p>N/A</p>}
        </ul>
      </section>
    </div>
  );
}
