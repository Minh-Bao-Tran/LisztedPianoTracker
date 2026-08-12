import type { SubmitEvent } from "react";

export default function EditGoalPopUp({
  currentValues = {},
  handleFormPredicate,
  handleDeletePredicate,
  closeForm,
}: {
  currentValues?: Partial<GoalData>;
  handleFormPredicate: (newResource: Omit<GoalData, "id">) => void;
  handleDeletePredicate: () => void;
  submitButtonText?: string;
  closeForm: () => void;
}) {
  async function handleFormSubmit(
    event: SubmitEvent<HTMLFormElement>,
    handleFormPredicate: any,
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const goal: Omit<GoalData, "id"> = {
      name: formData.get("name") as string,
      status: formData.get("status") as Status,
      goalType: formData.get("goalType") as GoalType,
      ratings: 0,
      notes: formData.get("notes") as string,
    };

    return handleFormPredicate(goal);
  }

  const defaultValues: Omit<GoalData, "id"> = {
    name: null,
    //@ts-ignore
    status: "",
    goalType: "Others",
    notes: "",
    //@ts-ignore
    ratings: 0,
  };

  const values: Omit<GoalData, "id"> = {
    ...defaultValues,
    ...currentValues,
  };

  return (
    <form
      onSubmit={async (event: SubmitEvent<HTMLFormElement>) => {
        handleFormSubmit(event, handleFormPredicate);
      }}
    >
      <div>
        <label htmlFor="name" className="p">
          Name
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
        <label htmlFor="ratings" className="p">
          Progress
        </label>
        <input
          required
          type="number"
          name="ratings"
          className="input-deco"
          defaultValue={values.ratings}
        />
        %
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
        <label htmlFor="goalType" className="p">
          Goal Type
        </label>
        <select
          name="goalType"
          id="piece-status"
          className="input-deco"
          defaultValue={values.status}
          required
        >
          <option value="Others" disabled hidden>
            ---Select a type---
          </option>
          <option value="Dynamic">Dynamic</option>
          <option value="Expression">Expression</option>
          <option value="Tempo">Tempo</option>
          <option value="Technique">Technique</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="p">
          notes
        </label>
        <textarea
          name="notes"
          id="notes"
          className="input-deco"
          defaultValue={values.notes}
        ></textarea>
      </div>
      <button
        type="button"
        className="btn-blue btn-blue-alt"
        onClick={() => {
          handleDeletePredicate();
        }}
      >
        Delete
      </button>

      <button
        type="button"
        className="btn-blue btn-blue-alt"
        onClick={closeForm}
      >
        Cancel
      </button>
      <button type="reset" className="btn-blue btn-blue-alt">
        Reset
      </button>
      <button type="submit" className="btn-blue">
        Update
      </button>
    </form>
  );
}
