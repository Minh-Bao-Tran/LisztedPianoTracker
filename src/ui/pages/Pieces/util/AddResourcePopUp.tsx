import { Form } from "react-router";

import type { SubmitEvent } from "react";

export default function AddResourcePopUp({
  handleFormPredicate,
}: {
  //   handleFormPredicate: (newResource: Omit<ResourceData, "id">) => void;
  handleFormPredicate?: () => any;
}) {
  async function handleFormSubmit(
    event: SubmitEvent<HTMLFormElement>,
    handleFormPredicate: any,
  ) {
    event.preventDefault();

    return handleFormPredicate();
  }

  return (
    <form>
      <div>
        <label htmlFor="pieceType" className="p">
          Piece Type
        </label>
        <select name="pieceType" id="pieceType" className="input-deco" required>
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
        <input type="number" name="freqNumber" className="input-deco" />
        {/* No current goal. This is added later */}
      </div>

      <div>
        <label htmlFor="freqFrame" className="p">
          Time Frame
        </label>
        <select name="freqFrame" id="freqFrame" className="input-deco" required>
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
        +Add Resource
      </button>
    </form>
  );
}
