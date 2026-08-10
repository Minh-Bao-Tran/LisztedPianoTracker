import type { SubmitEvent } from "react";

import { NavLink, useNavigate } from "react-router";
import styles from "./CreatePiece.module.css";

export default function CreatePiecePage() {
  const navigate = useNavigate();
  //Validation needed. Might want to convert to Controlled Elements
  async function handleFormSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const piece: Omit<PieceData, "id"> = {
      name: formData.get("name") as string,
      composer: formData.get("composer") as string,
      status: formData.get("status") as string,
      pieceType: formData.get("pieceType") as string,
      freqNumber: Number.parseInt(
        formData.get("freqNumber") as string,
      ) as number,
      freqFrame: formData.get("freqFrame") as string,
    };

    console.log(piece);
    console.log(formData);

    const res = await window.electron.addPiece(piece);
    if (res.valid) {
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
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="name" className="p">
              Piece Title
            </label>
            <input required type="text" name="name" className="input-deco" />
          </div>

          <div>
            <label htmlFor="composer" className="p">
              Composer
            </label>
            <input
              type="text"
              required
              name="composer"
              className="input-deco"
            />
          </div>

          <div>
            <label htmlFor="status" className="p">
              Status
            </label>
            <select name="status" id="piece-status" className="input-deco" defaultValue="">
              <option value="" disabled hidden>
                ---Select a status---
              </option>
              <option value="Active">Active</option>
              <option value="Planned">Planned</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="pieceType" className="p">
              Piece Type
            </label>
            <select name="pieceType" id="pieceType" className="input-deco" defaultValue="">
              <option value="" disabled hidden>
                ---Select Piece's Type---
              </option>
              <option value="Performance">Performance</option>
              <option value="Technical">Technical</option>
              <option value="Scale/Arpeggio">Scale/Arpeggio</option>
              <option value="Sight Reading">Sight Reading</option>
              <option value="Improvisation">Technical</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label htmlFor="freqNumber" className="p">
              Frequency
            </label>
            <input
              type="number"
              name="freqNumber"
              className="input-deco"
              defaultValue={0}
            />
            {/* No current goal. This is added later */}
          </div>

          <div>
            <label htmlFor="freqFrame" className="p">
              Time Frame
            </label>
            <select name="freqFrame" id="freqFrame" className="input-deco" defaultValue="">
              <option value="" disabled hidden>
                ---Select Time Frame---
              </option>
              <option value="week">Week</option>
              <option value="fortnight">Fortnight</option>
              <option value="month">Month</option>
            </select>
            {/* No current goal. This is added later */}
          </div>
          <button type="reset" className="btn-blue btn-blue-alt">
            Cancel
          </button>

          <button type="submit" className="btn-blue">
            +Create New Piece
          </button>
        </form>
      </main>
    </>
  );
}
