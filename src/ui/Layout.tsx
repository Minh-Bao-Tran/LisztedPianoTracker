import { useState } from "react";
import { Outlet } from "react-router";
import MainNav from "./shared/MainNav";

import AddResourcePopUp from "./pages/Pieces/util/AddResourcePopUp";

const popupMapping = {
  addResource: AddResourcePopUp,
  updateResource: <h1>Update Resource</h1>,
  addGoal: <h1>Add Goal</h1>,
  updateGoal: <h1>Update Goal</h1>,
  addMusicTermToPiece: <h1>Add MusicTermToPiece</h1>,
};

export default function Layout() {
  const [popupType, setPopupType] = useState<
    keyof typeof popupMapping | undefined
  >("addResource");

  return (
    <>
      <MainNav />
      <div className="layout">
        <Outlet />
        {popupType && (
          <div className="popup-overlay">
            <div className="popup">
              {popupMapping.addResource({ handleFormPredicate: () => {} })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
