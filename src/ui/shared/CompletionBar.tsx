import styles from "./CompletionBar.module.css";

export default function CompletionBar({
  value,
  maxValue,
  width,
}: {
  value: number;
  maxValue: number;
  width: string;
}) {
  return (
    <div className={styles.outside} style={{ width: width }}>
      <div
        className={styles.inside}
        style={{ width: `${value / maxValue * 100}%` }}
      ></div>
    </div>
  );
}
