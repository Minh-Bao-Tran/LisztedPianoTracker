// Purpose: popup to view and edit a subsession's details during session flow.
import { useNavigate } from "react-router";

import GoalCard from "../../Pieces/util/Card/GoalCard";

import styles from "./ViewSubsessionPopUp.module.css";

export default function ViewSubsessionPopUp({
  currentValues,
  closeForm,
}: {
  currentValues: ExtendedSubsessionData;
  closeForm: () => void;
}) {
  const navigate = useNavigate();

  return (
    <form className={styles.popUp}>
      <section>
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
          <p>
            {currentValues.date ? currentValues.date.toDateString() : "N/A"}
          </p>
        </div>

        <div>
          <h3>Ratings</h3>
          <p>{currentValues.ratings}</p>
        </div>
      </section>

      <div className={styles.reflectionDiv}>
        <h3>Reflections</h3>
        <div className="card-box">
          <p>{currentValues.reflections}</p>
        </div>
      </div>

      {currentValues.goals && currentValues.goals[0] && (
        <div className="card-box">
          <GoalCard goal={currentValues.goals[0]} />
        </div>
      )}

      <div className={styles.actionSection}>
        <button
          type="button"
          className="btn-blue btn-blue-alt"
          onClick={closeForm}
        >
          Cancel
        </button>

        {currentValues.goals && currentValues.goals[0] && (
          <button
            type="button"
            className="btn-blue"
            onClick={() => {
              //@ts-ignore
              navigate(`/piece/${currentValues.goals[0].pieceId}/view`);
            }}
          >
            View Piece
          </button>
        )}
      </div>
    </form>
  );
}
