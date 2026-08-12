import { useState } from "react";
import { Outlet } from "react-router";
import MainNav from "./shared/MainNav";

import AddResourcePopUp from "./pages/Pieces/util/AddResourcePopUp";
import EditResourcePopUp from "./pages/Pieces/util/EditResourcePopUp";

type PopupState =
  | {
      type: "addResource";
      input: Partial<ResourceData>;
      output: Omit<ResourceData, "id">;
      delete?: null;
    }
  | {
      type: "editResource";
      input: Partial<ResourceData>;
      output: Omit<ResourceData, "id">;
      delete?: null; //Do not need to pass in the Id as the resourceElement already passIn
    };

interface PopupProps {
  currentValues?: PopupState["input"];
  handleFormPredicate: (data: PopupState["output"]) => void;
  handleDeletePredicate?: (data?: PopupState["delete"]) => void;
  closeForm: () => void;
}

export interface PopupData extends PopupProps {
  type: PopupState["type"];
}

type PopupMappingElement = (
  props: Omit<PopupProps, "type">,
) => React.ReactElement;

//Helps to define popup event should receive which
const popupMapping: Record<PopupState["type"], PopupMappingElement> = {
  addResource: ({ currentValues, handleFormPredicate, closeForm }) => (
    <AddResourcePopUp
      currentValues={currentValues}
      handleFormPredicate={(newResource: Omit<ResourceData, "id">) => {
        handleFormPredicate(newResource);
        console.log(newResource);
      }}
      closeForm={closeForm}
    />
  ),

  editResource: ({
    currentValues,
    handleFormPredicate,
    closeForm,
    handleDeletePredicate,
  }) => (
    <EditResourcePopUp
      currentValues={currentValues}
      handleFormPredicate={(newResource: Omit<ResourceData, "id">) => {
        handleFormPredicate(newResource);
        console.log(newResource);
      }}
      closeForm={closeForm}
      handleDeletePredicate={() => {
        handleDeletePredicate();
      }}
    />
  ),
};

export default function Layout() {
  const [popup, setPopup] = useState<PopupData | undefined>();

  function closeForm() {
    setPopup(undefined);
  }

  const PopupElement = popup ? popupMapping[popup.type] : null;

  return (
    <>
      <MainNav />
      <div className="layout">
        <Outlet context={{ setPopup: setPopup }} />
        {popup && (
          <div className="popup-overlay">
            <div className="popup">
              {
                <PopupElement
                  currentValues={popup.currentValues}
                  handleFormPredicate={popup.handleFormPredicate}
                  closeForm={closeForm}
                  handleDeletePredicate={popup.handleDeletePredicate}
                />
              }
            </div>
          </div>
        )}
      </div>
    </>
  );
}
