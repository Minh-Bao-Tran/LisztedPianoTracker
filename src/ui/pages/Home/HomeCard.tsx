// Purpose: small reusable card component used on the Home page.
import styles from "./HomeCard.module.css";

export default function HomeCard({
  mainTitle,
  subTitle = "",
  info1 = "",
  info2 = "",
  decoration,
  onClick,
}: {
  mainTitle: string;
  subTitle?: string;
  info1?: string;
  info2?: string;
  // `decoration` is an arbitrary style object applied inline; its shape may vary.
  decoration?: Record<string, any>;
  onClick: () => void;
}) {
  return (
    <div className={`card-box ${styles.pieceComponent}`} onClick={onClick}>
      <div className={`${styles.pieceTitle} ${styles.div}`}>
        <h3 style={decoration}>{mainTitle}</h3>
        <small>{subTitle}</small>
      </div>

      <div className={`${styles.pieceParagraph} ${styles.div}`}>
        <p>{info1}</p>
        <p>{info2}</p>
      </div>
    </div>
  );
}
