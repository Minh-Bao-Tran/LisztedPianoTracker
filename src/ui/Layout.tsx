import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import MainNav from "./shared/MainNav";

import AddResourcePopUp from "./pages/Pieces/util/AddResourcePopUp";
import EditResourcePopUp from "./pages/Pieces/util/EditResourcePopUp";
import AddGoalPopUp from "./pages/Pieces/util/AddGoalPopUp";
import EditGoalPopUp from "./pages/Pieces/util/EditGoalPopUp";

type PopupState =
  | {
      type: "addResource";
      input: Partial<ResourceData>;
      output: Omit<ResourceData, "id">;
      delete?: null;
    }
  | {
      type: "editResource";
      input: Omit<ResourceData, "id">;
      output: Omit<ResourceData, "id">;
      delete?: null; //Do not need to pass in the Id as the resourceElement already passIn
    }
  | {
      type: "addGoal";
      input: Partial<GoalData>;
      output: Omit<GoalData, "id">;
      delete?: null;
    }
  | {
      type: "editGoal";
      input: Omit<GoalData, "id">;
      output: Omit<GoalData, "id">;
      delete?: null;
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

type PopupMappingElement = (props: PopupProps) => React.ReactElement;

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

  addGoal: ({ currentValues, handleFormPredicate, closeForm }) => (
    <AddGoalPopUp
      currentValues={currentValues}
      handleFormPredicate={(newGoal: Omit<GoalData, "id">) => {
        handleFormPredicate(newGoal);
      }}
      closeForm={closeForm}
    />
  ),

  editGoal: ({
    currentValues,
    handleFormPredicate,
    closeForm,
    handleDeletePredicate,
  }) => (
    <EditGoalPopUp
      currentValues={currentValues}
      handleFormPredicate={(newGoal: Omit<GoalData, "id">) => {
        handleFormPredicate(newGoal);
        console.log(newGoal);
      }}
      closeForm={closeForm}
      handleDeletePredicate={() => {
        handleDeletePredicate();
      }}
    />
  ),
};

export default function Layout() {
  const location = useLocation();
  const [popup, setPopup] = useState<PopupData | undefined>();

  function closeForm() {
    setPopup(undefined);
  }

  useEffect(closeForm, [location.pathname]);

  const PopupElement = popup ? popupMapping[popup.type] : null;

  return (
    <>
      <MainNav />
      <div className="layout">
        <Outlet context={{ setPopup: setPopup }} />
        {popup && (
          <div className="popup-overlay" onClick={closeForm}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
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
