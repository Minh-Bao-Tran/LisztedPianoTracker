import type { SubmitEvent } from "react";

import styles from "./UpdateSubsessionPopUp.module.css";

export default function UpdateSubsessionPopUp({
  currentValues,
  handleFormPredicate,
  onClose,
}: {
  currentValues: ExtendedSubsessionData;
  handleFormPredicate: (subsession: any) => void;
  onClose?: () => void;
}) {
  async function handleFormSubmit(
    event: SubmitEvent<HTMLFormElement>,
    handleFormPredicate: any,
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const subsession = {
      latestRatings: Number.parseInt(
        formData.get("ratings") as string,
      ) as number,
      latestReflections: formData.get("reflections") as string,
      date: new Date(),
    };

    return handleFormPredicate(subsession);
  }
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <form
          onSubmit={async (event: SubmitEvent<HTMLFormElement>) => {
            handleFormSubmit(event, handleFormPredicate);
          }}
          className={styles.popUp}
        >
          <div>
            <h3>{currentValues.title}</h3>
          </div>

          <div className={styles.formField}>
            <label className="p">Ratings</label>
            <input
              type="number"
              name="ratings"
              defaultValue={currentValues.ratings}
              className="input-deco"
            ></input>
          </div>

          <div className={styles.formField}>
            <label className="p">Reflections</label>
            <input
              type="text"
              defaultValue={currentValues.reflections}
              name="reflections"
              className="input-deco"
            ></input>
          </div>

          <div className={styles.actionSection}>
            {onClose && (
              <button onClick={onClose} className="btn-blue btn-blue-alt">
                Cancel
              </button>
            )}
            <button type="submit" className="btn-blue">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
