import { useState } from "react";
import GoalCard from "../../Pieces/util/Card/GoalCard";

import styles from "./CreateSubsessionForm.module.css";

export interface SubsessionFormProps {
  index: number;
  value: CreateSubsessionData;
  onChange: (value: CreateSubsessionData) => void;
  onRemove: () => void;
  allPieces: PieceData[];
}

export default function SubsessionForm({
  index,
  value,
  onChange,
  onRemove,
  allPieces,
}: SubsessionFormProps) {
  const [selectedPieceId, setSelectedPieceId] = useState("");

  let selectedPiece;
  if (selectedPieceId) {
    selectedPiece = allPieces.find((piece) => {
      return piece.id === selectedPieceId;
    });
  } else {
    selectedPiece = "";
  }
  function updateField<K extends keyof CreateSubsessionData>(
    field: K,
    newValue: CreateSubsessionData[K],
  ) {
    onChange({
      ...value,
      [field]: newValue,
    });
  }

  console.log(selectedPiece);

  return (
    <div className="card-box">
      <div className={styles.subsessionHeader}>
        <h3>Subsession {index + 1}</h3>

        <button
          type="button"
          onClick={onRemove}
          className="btn-blue btn-blue-alt"
        >
          Remove
        </button>
      </div>

      <div className={styles.subForm}>
        {/* Title */}
        <div className={styles.formField}>
          <label htmlFor={`subsession-title-${index}`} className="p">
            Title
          </label>

          <input
            id={`subsession-title-${index}`}
            type="text"
            value={value.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="input-deco"
            required
          />
        </div>

        {/* TimePerloop */}
        <div className={styles.formField}>
          <label htmlFor={`subsession-time-${index}`} className="p">
            Time Per Loop (minutes)
          </label>

          <input
            id={`subsession-time-${index}`}
            type="number"
            min={1}
            step={1}
            value={value.timePerLoop}
            onChange={(e) => updateField("timePerLoop", Number(e.target.value))}
            className="input-deco"
            required
          />
        </div>

        {/* Goals */}
        <div className={styles.formField}>
          <label className="p">Piece</label>

          <select
            className="input-deco"
            value={selectedPieceId}
            onChange={(e) => {
              setSelectedPieceId(e.target.value);

              // Clear previously selected goals
              onChange({
                ...value,
                goalIds: [],
              });
            }}
          >
            <option value="" disabled hidden>
              Select a piece
            </option>

            {allPieces.map((piece) => (
              <option key={piece.id} value={piece.id}>
                {piece.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formField}>
          <label className="p">Goal</label>
          {selectedPieceId && (
            <select
              className="input-deco"
              value={value.goalIds[0] ?? ""}
              onChange={(e) => {
                const goalId = e.target.value;
                console.log(goalId);
                if (!goalId) {
                  return;
                }

                onChange({
                  ...value,
                  goalIds: [goalId],
                });
              }}
              required
            >
              <option value="" disabled hidden>
                Select a goal
              </option>

              {selectedPiece.goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Displays Goal after Select */}
        {value.goalIds && value.goalIds.length && (
          <>
            <hr />
            <div>
              <GoalCard
                index={0}
                goal={selectedPiece.goals.find(
                  (goal) => value.goalIds[0] === goal.id,
                )}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
