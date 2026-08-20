// Purpose: form page to create a new `Piece` via the UI and send to backend.
import { useNavigate } from "react-router";

import PieceForm from "../util/Form/PieceForm";

import styles from "./CreatePiece.module.css";

export default function CreatePiecePage() {
  const navigate = useNavigate();
  //Validation needed. Might want to convert to Controlled Elements
  async function handleFormSubmit(piece: Omit<PieceData, "id">) {
    const res = await window.electron.addPiece(piece);
    if (res.valid) {
      alert("Create Piece Successfully");
      navigate("/pieces");

      setTimeout(() => navigate(`/piece/${res.value}/view`), 10);
      return;
    }
    alert("An Error has occured");
  }

  return (
    <>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className="small">
          &lt; Back
        </button>

        <h2>Create New Piece</h2>
        <hr />
      </header>
      <main>
        <PieceForm handleFormPredicate={handleFormSubmit} />
      </main>
    </>
  );
}
