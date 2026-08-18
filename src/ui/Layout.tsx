import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import MainNav from "./shared/Nav/MainNav";

import AddResourcePopUp from "./pages/Pieces/util/PopUp/AddResourcePopUp";
import EditResourcePopUp from "./pages/Pieces/util/PopUp/EditResourcePopUp";

import AddGoalPopUp from "./pages/Pieces/util/PopUp/AddGoalPopUp";
import EditGoalPopUp from "./pages/Pieces/util/PopUp/EditGoalPopUp";

import ViewSessionPopUp from "./pages/Session/util/ViewSubsessionPopUp";
import LinkTermPopUp from "./pages/Pieces/util/PopUp/LinkMusicTermPopUp";
import ViewMusicTermPopUp from "./shared/ViewMusicTermPopUp";

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
    }
  | {
      type: "viewSubsession";
      input: ExtendedSubsessionData;
      delete?: null;
      output: null;
    }
  | {
      type: "linkMusicTerm";
      input: TermData[];
      delete?: null;
      output: string;
    }
  | { type: "viewMusicTerm"; input: TermData; delete?: string; output?: null };

interface PopupProps {
  currentValues?: PopupState["input"];
  handleFormPredicate?: (data: PopupState["output"]) => void;
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
      //@ts-ignore
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
      //@ts-ignore
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
      //@ts-ignore
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
      //@ts-ignore
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

  viewSubsession: ({ currentValues, closeForm }) => (
    //@ts-ignore
    <ViewSessionPopUp currentValues={currentValues} closeForm={closeForm} />
  ),

  linkMusicTerm: ({ currentValues, closeForm, handleFormPredicate }) => (
    <LinkTermPopUp
      //@ts-ignore
      currentValues={currentValues}
      closeForm={closeForm}
      handleFormPredicate={(termId) => {
        handleFormPredicate(termId);
      }}
    />
  ),

  viewMusicTerm: ({ currentValues, closeForm, handleDeletePredicate }) => (
    <ViewMusicTermPopUp
      //@ts-ignore
      currentValues={currentValues}
      closeForm={closeForm}
      handleDeletePredicate={(termId) => {
        if (!handleDeletePredicate) return;
        handleDeletePredicate(termId);
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
