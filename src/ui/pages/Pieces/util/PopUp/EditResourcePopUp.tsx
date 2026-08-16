import type { SubmitEvent } from "react";

import DeleteIcon from "../../../../assets/icon/Delete_Icon.svg";

import styles from "./EditResourcePopUp.module.css";

export default function EditResourcePopUp({
  currentValues = {},
  handleFormPredicate,
  handleDeletePredicate,
  closeForm,
}: {
  currentValues?: Partial<ResourceData>;
  handleFormPredicate: (newResource: Omit<ResourceData, "id">) => void;
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

    const resource: Omit<ResourceData, "id"> = {
      resourceLink: formData.get("resourceLink") as string,
      resourceType: formData.get("resourceType") as ResourceType,
      notes: formData.get("notes") as string,
    };

    return handleFormPredicate(resource);
  }

  const defaultValues: Omit<ResourceData, "id"> = {
    name: null,
    //@ts-ignore
    resourceType: "",
    notes: "",
    //@ts-ignore
    resourceLink: "",
  };

  const values: Omit<ResourceData, "id"> = {
    ...defaultValues,
    ...currentValues,
  };

  return (
    <form
      className={styles.popUp}
      onSubmit={async (event: SubmitEvent<HTMLFormElement>) => {
        handleFormSubmit(event, handleFormPredicate);
      }}
    >
      <div className={styles.formField}>
        <label htmlFor="resourceLink" className="p">
          Resource Link
        </label>
        <input
          required
          type="text"
          name="resourceLink"
          className="input-deco"
          defaultValue={values.resourceLink}
        />
      </div>
      <div className={styles.formField}>
        <label htmlFor="resourceType" className="p">
          Resource Type
        </label>
        <select
          name="resourceType"
          id="resourceType"
          className="input-deco"
          required
          defaultValue={values.resourceType}
        >
          <option value="" disabled hidden>
            ---Select Resource's Type---
          </option>
          <option value="Sheet Music">Sheet Music</option>
          <option value="Recording">Recording</option>
          <option value="Guides">Guides</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div className={styles.formField}>
        <label htmlFor="notes" className="p">
          Notes
        </label>
        <textarea
          name="notes"
          id="notes"
          className="input-deco"
          defaultValue={values.notes}
        ></textarea>
      </div>
      <div className={styles.actionSection}>
        <div>
          <button
            type="button"
            className="btn-blue btn-blue-alt"
            onClick={closeForm}
          >
            Cancel
          </button>
          <img
            onClick={() => {
              const confirm = window.confirm(
                "Are you sure to delete this Resource?",
              );
              if (!confirm) return;
              
              handleDeletePredicate();
            }}
            src={DeleteIcon}
          ></img>
        </div>
        <div>
          <button type="reset" className="btn-blue btn-blue-alt">
            Reset
          </button>
          <button type="submit" className="btn-blue">
            Update
          </button>
        </div>
      </div>
    </form>
  );
}
