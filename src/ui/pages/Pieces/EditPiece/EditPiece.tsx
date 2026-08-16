import { useState, useEffect } from "react";

import { NavLink, useParams } from "react-router";

import PieceForm from "../util/Form/PieceForm";

import styles from "./EditPiece.module.css";

export default function EditPiecePage() {
  const pieceId = useParams().id;

  const [piece, setPiece] = useState<PieceData | undefined>(undefined);
  const [resetCount, setResetCount] = useState<number>(0);

  async function loadPieces() {
    window.electron
      .getOnePiece({
        id: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("No Piece found");
          throw new Error("No piece found");
        }
        setPiece(data);
      });
  }

  //Validation needed. Might want to convert to Controlled Elements
  async function handleFormSubmit(newPiece: Omit<PieceData, "id">) {
    const res = await window.electron.updatePiece({
      updateCriteria: { id: pieceId },
      updatingFields: { ...newPiece },
    });
    if (res) {
      await loadPieces();
      setResetCount((prevCount) => prevCount + 1);
      return alert("Updated successfully");
    }
    alert("An Error has occured");
  }

  useEffect(() => {
    loadPieces();
  }, [pieceId]);

  return (
    <>
      <header className={styles.header}>
        <NavLink to={`/piece/${pieceId}/view`} className="small">
          &lt; Back
        </NavLink>

        <h2>Edit Piece</h2>
        <hr />
      </header>
      <main>
        {piece && (
          <PieceForm
            key={resetCount}
            handleFormPredicate={handleFormSubmit}
            currentValues={{ ...piece }}
            submitButtonText="Update Piece"
          />
        )}
      </main>
    </>
  );
}
