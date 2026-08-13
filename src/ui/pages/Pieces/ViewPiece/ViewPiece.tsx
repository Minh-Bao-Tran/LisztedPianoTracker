import { useEffect, useState } from "react";
import { useParams, NavLink, Outlet, useOutletContext } from "react-router";

import type { PopupData } from "../../../Layout";

import EditIcon from "../../../assets/icon/Edit_icon.svg";
import SubNav from "../../../shared/SubNav";

import styles from "./ViewPiece.module.css";

export default function ViewPiecePage() {
  const pieceId = useParams().id;
  const { setPopup } = useOutletContext<{
    setPopup: (value: React.SetStateAction<PopupData | undefined>) => void;
  }>();

  //Fetching Function
  async function loadPieces() {
    window.electron
      .getOnePiece({
        id: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("No Piece found");
          throw new Error("No piece found");
        }
        setPiece(data);
      });
  }
  async function loadGoals() {
    window.electron
      .getAllPieceGoals({
        pieceId: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("Error in Loading Goals");
          throw new Error("Error in Loading Goals");
        }
        setGoals(data);
      });
  }
  async function loadResources() {
    window.electron
      .getAllPieceResources({
        pieceId: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("Error in Loading Resources");
          throw new Error("Error in Loading Resources");
        }
        setResources(data);
      });
  }
  async function loadSubsessions() {
    window.electron
      .getAllPieceSubsessions({
        pieceId: pieceId as string,
      })
      .then((data) => {
        if (!data) {
          alert("Error in Loading Subsessions");
          throw new Error("Error in Loading Subsessions");
        }
        setSubsessions(data);
      });
  }
  async function loadTerms() {
    window.electron
      .getAllPieceTerms({
        pieceId: pieceId as string,
      })
      .then((data) => {
        if (!data) {
          alert("Error in Loading Terms");
          throw new Error("Error in Loading Terms");
        }
        setTerms(data);
      });
  }
  async function loadAnalytics() {
    window.electron
      .getAnalytics({
        id: pieceId as string,
      })
      .then((data) => {
        // console.log(data);
        if (!data) {
          alert("Error in Loading Analytics");
          throw new Error("Error in Loading Analytics");
        }
        setAnalytics(data);
      });
  }

  //----Submit Functions----
  //Resource
  async function handleAddResource(newResource: Omit<ResourceData, "id">) {
    console.log(newResource);
    window.electron
      .addResource({
        pieceId: pieceId as string,
        resource: newResource,
      })
      .then((resourceId) => {
        // console.log(data);
        if (!resourceId) {
          alert("Error in Adding Resource");
          throw new Error("Error in Adding Resource");
        }
        setPopup(undefined);
        setReloadCount((reloadCount) => reloadCount + 1);
      });
  }
  async function handleUpdateResource(
    resourceId: string,
    newResource: Omit<ResourceData, "id">,
  ) {
    console.log(resourceId);
    window.electron
      .updateResource({
        updateCriteria: { id: resourceId },
        updatingFields: newResource,
      })
      .then((resourceId) => {
        // console.log(data);
        if (!resourceId) {
          alert("Error in Updating Resource");
          throw new Error("Error in Updating Resource");
        }
        setPopup(undefined);
        setReloadCount((reloadCount) => reloadCount + 1);
      });
  }
  async function handleDeleteResource(resourceId: string) {
    console.log(resourceId);
    window.electron
      .deleteResource({
        id: resourceId,
      })
      .then((success) => {
        // console.log(data);
        if (!success) {
          alert("Error in Deleting Resource");
          throw new Error("Error in Deleting Resource");
        }
        setPopup(undefined);
        setReloadCount((reloadCount) => reloadCount + 1);
      });
  }

  //Goal
  async function handleAddGoal(newGoal: Omit<GoalData, "id">) {
    console.log(newGoal);
    window.electron
      .addGoal({
        pieceId: pieceId as string,
        goal: newGoal,
      })
      .then((goalId) => {
        // console.log(data);
        if (!goalId) {
          alert("No Piece found");
          throw new Error("No piece found");
        }
        setPopup(undefined);
        setReloadCount((reloadCount) => reloadCount + 1);
      });
  }
  async function handleUpdateGoal(
    goalId: string,
    newGoal: Omit<GoalData, "id">,
  ) {
    console.log(goalId);
    window.electron
      .updateGoal({
        updateCriteria: { id: goalId },
        updatingFields: newGoal,
      })
      .then((goalId) => {
        // console.log(data);
        if (!goalId) {
          alert("Error in Updating Goal");
          throw new Error("Error in Updating Goal");
        }
        setPopup(undefined);
        setReloadCount((reloadCount) => reloadCount + 1);
      });
  }
  async function handleDeleteGoal(goalId: string) {
    console.log(goalId);
    window.electron
      .deleteGoal({
        id: goalId,
      })
      .then((success) => {
        // console.log(data);
        if (!success) {
          alert("Error in Deleting Goal");
          throw new Error("Error in Deleting Goald");
        }
        setPopup(undefined);
        setReloadCount((reloadCount) => reloadCount + 1);
      });
  }

  //---State Management---
  const [reloadCount, setReloadCount] = useState<number>(0);

  const [piece, setPiece] = useState<ExtendedPieceData | undefined>(undefined);
  const [goals, setGoals] = useState<GoalData[] | undefined>([]);
  const [resources, setResources] = useState<ResourceData[] | undefined>([]);
  const [terms, setTerms] = useState<TermData[] | undefined>([]);
  const [subsessions, setSubsessions] = useState<
    ExtendedSubsessionData[] | undefined
  >([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | undefined>(
    undefined,
  );

  //Fetch the Piece
  useEffect(() => {
    console.log(pieceId);
    loadPieces();
    loadGoals();
    loadResources();
    loadSubsessions();
    loadTerms();
    loadAnalytics();
  }, [pieceId, reloadCount]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.topButtonDiv}>
          <NavLink to="/pieces" className="small">
            &lt; Back
          </NavLink>
          <NavLink
            to={`/piece/${pieceId}/edit`}
            className="h3"
            style={{ display: "flex", alignItems: "bottom", gap: "10px" }}
          >
            <img src={EditIcon} alt="" />
            Edit
          </NavLink>
        </div>

        <div className={`card-box ${styles.pieceCard}`}>
          <div className={styles.pieceTitle}>
            <div>
              <h2>{piece && piece.name}</h2>
              <em
                className={`class-tag ${piece && (piece.status === "Completed" ? "alt1" : piece.status === "Planned" ? "alt2" : null)}`}
              >
                {piece && piece.status}
              </em>
            </div>
            <h3>{piece && piece.composer}</h3>
          </div>

          <div className={styles.additionalInfo}>
            <div>
              <h3>
                {piece &&
                  piece.lastPracticeDate?.toLocaleString("en-AU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
              </h3>
              <small>Last Practiced</small>
            </div>
            <div>
              <h3>
                {piece &&
                  piece.freqNumber &&
                  `${piece.freqNumber} times/${piece.freqFrame}`}
              </h3>
              <small>Practice Frequency</small>
            </div>

            <NavLink to="/sessions" className="btn-blue">
              Practice
            </NavLink>
          </div>
        </div>
        <SubNav
          subNavData={[
            { url: `/piece/${pieceId}/view`, title: "Overview", end: true },
            { url: `/piece/${pieceId}/view/goals`, title: "Goals" },
            {
              url: `/piece/${pieceId}/view/sessions`,
              title: "Practiced Subsessions",
            },
            { url: `/piece/${pieceId}/view/resources`, title: "Resources" },
            { url: `/piece/${pieceId}/view/terms`, title: "Music Terms" },
            { url: `/piece/${pieceId}/view/analytics`, title: "Analytics" },
          ]}
        />
      </header>

      <main className={styles.main}>
        <section>
          <Outlet
            context={{
              piece,
              analytics,
              goals,
              subsessions,
              resources,
              terms,
              setPopup,

              //Resource Section
              handleAddResource,
              handleDeleteResource,
              handleUpdateResource,

              //Goal Section
              handleAddGoal,
              handleUpdateGoal,
              handleDeleteGoal,
            }}
          />
        </section>
      </main>
    </>
  );
}
