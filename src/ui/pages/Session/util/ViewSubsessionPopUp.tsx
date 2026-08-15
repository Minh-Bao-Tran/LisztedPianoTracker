import type { SubmitEvent } from "react";

import { useNavigate } from "react-router";
export default function ViewSubsessionPopUp({
  currentValues,
  closeForm,
}: {
  currentValues: ExtendedSubsessionData;
  closeForm: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <h3>Title</h3>
        <p>{currentValues.title}</p>
      </div>

      <div>
        <h3>Time</h3>
        <p>
          {currentValues.totalTime} / {currentValues.maxTime} min.
        </p>
      </div>

      <div>
        <h3>Date</h3>
        <p>{currentValues.date.toDateString()}</p>
      </div>

      <div>
        <h3>Ratings</h3>
        <p>{currentValues.ratings}</p>
      </div>

      <div>
        <h3>Reflections</h3>
        <p>{currentValues.reflections}</p>
      </div>

      <div className="card-box">
        <h3>{currentValues.goals[0].name}</h3>
        <p>
          {currentValues.goals[0].ratings === 0
            ? "Not Started"
            : currentValues.goals[0].ratings}
        </p>
      </div>

      <button
        type="button"
        className="btn-blue btn-blue-alt"
        onClick={closeForm}
      >
        Cancel
      </button>
      <button
        type="button"
        className="btn-blue btn-blue-alt"
        onClick={() => {
          //@ts-ignore
          navigate(`/piece/${currentValues.goals[0].pieceId}/view`);
        }}
      >
        View Piece
      </button>
    </div>
  );
}
