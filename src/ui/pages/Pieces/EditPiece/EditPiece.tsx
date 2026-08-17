import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router";

import PieceForm from "../util/Form/PieceForm";

import DeleteIcon from "../../../assets/icon/Delete_Icon.svg";

import styles from "./EditPiece.module.css";

export default function EditPiecePage() {
  const pieceId = useParams().id;
  const navigate = useNavigate();

  const [piece, setPiece] = useState<PieceData | undefined>(undefined);
  const [resetCount, setResetCount] = useState<number>(0);

  async function deletePiece() {
    const confirm = window.confirm(
      "Deleting Piece? You won't be able to recover",
    );
    if (!confirm) return;

    window.electron
      .deletePiece({
        id: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("Piece Delete failed");
          throw new Error("Piece Delete failed");
        }
        navigate("/pieces");
      });
  }

  async function loadPiece() {
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
      await loadPiece();
      setResetCount((prevCount) => prevCount + 1);
      return alert("Updated successfully");
    }
    alert("An Error has occured");
  }

  useEffect(() => {
    loadPiece();
  }, [pieceId]);

  return (
    <>
      <header className={styles.header}>
        <p
          onClick={() => {
            navigate(-1);
          }}
          className="small"
        >
          &lt; Back
        </p>

        <div>
          <h2>Edit Piece</h2>
          <img
            src={DeleteIcon}
            alt=""
            onClick={deletePiece}
            className={styles.deleteBtn}
          />
        </div>

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
