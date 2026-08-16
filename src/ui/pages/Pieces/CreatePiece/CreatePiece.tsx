import { NavLink, useNavigate } from "react-router";

import PieceForm from "../util/Form/PieceForm";

import styles from "./CreatePiece.module.css";

export default function CreatePiecePage() {
  const navigate = useNavigate();
  //Validation needed. Might want to convert to Controlled Elements
  async function handleFormSubmit(piece: Omit<PieceData, "id">) {
    const res = await window.electron.addPiece(piece);
    if (res.valid) {
      alert("Create Piece Successfully");
      return navigate(`/piece/${res.value}/view`);
    }
    alert("An Error has occured");
  }

  return (
    <>
      <header className={styles.header}>
        <NavLink to="/pieces" className="small">
          &lt; Back
        </NavLink>

        <h2>Create New Piece</h2>
        <hr />
      </header>
      <main>
        <PieceForm handleFormPredicate={handleFormSubmit} />
      </main>
    </>
  );
}
