import type { SubmitEvent } from "react";

export default function PieceForm({
  currentValues = {},
  handleFormPredicate,
}: {
  currentValues?: Partial<PieceData>;
  handleFormPredicate: (piece: Omit<PieceData, "id">) => void;
}) {
  async function handleFormSubmit(
    event: SubmitEvent<HTMLFormElement>,
    handleFormPredicate: (piece: Omit<PieceData, "id">) => void,
  ) {
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

    return handleFormPredicate(piece);
  }

  function reset(){
    
  }

  const defaultValues: Omit<PieceData, "id"> = {
    name: null,
    composer: null,
    status: "",
    pieceType: "",
    freqNumber: 0,
    freqFrame: "",
  };

  const values: Omit<PieceData, "id"> = {...defaultValues, ...currentValues}

  
  return (<form
    onSubmit={async (event: SubmitEvent<HTMLFormElement>) => {
      handleFormSubmit(event, handleFormPredicate);
    }}
  >
    <div>
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

    <div>
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

    <div>
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

    <div>
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

    <div>
      <label htmlFor="freqNumber" className="p">
        Frequency
      </label>
      <input
        type="number"
        name="freqNumber"
        className="input-deco"
        defaultValue={values.freqNumber}
      />
      {/* No current goal. This is added later */}
    </div>

    <div>
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
    <button type="reset" className="btn-blue btn-blue-alt">
      Cancel
    </button>

    <button type="submit" className="btn-blue">
      +Create New Piece
    </button>
  </form>);
}
