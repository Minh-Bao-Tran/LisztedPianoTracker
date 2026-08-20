import { useNavigate } from "react-router";
import styles from "./ExtendedPieceCard.module.css";

export default function PieceCard({
  piece,
  toPiecePage = true,
}: {
  piece: ExtendedPieceData;
  toPiecePage?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div
      className={`card-box ${styles.pieceComponent}`}
      onClick={() => {
        if (!toPiecePage) return;
        navigate(`/piece/${piece.id}/view`);
      }}
    >
      <div className={`${styles.div}`}>
        <div className={`${styles.pieceTitle}`}>
          <h3>{piece.name}</h3>
          <small>{piece.composer}</small>
        </div>
        <em
          className={`class-tag ${piece.status === "Completed" ? "alt1" : piece.status === "Planned" ? "alt2" : null}`}
        >
          {piece.status}
        </em>
      </div>

      <div className={`${styles.pieceParagraph} ${styles.div}`}>
        {" "}
        <p>
          Last Practice:
          {typeof piece.lastPracticeDate === "string" ||
          typeof piece.lastPracticeDate === "undefined"
            ? "N/A"
            : piece.lastPracticeDate?.toLocaleString("en-AU", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
        </p>
        <p>Goal: {piece.lastPracticeGoalName}</p>
      </div>
    </div>
  );
}
