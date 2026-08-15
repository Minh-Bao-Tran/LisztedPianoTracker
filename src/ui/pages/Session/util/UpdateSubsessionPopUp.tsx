import type { SubmitEvent } from "react";

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
        >
          <div>
            <h3>Title</h3>
            <p>{currentValues.title}</p>
          </div>

          <div>
            <label>Ratings</label>
            <input
              type="number"
              name="ratings"
              defaultValue={currentValues.ratings}
              className="input-deco"
            ></input>
          </div>

          <div>
            <label>Reflections</label>
            <input
              type="text"
              defaultValue={currentValues.reflections}
              name="reflections"
              className="input-deco"
            ></input>
          </div>
          {onClose && (
            <button onClick={onClose} className="btn-blue btn-blue-alt">
              Cancel
            </button>
          )}
          <button type="submit" className="btn-blue">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
