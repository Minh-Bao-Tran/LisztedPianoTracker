import { useEffect, useState, type SubmitEvent } from "react";

import styles from "./AddGoalPopUp.module.css";

export default function AddTermPopUp({
  currentValues = [],
  handleFormPredicate,
  closeForm,
}: {
  currentValues?: TermData[];
  handleFormPredicate: (termId: string) => void;
  closeForm: () => void;
}) {
  async function loadAllTerms() {
    const data = await window.electron.getAllTerms();
    setAllTerms(data);
  }

  const [allTerms, setAllTerms] = useState<TermData[] | undefined>(undefined);
  const [currentTerm, setCurrentTerm] = useState<TermData | undefined>(
    undefined,
  );

  async function handleFormSubmit(
    event: SubmitEvent<HTMLFormElement>,
    handleFormPredicate: any,
  ) {
    event.preventDefault();

    if (!currentTerm) return alert("Please Choose a term to link");
    return handleFormPredicate(currentTerm.id);
  }

  useEffect(() => {
    loadAllTerms();
  }, []);

  let nonAddedTerm: TermData[] = [];
  if (allTerms) {
    nonAddedTerm = allTerms.filter(
      (term) =>
        !currentValues.find((existingTerm) => existingTerm.id === term.id),
    ); //Can only choose from the terms that don't belong to the piece already
  }

  return (
    <form
      className={styles.popUp}
      onSubmit={async (event: SubmitEvent<HTMLFormElement>) => {
        handleFormSubmit(event, handleFormPredicate);
      }}
    >
      <h2>Link Music Term</h2>
      <hr />
      <div className={styles.formField}>
        <select
          name="termId"
          id="termId"
          className="input-deco"
          value={currentTerm ? currentTerm.id : ""}
          onChange={(e) =>
            setCurrentTerm(allTerms.find((term) => term.id === e.target.value))
          }
          required
        >
          <option value="" disabled hidden>
            ---Select a Term---
          </option>

          {nonAddedTerm.length &&
            nonAddedTerm.map((term) => {
              return <option value={term.id}>{term.term}</option>;
            })}
        </select>
      </div>

      <div className={styles.formField}>
        <p>Definition</p>
        <input
          type="text"
          disabled
          className="input-deco"
          value={currentTerm ? currentTerm.definition : ""}
        />
      </div>

      <div className={styles.formField}>
        <p>Type</p>
        <input
          type="text"
          disabled
          className="input-deco"
          value={currentTerm ? currentTerm.type : ""}
        />
      </div>

      <div className={styles.formField}>
        <p>Notes</p>
        <input
          type="text"
          disabled
          className="input-deco"
          value={currentTerm ? currentTerm.notes : ""}
        />
      </div>

      <div className={styles.actionSection}>
        <button
          type="button"
          className="btn-blue btn-blue-alt"
          onClick={closeForm}
        >
          Cancel
        </button>
        <div>
          <button
            type="button"
            className="btn-blue btn-blue-alt"
            onClick={() => setCurrentTerm(undefined)}
          >
            Reset
          </button>
          <button type="submit" className="btn-blue">
            Add Term
          </button>
        </div>
      </div>
    </form>
  );
}
