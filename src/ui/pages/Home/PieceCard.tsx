import styles from "./PieceCard.module.css";

export default function PieceCard() {
  return (
    <div className={`card-box ${styles.pieceComponent}`}>
      <div className={`${styles.pieceTitle} ${styles.div}`}>
        <h3>Hungarian Rhapsody No.2</h3>
        <small>Franz Liszt</small>
      </div>

      <div className={`${styles.pieceParagraph} ${styles.div}`}>
        {" "}
        <p>Last Practice: Yesterday</p>
        <p>Goal: B Major Scale: 120BPM</p>
      </div>
    </div>
  );
}
