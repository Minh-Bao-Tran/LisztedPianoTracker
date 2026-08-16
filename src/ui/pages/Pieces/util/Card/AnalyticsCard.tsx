import GoalIcon from "../../../../assets/icon/Goal_Icon.svg";
import AverageTimeIcon from "../../../../assets/icon/Alt_Time_Icon.svg";
import TotalTimeIcon from "../../../../assets/icon/Time_Icon.svg";
import ReflectionIcon from "../../../../assets/icon/Reflection_Icon.svg";
import SessionCompletionIcon from "../../../../assets/icon/Session_Complete_Icon.svg";
import StreakIcon from "../../../../assets/icon/Calender_Icon.svg";

import styles from "./AnalyticsCard.module.css";

const iconMapping = {
  "Total Practice Time": TotalTimeIcon,
  "Avg. Practice Time": AverageTimeIcon,
  "Goals Completed": GoalIcon,
  Reflections: ReflectionIcon,
  "Subsessions Completed": SessionCompletionIcon,
  Days: StreakIcon,
};

export default function AnalyticsCard({
  data,
  label,
}: {
  data: string;
  label: keyof typeof iconMapping;
}) {
  return (
    <div className={`card-box ${styles.analyticsCard}`}>
      <img src={iconMapping[label]} alt="" className={styles.analyticsIcon} />
      <div>
        <h2>{data}</h2>
        <small>{label}</small>
      </div>
    </div>
  );
}
