// Purpose: compact piece card used in practice UI to quickly navigate to a piece.
import { useNavigate } from "react-router";
import styles from "./MinimisedPieceCard.module.css";

export default function MinimisedPieceCard({
  piece,
  toPiecePage = true,
}: {
  piece: PieceData;
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
    </div>
  );
}
