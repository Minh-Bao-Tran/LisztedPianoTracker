import type { SubmitEvent } from "react";

import styles from "./PieceForm.module.css";

export default function PieceForm({
  currentValues = {},
  handleFormPredicate,
  submitButtonText = "+Create New Piece",
}: {
  currentValues?: Partial<PieceData>;
  handleFormPredicate: (piece: Omit<PieceData, "id">) => void;
  submitButtonText?: string;
}) {
  async function handleFormSubmit(
    event: SubmitEvent<HTMLFormElement>,
    handleFormPredicate: (newPiece: Omit<PieceData, "id">) => void,
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    let freqNumber: number = 0;
    try {
      freqNumber = Number.parseInt(formData.get("freqNumber") as string);
    } catch (error) {
      return alert("Frequency Number is not a number");
    }

    if (
      freqNumber < 0 ||
      freqNumber > 15 ||
      Math.round(freqNumber) !== freqNumber
    ) {
      return alert("Frequency Number must be an integer between 0 - 15");
    }

    const piece: Omit<PieceData, "id"> = {
      name: formData.get("name") as string,
      composer: formData.get("composer") as string,
      status: formData.get("status") as Status,
      pieceType: formData.get("pieceType") as PieceType,
      freqNumber,
      freqFrame: formData.get("freqFrame") as FreqFrame,
    };

    return handleFormPredicate(piece);
  }

  const defaultValues: Omit<PieceData, "id"> = {
    name: null,
    composer: null,
    //@ts-ignore
    status: "",
    //@ts-ignore
    pieceType: "",
    freqNumber: 0,
    //@ts-ignore
    freqFrame: "",
  };

  const values: Omit<PieceData, "id"> = { ...defaultValues, ...currentValues };
  return (
    <form
      onSubmit={async (event: SubmitEvent<HTMLFormElement>) => {
        handleFormSubmit(event, handleFormPredicate);
      }}
      className={styles.form}
    >
      <div className={styles.inputDiv}>
        <div className={styles.formField}>
          <label htmlFor="name" className="p">
            Piece Title
          </label>
          <input
            required
            type="text"
            name="name"
            className="input-deco"
            defaultValue={values.name}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="composer" className="p">
            Composer
          </label>
          <input
            type="text"
            required
            name="composer"
            className="input-deco"
            defaultValue={values.composer}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="status" className="p">
            Status
          </label>
          <select
            name="status"
            id="piece-status"
            className="input-deco"
            defaultValue={values.status}
            required
          >
            <option value="" disabled hidden>
              ---Select a status---
            </option>
            <option value="Active">Active</option>
            <option value="Planned">Planned</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className={styles.formField}>
          <label htmlFor="pieceType" className="p">
            Piece Type
          </label>
          <select
            name="pieceType"
            id="pieceType"
            className="input-deco"
            defaultValue={values.pieceType}
            required
          >
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

        <div className={styles.formField}>
          <label htmlFor="freqNumber" className="p">
            Frequency
          </label>
          <input
            type="number"
            name="freqNumber"
            className="input-deco"
            defaultValue={values.freqNumber}
          />
        </div>

        <div className={styles.formField}>
          <label htmlFor="freqFrame" className="p">
            Time Frame
          </label>
          <select
            name="freqFrame"
            id="freqFrame"
            className="input-deco"
            defaultValue={values.freqFrame}
            required
          >
            <option value="" disabled hidden>
              ---Select Time Frame---
            </option>
            <option value="week">Week</option>
            <option value="fortnight">Fortnight</option>
            <option value="month">Month</option>
          </select>
          {/* No current goal. This is added later */}
        </div>
      </div>

      <section className={styles.actionSection}>
        <button type="reset" className="btn-blue btn-blue-alt">
          Reset
        </button>

        <button type="submit" className="btn-blue">
          {submitButtonText}
        </button>
      </section>
    </form>
  );
}
