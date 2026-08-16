import CompletionBar from "../../../../shared/CompletionBar";

import GoalIcon from "../../../../assets/icon/Goal_Icon.svg";
import EditIcon from "../../../../assets/icon/Edit_icon.svg";

import styles from "./GoalCard.module.css";

export default function GoalCard({
  index,
  goal,
  onClick,
}: {
  index: number;
  goal: GoalData;
  onClick: () => void;
}) {
  return (
    <div key={index} className={styles.goalCard}>
      <img src={GoalIcon} alt="" className={styles.goalIcon} />
      <div>
        <h3>{goal.name}</h3>
        <div className={styles.ratings} >
          <p>{goal.ratings === 0 ? "Not Started" : goal.ratings}</p>
          <CompletionBar value={goal.ratings} maxValue={100} width="100%" />
        </div>
      </div>
      <img src={EditIcon} alt="" onClick={onClick} />
    </div>
  );
}
