import DeleteIcon from "../assets/icon/Delete_Icon.svg";

import styles from "./ViewMusicTermPopUp.module.css";

export default function ViewMusicTermPopUp({
  currentValues,
  handleDeletePredicate = undefined,
  closeForm,
}: {
  currentValues: TermData;
  handleDeletePredicate?: (termId: string) => void;
  closeForm: () => void;
}) {
  async function handleDelete() {
    const confirm = window.confirm("Are you sure to unlink this term");
    if (!confirm) return;
    return handleDeletePredicate(currentValues.id);
  }
  return (
    <form className={styles.popUp}>
      <header>
        <h2>Music Term</h2>
        {handleDeletePredicate !== undefined && (
          <img src={DeleteIcon} onClick={handleDelete} />
        )}
      </header>
      <hr />
      <div className={styles.formField}>
        <p>Term</p>
        <input
          type="text"
          disabled
          className="input-deco"
          value={currentValues ? currentValues.term : ""}
        />
      </div>

      <div className={styles.formField}>
        <p>Definition</p>
        <input
          type="text"
          disabled
          className="input-deco"
          value={currentValues ? currentValues.definition : ""}
        />
      </div>

      <div className={styles.formField}>
        <p>Type</p>
        <input
          type="text"
          disabled
          className="input-deco"
          value={currentValues ? currentValues.type : ""}
        />
      </div>

      <div className={styles.formField}>
        <p>Notes</p>
        <input
          type="text"
          disabled
          className="input-deco"
          value={currentValues ? currentValues.notes : ""}
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
      </div>
    </form>
  );
}
